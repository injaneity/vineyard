export type ProductCardInfo = {
    title: string;
    price: number;
    image: string;
    link: string;
};

export type ProfileLinkInfo = {
    shopee_url: string;
    lazada_url: string;
    carousell_url: string;
}

export type ProfileScrapeResponse = {
    shopee: ProductCardInfo[];
    lazada: ProductCardInfo[];
    carousell: ProductCardInfo[];
}