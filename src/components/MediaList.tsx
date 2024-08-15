import React, {useEffect, useMemo, useState} from "react";
import {
    Tabs,
    Tab,
    TabsHeader,
    TabPanel,
    TabsBody,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem, Input
} from "@material-tailwind/react";
import {IMedia, MediaTypeEnum} from "@/models/mediaModel";
import {getCrudService} from "@/api/services/CRUD.service";
import {FaVideo, FaFileAlt, FaMusic} from "react-icons/fa";
import {useConfirmAction} from "@/hooks/useConfirmActionHook";
import {Button} from "@material-tailwind/react";
import {CommonConfirmActions} from "@/models/common";
import {useGCloudMediaHandler} from "@/hooks/useGCloudMedediaHandler";
import {IoReload} from "react-icons/io5";
import {AiOutlineCloudUpload} from "react-icons/ai";
import {useAuth} from "@/context/authContext";
import {parseMultipleFilesToMedia} from "@/utils/media.utils";
import {Bars3Icon} from "@heroicons/react/20/solid";
import {BASIC_CONSTANTS} from "@/constants/basic.constants";

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
    const [updateMedia] = mediaService.useUpdateMedias();
    const [addMedia] = mediaService.useAddMedias();
    const {deleteImage} = useGCloudMediaHandler();
    const {user} = useAuth();
    const {uploadMultipleMedias} = useGCloudMediaHandler();

    //TODO: Test this code
    const [renameModalOpen, setRenameModalOpen] = useState(false);
    const [mediaToRename, setMediaToRename] = useState<IMedia | null>(null);
    const [newTitle, setNewTitle] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    //END TODO

    const {
        data: mediaByTypeData,
        refetch: refetchCurrentMediaType,
    } = mediaService.useFetchAllMedias({type: selectedType});

    useEffect(() => {
        mediaType && setSelectedType(mediaType || selectedType);
    }, [mediaType]);
        console.log('Aver',mediaByTypeData)
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

    const handleRename = () => {
        if (mediaToRename && typeof mediaToRename._id === 'string') {  // Ensure _id is a string
            const updatedMedia = {...mediaToRename, title: newTitle, _id: mediaToRename._id as string};
            updateMedia(updatedMedia); // Call your update function
            setMedias((prevMedias) =>
                prevMedias.map((media) => media._id === mediaToRename._id ? updatedMedia : media)
            );
            setRenameModalOpen(false);
        } else {
            // Handle the case where _id is undefined (optional)
            console.error('Media ID is missing or invalid.');
        }
    };


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
        deleteImage(media).then(r => console.log(r));
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

    const filteredMedias = useMemo(() => {
        return medias.filter((media) =>
            media.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [medias, searchTerm]);


    return (
        <div className="p-4 h-[70vh]">
            <div className="w-full flex justify-between items-center pb-4">
                <Input
                    crossOrigin={false}
                    type="text"
                    label="Buscar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded mb-4 mr-4"
                />
                <div className="flex items-center gap-2">
                    <Button
                        variant={"text"}
                        color="blue"
                        className="flex items-center gap-2 "
                        onClick={refetchCurrentMediaType}>
                        <label className="flex items-center gap-2">
                            <input
                                type="file"
                                className="hidden absolute -z-10"
                                multiple
                                accept={currentAcceptType}
                                onChange={uploadMedia}
                            />
                            Subir
                            <AiOutlineCloudUpload className="h-10 cursor-pointer text-blue-400 w-[21px]"/>
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
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4"
                        >
                            {filteredMedias.map((media) => (
                                <div
                                    key={media._id}
                                    className={`p-2 border rounded-xl cursor-pointer relative bg-gray-50 ${selectedMedias.includes(media) ? "!bg-blue-200" : ""}`}
                                    onClick={() => handleSelect(media)}
                                >
                                    {renderMedia(media)}
                                    <div className="absolute top-2 right-2">
                                        <Menu>
                                            <MenuHandler>
                                                <Bars3Icon className="h-6 w-6 text-gray-500"/>
                                            </MenuHandler>
                                            <MenuList className='z-[9999]'>
                                                <MenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        console.log('delete', media);
                                                        handleSetActionToConfirm('delete')(media);
                                                    }}
                                                >
                                                    {BASIC_CONSTANTS.DELETE_TEXT}
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setMediaToRename(media);
                                                        setNewTitle(media.title);
                                                        setRenameModalOpen(true);
                                                    }}
                                                >
                                                    Renombrar
                                                </MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </div>

                                    <p className="whitespace-pre-line line-clamp-1 !w-[106%]">{media.title}</p>
                                </div>
                            ))}
                        </TabPanel>
                    </TabsBody>
                </Tabs>

                {renameModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-4 rounded-xl w-[300px]">
                            <h3 className="text-lg font-semibold mb-4">Renombrar Media</h3>
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <div className="flex justify-end gap-2 mt-4">
                                <Button onClick={() => setRenameModalOpen(false)} variant="text">{BASIC_CONSTANTS.CANCEL_TEXT}</Button>
                                <Button onClick={handleRename} color="blue">{BASIC_CONSTANTS.SAVE_TEXT}</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <ConfirmDialog/>
        </div>

    );
};
