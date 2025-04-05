'use client'

import React, { useEffect, useState } from "react";
import { ProductCardInfo } from "@/types";
import ProductCard from "@/components/ui/ProductCard";
import { testdata } from "@/testdata";
import { useParams } from "next/navigation";

export default function SearchResults() {
    const params = useParams();
    const productQuery = params.product; // Access the [query] parameter
    const productPlatform = params.platform;
    const [products, setProducts] = useState<ProductCardInfo[]>([]);

    useEffect(() => {
        const data = localStorage.getItem('scrapedData');
        if (data) {
          const parsedData = JSON.parse(data);
          
          // Get platform-specific results
          if (productPlatform && typeof productPlatform === 'string') {
            const platformKey = `${productPlatform.toLowerCase()}_results`;
            const platformData = parsedData[platformKey]?.scraped_data || [];
            console.log(parsedData);
            
            
            // Map platform data to ProductCardInfo format
            const formattedProducts = platformData.map((item: any) => ({
              title: item.title,
              price: item.price,
              image: item.image,
              link: item.link,
              discount: item.discount || 0
            }));
            
            setProducts(formattedProducts);
          }
        }
      }, [productPlatform]);

    return (
        <div>
            <div className="w-full h-[50px] p-8 text-lg">Search results for <span className="font-bold">{productQuery}</span> from <span className="font-bold">{productPlatform}</span>:</div>
            <div className="flex flex-wrap justify-center items-center gap-4">
                {products.length > 0 ? 
                  products.map((item, index) => (
                    <ProductCard key={index} {...item} />
                  ))
                  :
                  testdata.map((item, index) => (
                    <ProductCard key={index} {...item} />
                  ))
                }
            </div>
        </div>
    )
}