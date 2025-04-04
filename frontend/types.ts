export type ProductCardInfo = {
    title: string;
    price: number;
    image: string;
    link: string;
};

export interface Product {
    id: string
    title: string
    dynamicPricing: string
    relevantFiles: string[]
    insights: string
    associatedJobIds: string[]
  }
  
  export interface TrackingJob {
    id: string
    listing: string
    startDate: string
    endDate: string
    insights: string
  }
  
  