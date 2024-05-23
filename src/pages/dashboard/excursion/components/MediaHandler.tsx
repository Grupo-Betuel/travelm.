import React, {useEffect, useState} from 'react';
import {Input, Button} from '@material-tailwind/react';
import {Swiper, SwiperSlide} from "swiper/react";
import AudioPlayer from "./AudioCard";
import {Navigation, Pagination} from "swiper/modules";
import {IMedia, IMediaFile} from "../../../../models/mediaModel";
import {TrashIcon} from "@heroicons/react/20/solid";
import {ServiceDetailActions, ServiceDetailActionsDataTypes} from "../../../../models/serviceModel";
import {IPayment} from "../../../../models/PaymentModel";
import {useConfirmAction} from "../../../../hooks/useConfirmActionHook";
import {CommonConfirmActions, CommonConfirmActionsDataTypes} from "../../../../models/common";
import {getCrudService} from "../../../../api/services/CRUD.service";
import {useGCloudMediaHandler} from "../../../../hooks/useGCloudMedediaHandler";


const renderMediaPreview = (media: IMediaFile): JSX.Element => {
    const mediaType = media.type;

    switch (mediaType) {
        case 'image':
            // @ts-ignore
            return <img src={media.content} alt={media.name} className="max-w-full h-auto"/>;
        case 'video':
            return (
                <video controls className="max-w-full h-auto">
                    {/*// @ts-ignore*/}
                    <source src={media.content} type={media.type}/>
                </video>
            );
        default:
            return <></>;
    }
};

export interface IMediaHandled {
    flyer?: IMediaFile;
    images: IMediaFile[];
    videos: IMediaFile[];
    audios: IMediaFile[];
}

export interface IHandleMediaFormProps {
    onChange: (data: IMediaHandled) => any;
    medias?: IMedia[];
}

export const mediasService = getCrudService('medias');

const MediaHandler = ({onChange, medias}: IHandleMediaFormProps) => {
    const [flyer, setFlyer] = useState<IMediaFile>();
    const [images, setImages] = useState<IMediaFile[]>([]);
    const [videos, setVideos] = useState<IMediaFile[]>([]);
    const [audios, setAudios] = useState<IMediaFile[]>([]);
    const [deleteMedia] = mediasService.useDeleteMedias();
    const {deleteImage} = useGCloudMediaHandler();

    const onConfirmAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IMedia>) => {
        switch (type) {
            case 'delete':
                onDeleteMedia(data as IMedia);
                break;
        }
    }

    const onDeniedAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IMedia>) => {

    }

    const {
        handleSetActionToConfirm,
        resetActionToConfirm,
        ConfirmDialog
    } = useConfirmAction<CommonConfirmActions, CommonConfirmActionsDataTypes<IMedia>>(onConfirmAction, onDeniedAction);

    useEffect(() => {
        if (medias && medias.length > 0) {
            const imagesData = [] as IMediaFile[];
            const videosData = [] as IMediaFile[];
            const audiosData = [] as IMediaFile[];
            const currentMedia = [...images, ...videos, ...audios];
            (medias as IMediaFile[]).forEach((media: IMediaFile) => {
                const exist = currentMedia.find((m) => m.content === media.content);
                if (exist) return;

                if (media.type === 'image') {
                    imagesData.push(media);
                } else if (media.type === 'video') {
                    videosData.push(media);
                } else if (media.type === 'audio') {
                    audiosData.push(media);
                }
            });

            imagesData.length && setImages([...imagesData, ...images]);
            videosData.length && setVideos([...videosData, ...videos]);
            audiosData.length && setAudios([...audiosData, ...audios]);

        }
    }, [medias]);

    const handleFlyerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const flyerMedia: IMedia = {
                type: 'image',
                // @ts-ignore
                content: URL.createObjectURL(event.target.files[0]),
                title: event.target.files[0].name
            }
        }
    };

    const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const imagesMedias: IMediaFile[] = Array.from(event.target.files).map(file => ({
                type: 'image',
                // @ts-ignore
                content: URL.createObjectURL(file),
                title: file?.name || 'No title',
                file,
            }));

            const allData = [...images, ...imagesMedias]

            // const newImages = Array.from(new Set(allData.map(item => item.content))).map(content => {
            //     return allData.find(item => item.content === content) as IMediaFile;
            // });

            setImages(allData);
        }
    };

    const handleVideosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const videosMedias: IMediaFile[] = Array.from(event.target.files).map(file => ({
                type: 'video',
                // @ts-ignore
                content: URL.createObjectURL(file),
                title: file?.name || 'No title',
                file,
            }));
            setVideos(videosMedias);
        }
    };

    const handleAudiosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const audiosMedias: IMediaFile[] = Array.from(event.target.files).map(file => ({
                type: 'audio',
                // @ts-ignore
                content: URL.createObjectURL(file),
                title: file?.name || 'No title',
                file,
            }));
            setAudios(audiosMedias);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Here you would handle the submission of the media, e.g., uploading to a server
        console.log('Submit:', {flyer, images, videos, audios});
    };

    useEffect(() => {
        onChange({flyer, images, videos, audios});
    }, [flyer, images, videos, audios]);

    const onDeleteMedia = async (media: IMedia) => {
        const mediaType = media.type;
        switch (mediaType) {
            case 'image':
                setImages(images.filter((m) => m.content !== media.content));
                break;
            case 'video':
                setVideos(videos.filter((m) => m.content !== media.content));
                break;
            case 'audio':
                setAudios(audios.filter((m) => m.content !== media.content));
                break;
            default:
                break;
        }
        if (media._id) {
            await deleteMedia(media._id as string);
            await deleteImage(media);
        }
    }

    // @ts-ignore
    return (
        <div className="space-y-4 p-4">
            <Input type="file" placeholder="images" accept="image/*" onChange={handleImagesChange} multiple/>
            <Input type="file" placeholder="videos" accept="video/*" onChange={handleVideosChange} multiple/>
            <Input type="file" placeholder="audio" accept="audio/*" onChange={handleAudiosChange} multiple/>

            {images.length > 0 && (
                <Swiper modules={[Navigation, Pagination]} spaceBetween={10} slidesPerView={1} navigation
                        pagination={{clickable: true}} className="relative h-[300px] w-full">
                    {images.map((image, index) => (
                        <SwiperSlide key={`image-slide-${index}`} className="flex justify-center">
                            <div className="flex">
                                {renderMediaPreview(image)}
                                <TrashIcon onClick={() =>
                                    handleSetActionToConfirm('delete', 'Eliminar Imagen')(image)
                                }
                                           className="absolute top-4 cursor-pointer right-4 h-10 w-10 text-red-500 z-50"/>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            {videos.length > 0 && (
                <Swiper modules={[Navigation, Pagination]} spaceBetween={10} slidesPerView={1} navigation
                        pagination={{clickable: true}} className="relative h-[300px] w-full">
                    {videos.map((video, index) => (
                        <SwiperSlide key={`video-slide-${index}`} className="flex justify-center">
                            {renderMediaPreview(video)}
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            {audios.map((audio, index) => (
                // @ts-ignore
                <AudioPlayer key={`audio-${index}`} src={audio.content}
                             title={`Audio Track ${index + 1}`}/>
            ))}
            <ConfirmDialog/>

        </div>
    );

};

export default MediaHandler;
