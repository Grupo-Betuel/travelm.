import React, {useEffect, useMemo, useState} from 'react';
import {
    Avatar,
    Button,
    Card, CardBody, CardFooter, CardHeader,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    Typography
} from '@material-tailwind/react';
import {Swiper, SwiperSlide} from "swiper/react";
import AudioPlayer from "./AudioCard";
import {Navigation, Pagination} from "swiper/modules";
import {ExtraMediaTypesEnum, IMedia, IMediaFile, MediaTypeEnum} from "@/models/mediaModel";
import {useConfirmAction} from "@/hooks/useConfirmActionHook";
import {CommonConfirmActions, CommonConfirmActionsDataTypes} from "@/models/common";
import {getCrudService} from "@/api/services/CRUD.service";
import {AppImage} from "@/components/AppImage";
import {MediaList} from "@/components/MediaList";
import {useAuth} from "@/context/authContext";
import {AiOutlineCloudUpload} from "react-icons/ai";
import {CgClose} from "react-icons/cg";
import {IoSearch} from "react-icons/io5";
import {IMG_CONSTANTS} from "@/constants/img.utils";


const renderMediaPreview = (media: IMediaFile): JSX.Element => {
    const mediaType = media.type;
    console.log(media)
    switch (mediaType) {
        case 'image':
            // @ts-ignore
            // return <img src={media.content} alt={media.name} className="max-w-full h-auto"/>;
            return <>
                <AppImage
                    src={media.content}
                    alt={media.title}
                    // caption={{
                    //     title: `${media.title.replace(/\.[^/.]+$/, '')}`,
                    // }}
                />
            </>
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
    logo?: IMediaFile;
    images: IMediaFile[];
    videos: IMediaFile[];
    audios: IMediaFile[];
}

export interface IHandleMediaFormProps {
    disableUpload?: boolean;
    onChange: (data: IMediaHandled) => any;
    medias?: IMedia[];
    flyerMedia?: IMediaFile;
    logoMedia?: IMedia;
    handle?: {
        images?: boolean;
        videos?: boolean;
        audios?: boolean;
        flyer?: boolean;
        logo?: boolean;
    }
}

export const mediasService = getCrudService('medias');

const MediaHandler = ({onChange, medias, disableUpload, logoMedia, flyerMedia, handle}: IHandleMediaFormProps) => {
    const [flyer, setFlyer] = useState<IMediaFile>();
    const [logo, setLogo] = useState<IMediaFile>();
    const [images, setImages] = useState<IMediaFile[]>([]);
    const [videos, setVideos] = useState<IMediaFile[]>([]);
    const [audios, setAudios] = useState<IMediaFile[]>([]);
    const {user} = useAuth()

    useEffect(() => {
        if (flyerMedia) {
            setFlyer(flyerMedia);
        }
    }, [flyerMedia]);


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

    const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const imagesMedias: IMediaFile[] = Array.from(event.target.files).map(file => ({
                type: MediaTypeEnum.IMAGE,
                content: URL.createObjectURL(file),
                title: file?.name || 'No title',
                owner: user?.organization,
                file,
            }));

            const allData = [...images, ...imagesMedias]
            setImages(allData);
        }
    };

    const handleFlyerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            const flyerMedia: IMediaFile = {
                content: URL.createObjectURL(file),
                title: file?.name || 'No title',
                owner: user?.organization,
                type: MediaTypeEnum.IMAGE,
                file,
            };

            setFlyer(flyerMedia);
        }
    };

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            const logoMediaFile: IMediaFile = {
                content: URL.createObjectURL(file),
                title: file?.name || 'No title',
                owner: user?.organization,
                type: MediaTypeEnum.IMAGE,
                file,
            };

            setLogo(logoMediaFile);
        }
    };

    const handleVideosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const videosMedias: IMediaFile[] = Array.from(event.target.files).map(file => ({
                type: MediaTypeEnum.VIDEO,
                content: URL.createObjectURL(file),
                owner: user?.organization,
                title: file?.name || 'No title',
                file,
            }));
            setVideos(videosMedias);
        }
    };

    const handleAudiosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const audiosMedias: IMediaFile[] = Array.from(event.target.files).map(file => ({
                type: MediaTypeEnum.AUDIO,
                content: URL.createObjectURL(file),
                owner: user?.organization,
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
        onChange({flyer, images, videos, audios, logo});
    }, [flyer, images, videos, audios, logo]);

    const onDeleteMedia = async (media: IMedia) => {
        const mediaType = media.type;
        switch (mediaType) {
            case 'image':
                if (media.content === flyer?.content) setFlyer(undefined);
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
    }
    const oneFlyer = flyer ? [flyer] : [];
    const allImagesMedia = useMemo(() => {
        return flyer ? [flyer, ...images] : images;
    }, [images, flyer])

    const imagesMedia = useMemo(() => {
        return images ? [...images] : images;
    }, [images])

    const [searchMediaModal, setSearchMediaModal] = useState(false);
    const [selectedMediaSelectorType, setSelectedMediaSelectorType] = useState<MediaTypeEnum | ExtraMediaTypesEnum>();

    const [selectedMedia, setSelectedMedia] = useState<IMedia[]>([]);

    const onSelectMedia = (medias: IMedia[], media: IMedia) => {
        setSelectedMedia(medias as IMediaFile[]);
    }

    const handleSetSelectedMedia = () => {
        switch (selectedMediaSelectorType) {
            case 'image':
                setImages([...images, ...selectedMedia] as IMediaFile[])
                break;
            case 'video':
                setVideos([...videos, ...selectedMedia] as IMediaFile[]);
                break;
            case 'audio':
                setAudios([...audios, ...selectedMedia] as IMediaFile[]);
                break;
            case 'flyer':
                setFlyer(selectedMedia[0] as IMediaFile);
                break;
            case 'logo':
                setLogo(selectedMedia[0] as IMediaFile);
                break;
            default:
                break;
        }
        setSearchMediaModal(false);
    }

    const toggleSearchMediaModal = (mediaType?: MediaTypeEnum | ExtraMediaTypesEnum) => () => {
        const newValue = !searchMediaModal;
        if (newValue) {
            let media = images;
            switch (mediaType) {
                case 'image':
                    media = images;
                    break;
                case 'video':
                    media = videos;
                    break;
                case 'audio':
                    media = audios;
                    break;
                case 'flyer':
                    media = flyer ? [flyer] : [];
                case 'logo':
                    media = logo ? [logo] : [];
                    break;
                default:
                    break;
            }

            setSelectedMedia(medias || []);
            setSelectedMediaSelectorType(mediaType);
        } else {
            setSelectedMedia([]);
            setSelectedMediaSelectorType(undefined);
        }
        setSearchMediaModal(newValue);
    }


    return (
        <div className="space-y-2 p-2">
            <div className='lg:flex mb-10 space-x-2'>
                {(handle?.logo) && <>
                    <div className="flex items-center gap-5">
                        <div className="flex flex-col items-center gap-2">
                            <Avatar src={logo?.content || logoMedia?.content || IMG_CONSTANTS.LOGO_PLACEHOLDER}
                                    size="lg"/>
                            <Typography variant="h6">Logo</Typography>

                        </div>
                        <IoSearch onClick={toggleSearchMediaModal(ExtraMediaTypesEnum.LOGO)}
                                  className="text-blue-400 w-[23px] h-[23px] cursor-pointer"/>
                        {!disableUpload && <label>
                            <input type="file" className="hidden absolute -z-10" placeholder="flyer" accept="image/*"
                                   onChange={handleLogoChange}/>
                            <AiOutlineCloudUpload className="h-10 cursor-pointer text-blue-400 w-[26px]"/>
                        </label>}
                    </div>
                </>
                }
                <>
                {/*{(!handle || handle.flyer) && <>*/}
                {/*    <div className="flex items-center gap-5">*/}
                {/*        <Typography variant="h6">Flyer ({flyer ? 1 : 0}):</Typography>*/}
                {/*        <IoSearch onClick={toggleSearchMediaModal(ExtraMediaTypesEnum.FLYER)}*/}
                {/*                  className="text-blue-400 w-[23px] h-[23px] cursor-pointer"/>*/}
                {/*        {!disableUpload && <label>*/}
                {/*            <input type="file" className="hidden absolute -z-10" placeholder="flyer" accept="image/*"*/}
                {/*                   onChange={handleFlyerChange}/>*/}
                {/*            <AiOutlineCloudUpload className="h-10 cursor-pointer text-blue-400 w-[26px]"/>*/}
                {/*        </label>}*/}
                {/*    </div>*/}
                {/*</>*/}
                {/*}*/}

                {/*{(!handle || handle.images) &&*/}
                {/*    <div className="flex items-center gap-5">*/}
                {/*        <Typography variant="h6" className="whitespace-nowrap">Imagenes ({images.length}):</Typography>*/}
                {/*        <IoSearch onClick={toggleSearchMediaModal(MediaTypeEnum.IMAGE)}*/}
                {/*                  className="text-blue-400 w-[23px] h-[23px] cursor-pointer"/>*/}
                {/*        {!disableUpload && <label>*/}
                {/*            <input type="file" className="hidden absolute -z-10" placeholder="flyer" accept="image/*"*/}
                {/*                   onChange={handleImagesChange}/>*/}
                {/*            <AiOutlineCloudUpload className="h-10 w-10 cursor-pointer text-blue-400 w-[26px]"/>*/}
                {/*        </label>}*/}
                {/*    </div>*/}
                {/*}*/}

                {/*{(!handle || handle.videos) &&*/}
                {/*    <div className="flex items-center gap-3">*/}
                {/*        <Typography variant="h6">Videos</Typography>*/}
                {/*        <Input type="file" placeholder="videos" accept="video/*" onChange={handleVideosChange} multiple/>*/}
                {/*    </div>*/}
                {/*}*/}

                {/*{(!handle || handle.audios) &&*/}
                {/*    <div className="flex items-center gap-5">*/}
                {/*        <Typography variant="h6">Audios ({audios.length}):</Typography>*/}
                {/*        <IoSearch onClick={toggleSearchMediaModal(MediaTypeEnum.AUDIO)}*/}
                {/*                  className="text-blue-400 w-[23px] h-[23px] cursor-pointer"/>*/}
                {/*        {!disableUpload && <label>*/}
                {/*            <input type="file" className="hidden absolute -z-10" placeholder="flyer" accept="audio/*"*/}
                {/*                   onChange={handleAudiosChange}/>*/}
                {/*            <AiOutlineCloudUpload className="h-10 cursor-pointer text-blue-400 w-[26px]"/>*/}
                {/*        </label>}*/}
                {/*    </div>*/}
                {/*}*/}

                </>
            </div>
            <div className='lg:flex gap-2 '>
                {(!handle || handle.flyer) && (
                    <div className='lg:w-1/3'>
                        <Card className=''>
                            <CardHeader
                                className='relative bg-gradient-to-tr from-blue-600 to-blue-400 shadow-blue-500/40 p-2'>
                                <div className="flex justify-center items-center gap-3">
                                    <Typography color='white' variant="h5">Flyer:</Typography>
                                </div>
                            </CardHeader>
                            <CardBody className='p-4'>
                                <div className='overflow-hidden max-h-[600px]'>
                                    {oneFlyer.length > 0 && (<>
                                            {oneFlyer.map((image, index) => (
                                                <div key={`image-slide-${index}`}
                                                     className="relative col-span-1 row-span-1">
                                                    {renderMediaPreview(image)}
                                                    <CgClose
                                                        onClick={() => handleSetActionToConfirm('delete', 'quitar esta imagen')(image)}
                                                        className="absolute top-2 right-2 cursor-pointer h-8 w-8 p-1 text-red-500 bg-white rounded-full z-50"
                                                    />
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </CardBody>
                            <CardFooter className='align-bottom p-2'>
                                <div className="flex justify-center items-center gap-3">
                                    {/*<Typography variant="h6">Flyer ({flyer ? 1 : 0}):</Typography>*/}
                                    <IoSearch onClick={toggleSearchMediaModal(ExtraMediaTypesEnum.FLYER)}
                                              className="text-blue-400 w-[23px] h-[23px] cursor-pointer"/>
                                    {!disableUpload && <label>
                                        <input type="file" className="hidden absolute -z-10" placeholder="flyer"
                                               accept="image/*"
                                               onChange={handleFlyerChange}/>
                                        <AiOutlineCloudUpload
                                            className="h-10 cursor-pointer text-blue-400 w-[26px]"/>
                                    </label>}
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                )}
                {(!handle || handle.images) && (<>
                    <div className='w-2/3'>
                        <Card className=''>
                            <CardHeader
                                className='relative bg-gradient-to-tr from-blue-600 to-blue-400 shadow-blue-500/40 p-2'>
                                <div className="flex justify-center items-center ">
                                    <Typography color='white'
                                                variant="h5">Imagenes {images.length > 0 && (images.length)}</Typography>
                                </div>
                            </CardHeader>
                            <CardBody className='p-2'>
                                <div className='grid lg:grid-cols-4 md:grid-cols-2 gap-2 overflow-y-auto max-h-[600px]'>
                                    {imagesMedia.length > 0 && (<>
                                        {imagesMedia.map((image, index) => (
                                            <div key={`image-slide-${index}`}
                                                 className="relative col-span-1 row-span-1 w-42 h-44">
                                                {renderMediaPreview(image)}
                                                <CgClose
                                                    onClick={() => handleSetActionToConfirm('delete', 'quitar esta imagen')(image)}
                                                    className="absolute top-2 right-2 cursor-pointer h-8 w-8 p-1 text-red-500 bg-white rounded-full z-50"
                                                />
                                            </div>
                                        ))}
                                    </>)}
                                </div>
                            </CardBody>
                            <CardFooter className='align-baseline p-4'>
                                <div className="flex justify-center items-center gap-3">
                                    {/*<Typography variant="h6" className="whitespace-nowrap">Imagenes ({images.length}):</Typography>*/}
                                    <IoSearch onClick={toggleSearchMediaModal(MediaTypeEnum.IMAGE)}
                                              className="text-blue-400 w-[23px] h-[23px] cursor-pointer"/>
                                    {!disableUpload && <label>
                                        <input type="file" className="hidden absolute -z-10" placeholder="flyer"
                                               accept="image/*"
                                               onChange={handleImagesChange}/>
                                        <AiOutlineCloudUpload className="h-10 cursor-pointer text-blue-400 w-[26px]"/>
                                    </label>}
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </>)}
            </div>

            {(!handle || handle.audios) && (<>
                <div className='w-full'>
                    <Card className='my-10'>
                        <CardHeader
                            className='relative bg-gradient-to-tr from-blue-600 to-blue-400 shadow-blue-500/40 p-2'>
                            <div className="flex justify-center items-center ">
                                <Typography color='white'
                                            variant="h5">Audios {audios.length > 0 && (audios.length)}</Typography>
                            </div>
                        </CardHeader>
                        <CardBody className="p-2 ">
                            <div className="grid grid-cols-3 gap-4 max-h-[300px] overflow-y-auto">
                                {audios.map((audio, index) => (
                                    <div key={`audio-${index}`} className="relative">
                                        <div
                                            className="relative col-span-1 row-span-1 w-42 h-44"

                                        >
                                        <AudioPlayer
                                            key={`audio-${index}`}
                                            src={audio.content}
                                            title={`Audio Track ${index + 1}`}
                                        />
                                        <CgClose
                                            onClick={() => handleSetActionToConfirm('delete', 'quitar esta audio')(audio)}
                                            className="absolute top-2 right-2 cursor-pointer h-8 w-8 p-1 text-red-500 bg-white rounded-full z-50"
                                        />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                        <CardFooter className='align-baseline p-4'>
                            <div className="flex justify-center items-center gap-3">
                                <IoSearch onClick={toggleSearchMediaModal(MediaTypeEnum.AUDIO)}
                                          className="text-blue-400 w-[23px] h-[23px] cursor-pointer"/>
                                {!disableUpload && <label>
                                    <input type="file" className="hidden absolute -z-10" placeholder="flyer"
                                           accept="audio/*"
                                           onChange={handleAudiosChange}/>
                                    <AiOutlineCloudUpload className="h-10 cursor-pointer text-blue-400 w-[26px]"/>
                                </label>}
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </>)}

            {/*{allImagesMedia.length > 0 && (*/}
            {/*    <Swiper*/}
            {/*        cssMode*/}
            {/*        modules={[Navigation, Pagination]}*/}
            {/*        spaceBetween={10} slidesPerView={3} navigation*/}
            {/*        pagination={{clickable: true}} className="relative h-[300px] w-full">*/}
            {/*        {allImagesMedia.map((image, index) => (*/}
            {/*            <SwiperSlide key={`image-slide-${index}`} className="flex justify-center">*/}
            {/*                <div className="flex">*/}
            {/*                    {renderMediaPreview(image)}*/}
            {/*                    <CgClose onClick={() =>*/}
            {/*                        handleSetActionToConfirm('delete', 'quitar esta imagen')(image)*/}
            {/*                    }*/}
            {/*                             className="absolute top-4 cursor-pointer right-4 h-8 w-8 p-1 text-red-500 z-50 bg-white rounded-full"/>*/}
            {/*                </div>*/}
            {/*            </SwiperSlide>*/}

            {/*        ))}*/}
            {/*    </Swiper>*/}
            {/*)}*/}


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

            {/*{audios.map((audio, index) => (*/}
            {/*    <AudioPlayer key={`audio-${index}`} src={audio.content}*/}
            {/*                 title={`Audio Track ${index + 1}`}/>*/}
            {/*))}*/}
            <ConfirmDialog/>

            <Dialog open={searchMediaModal} handler={toggleSearchMediaModal()}>
                <DialogHeader className="text-center">
                    <Typography variant="h3" className="text-center">
                        Confirmación
                    </Typography>
                </DialogHeader>
                <DialogBody className="overflow-y-scroll max-h-[80dvh]">
                    <MediaList
                        mediaType={selectedMediaSelectorType === ExtraMediaTypesEnum.FLYER || selectedMediaSelectorType === ExtraMediaTypesEnum.LOGO ?
                            MediaTypeEnum.IMAGE
                            : selectedMediaSelectorType as MediaTypeEnum
                        }
                        multiple={selectedMediaSelectorType !== ExtraMediaTypesEnum.FLYER && selectedMediaSelectorType !== ExtraMediaTypesEnum.LOGO}
                        onSelect={onSelectMedia}
                    />
                </DialogBody>
                <DialogFooter>
                    <Button onClick={toggleSearchMediaModal()}
                            size="lg" color="red" variant="text">Cancel</Button>
                    <Button size="lg" color="green" variant="text"
                            onClick={handleSetSelectedMedia}>Confirmar</Button>{' '}
                </DialogFooter>
            </Dialog>

        </div>

    );

};

export default MediaHandler;
