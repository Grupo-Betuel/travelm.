import React, {useEffect, useMemo, useState} from "react";
import {Tabs, Tab, TabsHeader, TabPanel, TabsBody} from "@material-tailwind/react";
import {IMedia, MediaTypeEnum} from "../models/mediaModel";
import {getCrudService} from "../api/services/CRUD.service";
import {FaVideo, FaFileAlt, FaMusic} from "react-icons/fa";
import {useConfirmAction} from "../hooks/useConfirmActionHook";
import {Button} from "@material-tailwind/react";
import {CommonConfirmActions} from "../models/common";
import {useGCloudMediaHandler} from "../hooks/useGCloudMedediaHandler";
import {IoReload} from "react-icons/io5";
import {AiOutlineCloudUpload} from "react-icons/ai";
import {useAuth} from "../context/authContext";
import {parseMultipleFilesToMedia} from "../utils/media.utils";

export interface MediaListProps {
    multiple?: boolean;
    onSelect: (media: IMedia[], selectedItem: IMedia) => void;
    mediaType?: MediaTypeEnum;
}

const mediaService = getCrudService("medias");

export const MediaList: React.FC<MediaListProps> = ({onSelect, multiple, mediaType}) => {
    const [selectedType, setSelectedType] = useState<MediaTypeEnum>(mediaType || MediaTypeEnum.IMAGE);
    const [medias, setMedias] = useState<IMedia[]>([]);
    const [selectedMedias, setSelectedMedias] = useState<IMedia[]>([]);
    const [deleteMedia] = mediaService.useDeleteMedias();
    const [addMedia] = mediaService.useAddMedias();
    const {deleteImage} = useGCloudMediaHandler();
    const {user} = useAuth();
    const {uploadMultipleMedias} = useGCloudMediaHandler();

    const {
        data: mediaByTypeData,
        refetch: refetchCurrentMediaType,
    } = mediaService.useFetchAllMedias({type: selectedType});

    useEffect(() => {
        mediaType && setSelectedType(mediaType || selectedType);
    }, [mediaType]);
    const onConfirmAction = (type?: CommonConfirmActions, data?: IMedia) => {
        if (type === 'delete') {
            handleDeleteMedia(data as IMedia);
        }
    };

    const {
        handleSetActionToConfirm,
        resetActionToConfirm,
        ConfirmDialog,
    } = useConfirmAction<CommonConfirmActions, IMedia>(onConfirmAction, () => {
    });

    useEffect(() => {
        if (mediaByTypeData) {
            setMedias(mediaByTypeData);
        }
    }, [mediaByTypeData]);

    const handleSelect = (media: IMedia) => {
        let updatedSelectedMedias: IMedia[];

        if (multiple) {
            updatedSelectedMedias = selectedMedias.includes(media)
                ? selectedMedias.filter((m) => m._id !== media._id)
                : [...selectedMedias, media];
        } else {
            updatedSelectedMedias = selectedMedias.includes(media) ? [] : [media];
        }

        setSelectedMedias(updatedSelectedMedias);
        onSelect(updatedSelectedMedias, media);
    };

    const handleDeleteMedia = (media: IMedia) => {
        const filteredMedias = medias.filter((m) => m._id !== media._id);
        setMedias(filteredMedias);
        media._id && deleteMedia(media._id);
        deleteImage(media);
    };

    const renderMedia = (media: IMedia) => {
        if (media.type === MediaTypeEnum.IMAGE) {
            return <div className="w-full h-[150px] flex items-center justify-center  overflow-hidden">
                <img src={media.content} className="w-full rounded-xl" alt={media.title}/>
            </div>;
        } else if (media.type === MediaTypeEnum.VIDEO) {
            return <FaVideo className="text-4xl"/>;
        } else if (media.type === MediaTypeEnum.AUDIO) {
            return <FaMusic className="text-4xl"/>;
        } else {
            return <FaFileAlt className="text-4xl"/>;
        }
    };

    const onSelectTab = (type: MediaTypeEnum) => () => {
        setSelectedType(type);
    };


    const uploadMedia = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files) return;
        if (!selectedType) {
            // Todo: TOAST
            return;
        }

        const mediasFiles = parseMultipleFilesToMedia(selectedType, Array.from(files), user?.organization as string);

        const uploadedImages = await uploadMultipleMedias(mediasFiles);

        if (uploadedImages) {
            setMedias([...uploadedImages, ...medias]);
        }

        await addMedia(uploadedImages);
        refetchCurrentMediaType();

    }

    const currentAcceptType = useMemo(() => {
        return selectedType === MediaTypeEnum.IMAGE ? 'image/*' :
            selectedType === MediaTypeEnum.VIDEO ? 'video/*' :
                selectedType === MediaTypeEnum.AUDIO ? 'audio/*' : '*';
    }, [selectedType])

    return (
        <div className="p-4 h-[70vh]">
            <div className="w-full flex justify-between pb-4">
                <Button
                    variant={"text"}
                    color="blue"
                    className="flex items-center gap-2 "
                    onClick={refetchCurrentMediaType}>
                    <label
                        className="flex items-center gap-2 "
                    >
                        <input type="file"
                               className="hidden absolute -z-10"
                               multiple
                               accept={currentAcceptType}
                               onChange={uploadMedia}/>
                        Subir
                        <AiOutlineCloudUpload className="h-10 w-10 cursor-pointer text-blue-400 w-[21px]"/>
                    </label>
                </Button>
                <Button
                    variant={"text"}
                    color="blue"
                    className="flex items-center gap-2 "
                    onClick={refetchCurrentMediaType}>
                    Recargar
                    <IoReload className="w-[18px] h-[18px]"/>
                </Button>
            </div>
            <div>
                <Tabs value={selectedType}>
                    <TabsHeader>
                        <Tab value={MediaTypeEnum.IMAGE} onClick={onSelectTab(MediaTypeEnum.IMAGE)}>
                            Images
                        </Tab>
                        <Tab value={MediaTypeEnum.VIDEO} onClick={onSelectTab(MediaTypeEnum.VIDEO)}>
                            Videos
                        </Tab>
                        <Tab value={MediaTypeEnum.AUDIO} onClick={onSelectTab(MediaTypeEnum.AUDIO)}>
                            Audio
                        </Tab>
                        <Tab value={MediaTypeEnum.DOCUMENT} onClick={onSelectTab(MediaTypeEnum.DOCUMENT)}>
                            Documents
                        </Tab>
                    </TabsHeader>
                    <TabsBody>
                        <TabPanel
                            value={selectedType}
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                            {medias.map((media) => (
                                <div
                                    key={media._id}
                                    className={`p-2 border rounded-xl cursor-pointer relative bg-gray-50 ${selectedMedias.includes(media) ? "!bg-blue-200" : ""}`}
                                    onClick={() => handleSelect(media)}
                                >
                                    {renderMedia(media)}
                                    <Button
                                        className="my-3"
                                        size="sm"
                                        fullWidth
                                        color="red"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log('delete', media);
                                            handleSetActionToConfirm('delete')(media);
                                        }}
                                    >
                                        Eliminar
                                    </Button>
                                    <p className="mt-2 whitespace-pre-line line-clamp-1 !w-[106%]">{media.title}</p>
                                </div>
                            ))}
                        </TabPanel>
                    </TabsBody>
                </Tabs>
            </div>
            <ConfirmDialog/>
        </div>
    );
};
