import axiosClient from './axiosClient'
import { ProfileLinkInfo, ProfileScrapeResponse } from '@/types';

export const getProfileProducts = async (profile_links: ProfileLinkInfo, username: string = "default_user"): Promise<ProfileScrapeResponse> => {
    try {
        console.log("Request payload:", { ...profile_links, username });
        const response = await axiosClient.post<ProfileScrapeResponse>(`/onboard`, {
            ...profile_links,
            username: "user"
        });
        console.log("Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error getting profile products", error);
        throw error;
    }
}