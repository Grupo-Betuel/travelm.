import axios from "axios";
import axiosInstance from "../axios.service";

export const uploadGCloudImage = async (file: any, selectedTag: string = 'media', type: string = 'image/png') => {
    const filename = encodeURIComponent(file.name);
    const res = await axiosInstance.get(`/gcloud/upload-url/${filename}/${selectedTag}/${type.replace('/', '^')}`);
    const {url, fields} = await res.data;
    // @ts-ignore
    const formData = new FormData();

    Object.entries({...fields, file}).forEach(([key, value]: any) => {
        formData.append(key, value);
    });

    return await axios.post(url, formData);
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
