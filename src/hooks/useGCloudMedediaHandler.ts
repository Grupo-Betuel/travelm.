import React from 'react';
import {IMedia, IMediaFile} from "../models/mediaModel";
import {deletePhoto} from "../api/services/gcloud.service";
import {onChangeMediaToUpload, uploadMedia} from "../utils/gcloud.utils";
import {getCrudService} from "../api/services/CRUD.service";

const mediasService = getCrudService('medias');
export const useGCloudMediaHandler = () => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [imageToDelete, setImageToDelete] = React.useState<IMedia>();
    const [tags, setTags] = React.useState([]);
    const [deleteMediaData] = mediasService.useDeleteMedias();
    const onChangeElementImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true);
        await onChangeMediaToUpload('media', () => {
        }, 'media')(event);
        setLoading(false);
    }


    const uploadImage = async (media: IMedia) => {
        setLoading(true);
        try {
            // const mediaResults = await uploadMedia(media, selectedTag);

            // const blob = dataURItoBlob(media.content)
            // const productURLName = 'image';
            // const photoName = `${productURLName}-${Date.now()}.png`;
            // const file = new File([blob], photoName);
            // const responseImage = await uploadGCloudImage(file, selectedTag);
            // const url = `https://storage.googleapis.com/download/storage/v1/b/betuel-tech-photos/o/${photoName}?alt=media`;
            // media.content = url;
            // setImages([mediaResults, ...images]);
            // toast("Media Agregada", {type: "default"})
            // return mediaResults;

        } catch (err: any) {
            // toast(err.message, {type: "error"})
        }
        setLoading(false);
    }

    const deleteImage = async (image: IMedia) => {
        setLoading(true);
        try {
            const name = image.content.split('/').pop();
            await deletePhoto(name as string);
        } catch (err: any) {
            // toast(err.message, {type: "error"})
        }
        setLoading(false);
        resetImageToDelete()
    }

    const resetImageToDelete = () => setImageToDelete(undefined);

    const deleteSelectedImage = () => imageToDelete && deleteImage(imageToDelete)
    const selectImageToDelete = (image: IMedia) => (ev: any) => {
        ev.stopPropagation();
        setImageToDelete(image)
    };

    const uploadMultipleMedias = async (medias: IMediaFile[] = []) => {
        const results = await Promise.all(medias.map(async media => await uploadMedia(media)));
        return results;
    }

    const uploadSingleMedia = async (media: IMediaFile) => {
        if(!media.file) return;
        const results = await uploadMedia(media);
        return results;
    }

    const deleteMedias = async (medias: IMedia[]) => {
        const deletedMedias = await Promise.all(medias.map(async media => {
            await deleteImage(media)
            return media._id && await deleteMediaData(media._id);
        }));

        return deletedMedias;
    }

    return {
        uploadMultipleMedias,
        uploadSingleMedia,
        deleteMedias,
        loading,
        // onChangeElementImage,
        deleteSelectedImage,
        selectImageToDelete,
        resetImageToDelete,
        deleteImage,
    }
}