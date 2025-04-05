import axiosClient from './axiosClient'
 import { ProductActivityResponse } from '@/types';
 
 export const getMyProductsAndActivity = async (id : string):Promise<ProductActivityResponse> => {
     try {
         const response = await axiosClient.post<ProductActivityResponse>(`/dashboard`, {
            username: "user" // Send as an object with username field
        });return response.data;
     } catch (error) {
         console.error("Error getting profile products", error);
         throw error;
     }
 }