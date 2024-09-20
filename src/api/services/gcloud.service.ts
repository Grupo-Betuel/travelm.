import axios from "axios";
import axiosInstance from "../axios.service";

import imageCompression from 'browser-image-compression';

// Function to compress the image
const compressImage = async (file: File): Promise<File> => {
    const options = {
        maxSizeMB: 1.000, // Maximum size in MB
        maxWidthOrHeight: 1080, // Maximum width or height in pixels
        useWebWorker: true,
    };
    try {
        return await imageCompression(file, options);
    } catch (error) {
        console.error("Error compressing the image:", error);
        return file;
    }
};

export const uploadGCloudImage = async (file: File, selectedTag: string = 'media', type: string = 'image/png') => {
    try {
        const compressedFile = await compressImage(file);
        const filename = encodeURIComponent(compressedFile.name);
        const res = await axiosInstance.get(`/gcloud/upload-url/${filename}/${selectedTag}/${type.replace('/', '^')}`);
        const { url, fields } = res.data;
        const formData = new FormData();

        Object.entries({ ...fields, file: compressedFile }).forEach(([key, value]: any) => {
            formData.append(key, value);
        });

        return await axios.post(url, formData);
    } catch (error) {
        console.error("Error uploading the image:", error);
        throw error;
    }
};


export const gcloudPublicURL = "https://storage.googleapis.com/betuel-tech-photos/"
export const gcloudAuthenticatedURL = "https://storage.cloud.google.com/betuel-tech-photos/"

export const deletePhoto = async (filename: string) => {
    return await axiosInstance.delete(`/gcloud/image/${filename}`);
}


export const getGCloudImages = async () => {
    try {
        const response = await axiosInstance.get(`/gcloud/images`);
        return await response.data;
    } catch (e) {
        throw e;
    }
}
