"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bell, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriceGraph } from "@/components/price-graph";

import { useParams } from "next/navigation";

// Sample pricing data
const shopeeData = [
  { date: "2023-01-01", price: 18.5 },
  { date: "2023-01-15", price: 17.2 },
  { date: "2023-02-01", price: 16.8 },
  { date: "2023-02-15", price: 16.0 },
  { date: "2023-03-01", price: 15.84 },
];

const lazadaData = [
  { date: "2023-01-01", price: 15.7 },
  { date: "2023-01-15", price: 16.03 },
  { date: "2023-02-01", price: 17.8 },
  { date: "2023-02-15", price: 15.35 },
  { date: "2023-03-01", price: 17.01 },
];

const carousellData = [
  { date: "2023-01-01", price: 17.78 },
  { date: "2023-01-15", price: 20.5 },
  { date: "2023-02-01", price: 21.65 },
  { date: "2023-02-15", price: 23.98 },
  { date: "2023-03-01", price: 21.43 },
];

export default function SearchProduct() {
  const params = useParams();
  const initialSearchTerm = params.product;
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [productImage, setProductImage] = useState("");
  const [alertsOn, setAlertsOn] = useState(false);
  const [insights, setInsights] = useState("");
  const [lazadaAvgPrice, setLazadaAvgPrice] = useState(0);
  const [carousellAvgPrice, setCarousellAvgPrice] = useState(0);

  // Parse insights text into an array of bullet points
  const parseInsights = (insightsText) => {
    if (!insightsText) return [];
    // Split by "- " pattern and remove empty items
    return insightsText.split('- ')
      .filter(point => point.trim().length > 0)
      .map(point => point.trim());
  };

  // Helper function to safely parse price values
  const parsePrice = (price) => {
    if (typeof price === 'number') {
      return price;
    }
    if (typeof price === 'string') {
      return parseFloat(price.replace(/[^\d.]/g, ''));
    }
    return NaN; // Return NaN for unparseable values
  };

  // In the destination page component
  useEffect(() => {
    setIsClient(true);
    const data = localStorage.getItem('scrapedData');
    if (data) {
      const parsedData = JSON.parse(data);
      
      // Set product image
      if (parsedData?.carousell_results?.scraped_data?.length > 0) {
        const firstImage = parsedData.carousell_results.scraped_data[0].image;
        setProductImage(firstImage);
      }
      
      // Set insights
      if (parsedData?.insights) {
        setInsights(parsedData.insights);
      }
      
      // Calculate average price for Carousell
      if (parsedData?.carousell_results?.scraped_data?.length > 0) {
        const carousellPrices = parsedData.carousell_results.scraped_data
          .map(item => parsePrice(item.price))
          .filter(price => !isNaN(price));
          
        if (carousellPrices.length > 0) {
          const average = carousellPrices.reduce((sum, price) => sum + price, 0) / carousellPrices.length;
          setCarousellAvgPrice(average);
        }
      }
      
      // Calculate average price for Lazada
      if (parsedData?.lazada_results?.scraped_data?.length > 0) {
        const lazadaPrices = parsedData.lazada_results.scraped_data
          .map(item => parsePrice(item.price))
          .filter(price => !isNaN(price));
          
        if (lazadaPrices.length > 0) {
          const average = lazadaPrices.reduce((sum, price) => sum + price, 0) / lazadaPrices.length;
          setLazadaAvgPrice(average);
        }
      }
    }
  }, []);

  // Toggle alerts on/off
  const toggleAlerts = () => {
    setAlertsOn((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg">
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
          <Button variant="ghost" size="icon">
            <User className="h-6 w-6" />
          </Button>
        </div>

        {/* Product Details */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Product Image */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm px-0"> {/* removed horizontal paddings */}
              <div className="aspect-square relative w-full">
                <Image
                  src={productImage || "/placeholder.png"}
                  alt="Product Image"
                  fill
                  className="rounded-lg object-contain"
                />
              </div>
            </div>
          </div>

          {/* Product Info and Price Comparison */}
          <div className="space-y-6">
            {/* Product Info */}
            <h1 className="text-3xl md:text-4xl font-bold">{searchTerm}</h1>
            <Button
              onClick={toggleAlerts}
              className="bg-black hover:bg-black/90"
            >
              <Bell className="mr-2 h-4 w-4" />
              {alertsOn ? "Alerts On" : "Alerts Off"}
            </Button>

            {/* Price Comparisons */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Price Comparison</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Lazada */}
                <Link href={`/search/${searchTerm}/lazada`} className="block">
                  <Card className="p-4 h-full cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100">
                          <span className="text-blue-500 font-medium">L</span>
                        </div>
                        <span className="font-medium">Lazada</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-bold">
                          ${lazadaAvgPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-center">
                      {isClient ? (
                        <PriceGraph data={lazadaData} color="#1a94ff" />
                      ) : (
                        <div className="h-[60px] bg-gray-100 flex items-center justify-center text-xs">
                          Loading chart...
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>

                {/* Carousell */}
                <Link href={`/search/${searchTerm}/carousell`} className="block">
                  <Card className="p-4 h-full cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-green-100">
                          <span className="text-green-500 font-medium">C</span>
                        </div>
                        <span className="font-medium">Carousell</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-bold">
                          ${carousellAvgPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-center">
                      {isClient ? (
                        <PriceGraph data={carousellData} color="#23c48e" />
                      ) : (
                        <div className="h-[60px] bg-gray-100 flex items-center justify-center text-xs">
                          Loading chart...
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="mt-12">
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-bold">Vineyard AI Insights</h2>
            {insights ? (
              <ul className="list-disc pl-5 space-y-3">
                {parseInsights(insights).map((point, index) => (
                  <li key={index} className="text-muted-foreground">
                    {point}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Loading...</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
