"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, ArrowRight, ImagePlus, X, Link, ChevronDown, Search as SearchIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { scrape } from "@/services/scrapeAPI";
import { getInsights } from "@/services/insightsAPI";
import { getMyProductsAndActivity } from "@/services/dashboardAPI";
import { DashboardProductCard } from "@/types";

export default function Search() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState("");
  const [selectedSites, setSelectedSites] = useState({
    shopee: false,
    lazada: false,
    carousell: false
  });
  const [referenceProducts, setReferenceProducts] = useState(false);
  const [userProducts, setUserProducts] = useState<DashboardProductCard[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<DashboardProductCard[]>([]);
  const [filterQuery, setFilterQuery] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      const duration = 10000; // 2 seconds
      const interval = 10; // Update every 10ms
      const steps = duration / interval;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        setProgress(Math.min((currentStep / steps) * 100, 95)); // Max out at 95% until complete
      }, interval);

      return () => clearInterval(timer);
    } else {
      setProgress(100); // Complete the progress bar
      const resetTimer = setTimeout(() => setProgress(0), 300); // Reset after animation
      return () => clearTimeout(resetTimer);
    }
  }, [isLoading]);

  // Add new useEffect to load user products when checkbox is checked
  useEffect(() => {
    async function fetchUserProducts() {
      if (referenceProducts) {
        setLoadingProducts(true);
        try {
          const data = await getMyProductsAndActivity("some-id");
          console.log("Loaded products:", data.products);
          
          // Make sure products have unique identifiers
          const productsWithIds = (data.products || []).map(product => ({
            ...product,
            // Generate a unique ID if none exists
            _uniqueId: product.id || `product-${Math.random().toString(36).substr(2, 9)}`
          }));
          
          setUserProducts(productsWithIds);
        } catch (err) {
          console.error("Failed to load user products", err);
        } finally {
          setLoadingProducts(false);
        }
      }
    }
    
    fetchUserProducts();
  }, [referenceProducts]);

  // Fix the toggle selection function to use unique identifiers
  const toggleProductSelection = (product: DashboardProductCard & { _uniqueId?: string }, event?: React.MouseEvent) => {
    // Prevent event bubbling if this is triggered by a checkbox click
    if (event) {
      event.stopPropagation();
    }
    
    const productId = product._uniqueId || product.id;
    console.log(`Toggling product with ID: ${productId}, Title: ${product.title}`);
    
    setSelectedProducts(prev => {
      const isSelected = prev.some(p => (p._uniqueId || p.id) === productId);
      console.log(`Current selection state: ${isSelected}`);
      
      if (isSelected) {
        return prev.filter(p => (p._uniqueId || p.id) !== productId);
      } else {
        // Add the product with its unique ID
        return [...prev, {...product, _uniqueId: productId}];
      }
    });
  };

  // Helper function to check if a product is selected using unique ID
  const isProductSelected = (product: DashboardProductCard & { _uniqueId?: string }) => {
    const productId = product._uniqueId || product.id;
    return selectedProducts.some(p => (p._uniqueId || p.id) === productId);
  };

  // Filter products based on search query
  const filteredProducts = filterQuery 
    ? userProducts.filter(p => 
        p.title?.toLowerCase().includes(filterQuery.toLowerCase())
      )
    : userProducts;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue) return;

    // Set loading state immediately
    setIsLoading(true);
    setProgress(0);

    // Small delay before starting the actual operation to ensure loading UI is shown
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      // Create a promise that resolves after 2 seconds
      const minimumLoadingTime = new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );

      // First run scrape and wait for its results
      const scrapedData = await scrape(inputValue);
      localStorage.setItem('scrapedData', JSON.stringify(scrapedData));
      // // Then run insights with the scraped data
      // const insights = await getInsights(inputValue, scrapedData);

      // Wait for minimum loading time
      await minimumLoadingTime;
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // Add a small delay before navigation to ensure smooth transition
      await new Promise((resolve) => setTimeout(resolve, 300));
      setIsLoading(false);
      router.push(`/search/${inputValue}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSiteChange = (site: 'shopee' | 'lazada' | 'carousell') => {
    setSelectedSites(prev => ({
      ...prev,
      [site]: !prev[site]
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-zinc-900 text-white flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Scraping data for "{inputValue}"
          </h2>
          <Progress value={progress} className="w-full h-2" />
          <p className="text-center text-zinc-400 mt-4">
            This might take a few moments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-zinc-50">
      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4">
          <div className="flex justify-end items-center py-4">
            {/* Auth buttons */}
            <div className="flex gap-2">
              <Button className="bg-black text-white hover:bg-black/90">
                Sign up
              </Button>
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                Log in
              </Button>
            </div>
          </div>

          {/* Search Content */}
          <div className="mx-auto max-w-3xl py-32">
            <h1 className="mb-8 text-center text-4xl font-semibold">
              Get insights on a product
            </h1>

            <div className="space-y-2">
              {/* Search input */}
              <div className="relative">
                <Input
                  placeholder="Enter the product name"
                  className="h-14 rounded-2xl bg-zinc-900 px-4 text-lg text-white placeholder:text-zinc-400 pr-12"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white"
                    onClick={() => handleSubmit()}
                    disabled={!inputValue}
                  >
                    {inputValue ? (
                      <ArrowRight className="h-4 w-4 text-black" />
                    ) : (
                      <Mic className="h-4 w-4 text-black" />
                    )}
                    <span className="sr-only">
                      {inputValue ? "Submit" : "Voice input"}
                    </span>
                  </Button>
                </span>
              </div>
              
              {/* Platforms and Reference Products - New Layout */}
              <div className="mt-4 flex gap-4">
                {/* E-commerce website checkboxes */}
                <div className="flex-1 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-1.5">Search on these platforms:</p>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="shopee" 
                        checked={selectedSites.shopee}
                        onCheckedChange={() => handleSiteChange('shopee')}
                      />
                      <Label htmlFor="shopee" className="text-sm">Shopee</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="lazada" 
                        checked={selectedSites.lazada}
                        onCheckedChange={() => handleSiteChange('lazada')}
                      />
                      <Label htmlFor="lazada" className="text-sm">Lazada</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="carousell" 
                        checked={selectedSites.carousell}
                        onCheckedChange={() => handleSiteChange('carousell')}
                      />
                      <Label htmlFor="carousell" className="text-sm">Carousell</Label>
                    </div>
                  </div>

                  {/* Custom URL input moved here */}
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-1.5">Or add a specific URL:</p>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          placeholder="https://example.com/product"
                          className="pl-9"
                          value={customUrl}
                          onChange={(e) => setCustomUrl(e.target.value)}
                        />
                        <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Enter a direct product URL from any supported e-commerce website
                    </p>
                  </div>
                </div>
                
                {/* Reference your products - removed fixed height */}
                <div className="flex-1 p-3 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                  <div className="flex items-center space-x-2 shrink-0">
                    <Checkbox 
                      id="reference-products" 
                      checked={referenceProducts}
                      onCheckedChange={(checked) => setReferenceProducts(!!checked)}
                    />
                    <Label htmlFor="reference-products" className="text-sm font-medium">Reference your products</Label>
                  </div>
                  
                  {referenceProducts ? (
                    <div className="mt-2 flex-1 flex flex-col min-w-0">
                      <div className="shrink-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between h-8 text-sm">
                              {selectedProducts.length > 0 ? (
                                <span className="truncate">{selectedProducts.length} product(s) selected</span>
                              ) : (
                                <span className="text-gray-500">Select products</span>
                              )}
                              <ChevronDown className="ml-2 h-3 w-3 shrink-0" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-[300px] max-h-[350px]">
                            {/* Search filter */}
                            <div className="p-2 border-b">
                              <div className="relative">
                                <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  placeholder="Filter products..."
                                  value={filterQuery}
                                  onChange={(e) => setFilterQuery(e.target.value)}
                                  className="pl-8 py-1 h-8 text-sm"
                                />
                              </div>
                            </div>
                            
                            {/* Products list with checkboxes */}
                            <div className="overflow-y-auto max-h-[250px]">
                              {loadingProducts ? (
                                <DropdownMenuItem key="loading" disabled>
                                  Loading products...
                                </DropdownMenuItem>
                              ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => {
                                  // Determine if this product is selected using our new method
                                  const isSelected = isProductSelected(product);
                                  const uniqueId = product._uniqueId || product.id || `product-${Math.random()}`;
                                  
                                  return (
                                    <div 
                                      key={uniqueId}
                                      className="flex items-center px-2 py-1.5 hover:bg-gray-100 cursor-pointer"
                                    >
                                      <Checkbox 
                                        id={`product-checkbox-${uniqueId}`}
                                        className="mr-2 flex-shrink-0" 
                                        checked={isSelected}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleProductSelection(product);
                                        }}
                                      />
                                      <label 
                                        htmlFor={`product-checkbox-${uniqueId}`}
                                        className="text-sm cursor-pointer flex-grow truncate"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          toggleProductSelection(product);
                                        }}
                                      >
                                        {product.title || "Unnamed Product"}
                                      </label>
                                    </div>
                                  );
                                })
                              ) : filterQuery ? (
                                <div className="px-2 py-1.5 text-sm text-gray-500">
                                  No matching products found
                                </div>
                              ) : (
                                <DropdownMenuItem key="no-products" disabled>
                                  No products found
                                </DropdownMenuItem>
                              )}
                            </div>
                            
                            {/* Selection summary */}
                            {selectedProducts.length > 0 && (
                              <div className="p-2 border-t">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-500">
                                    {selectedProducts.length} selected
                                  </span>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedProducts([])}
                                    className="h-6 text-xs"
                                  >
                                    Clear
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      {/* Selected products preview with optimized spacing */}
                      {selectedProducts.length > 0 ? (
                        <div className="mt-2 overflow-y-auto max-h-[110px] pr-1 w-full">
                          <p className="text-xs font-medium text-gray-500 mb-1 shrink-0">Selected products:</p>
                          {selectedProducts.map((product) => {
                            const uniqueId = product._uniqueId || product.id || `selected-${Math.random()}`;
                            return (
                              <div 
                                key={uniqueId} 
                                className="flex items-center justify-between bg-gray-50 rounded px-2 py-0.5 mb-1 w-full min-w-0"
                              >
                                <span className="text-xs truncate mr-1 flex-1 min-w-0">{product.title}</span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-4 w-4 flex-shrink-0"
                                  onClick={() => toggleProductSelection(product)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col justify-center items-center text-center py-2">
                          <div className="mb-1 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                              <rect width="16" height="20" x="4" y="2" rx="2" />
                              <line x1="8" x2="16" y1="8" y2="8" />
                              <line x1="8" x2="16" y1="12" y2="12" />
                              <line x1="8" x2="12" y1="16" y2="16" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-500">Compare with products you've previously searched</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-center items-center text-center py-2">
                      <div className="mb-1 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                          <rect width="16" height="20" x="4" y="2" rx="2" />
                          <line x1="8" x2="16" y1="8" y2="8" />
                          <line x1="8" x2="16" y1="12" y2="12" />
                          <line x1="8" x2="12" y1="16" y2="16" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">Reference your own products for more refined searches</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Remove the standalone custom URL box since it's now in the platforms box */}
            
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
