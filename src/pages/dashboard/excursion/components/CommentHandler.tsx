import React, {useEffect, useState} from "react";
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    Textarea,
    Card,
    CardHeader,
    CardBody,
    Typography,
    CardFooter,
} from "@material-tailwind/react";
import MediaHandler from "@/pages/dashboard/excursion/components/MediaHandler";
import {IMedia} from "@/models/mediaModel";
import {IComment} from "@/models/commentModel";
import {PencilIcon, TrashIcon} from "@heroicons/react/20/solid";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import {AppImage} from "@/components/AppImage";
import {useAuth} from "@/context/authContext";
import IUser from "@/models/interfaces/userModel";
import {CommonConfirmActions, CommonConfirmActionsDataTypes} from "@/models/common";
import {useConfirmAction} from "@/hooks/useConfirmActionHook";

interface CommentHandlerProps {
    isDialog?: boolean;
    open?: boolean;
    onClose: () => void;
    initialComments?: IComment[];
    onChangeComments: (payments: IComment[]) => void;
    updateComments: (comments: IComment[]) => void;
    onDeleteComments: (payment: IComment) => void;
}

const DefaultComment: IComment = {
    text: "",
    medias: [],
    createDate: new Date(),
};

export const CommentHandler: React.FC<CommentHandlerProps> = ({
                                                                  isDialog = false,
                                                                  open = false,
                                                                  onClose,
                                                                  initialComments = [],
                                                                  updateComments,
                                                                  onDeleteComments
                                                              }) => {
    const [comments, setComments] = useState<IComment[]>(initialComments);
    const [newComment, setNewComment] = useState<IComment>(DefaultComment);
    const [editing, setEditing] = useState<boolean>(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [medias, setMedias] = useState<IMedia[]>([]);
    const [selectedComment, setSelectedComment] = useState<IComment | null>(null);
    const {user} = useAuth();

    useEffect(() => {
        if (initialComments && initialComments.length > 0) {
            setComments(initialComments);
        }
    }, [initialComments]);

    const handleInputChange = (field: keyof IComment, value: any) => {
        if (editing && editIndex !== null) {
            const updatedComments = [...comments];
            updatedComments[editIndex] = {...updatedComments[editIndex], [field]: value};
            setComments(updatedComments);
        } else {
            setNewComment({...newComment, [field]: value});
        }
    };

    const handleSave = () => {
        if (!newComment.text.trim()) {
            alert("El comentario no puede estar vacío.");
            return;
        }

        let updatedComments;
        if (editing && editIndex !== null) {
            updatedComments = [...comments];
            updatedComments[editIndex] = {...newComment, medias};
            setEditing(false);
            setEditIndex(null);
        } else {
            const newCommentWithMedia = {...newComment, medias, author: user as IUser};
            updatedComments = [...comments, newCommentWithMedia];
        }

        setComments(updatedComments);
        updateComments(updatedComments);

        setNewComment(DefaultComment);
        setMedias([]);
    };

    const startEditing = (index: number) => {
        setEditIndex(index);
        setEditing(true);
        setNewComment(comments[index]);
        setMedias(comments[index].medias || []);
    };

    const cancelEditing = () => {
        setEditing(false);
        setEditIndex(null);
        setNewComment(DefaultComment);
        setMedias([]);
    };


    const onConfirmAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IComment>) => {
        switch (type) {
            case 'delete':
                const updatedComments = comments.filter((c) => c.createDate !== data?.createDate);
                setComments(updatedComments);
                updateComments(updatedComments);
                onDeleteComments(data as IComment);
                break;
        }
    };

    const onDeniedAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IComment>) => {
        // Acciones si la confirmación fue denegada (opcional)
    };

    const {
        handleSetActionToConfirm,
        resetActionToConfirm,
        ConfirmDialog
    } = useConfirmAction<CommonConfirmActions, CommonConfirmActionsDataTypes<IComment>>(onConfirmAction, onDeniedAction);


    const renderFormContent = () => (
        <>
            <Textarea
                value={newComment.text}
                onChange={(e) => handleInputChange('text', e.target.value)}
                label="Comentario"
            />
            <MediaHandler onChange={(media) => setMedias(media.images)} handle={{images: true}}/>
            <Button onClick={handleSave} color={editing ? "blue" : "green"}>
                {editing ? "Guardar Cambios" : "Agregar Comentario"}
            </Button>
            {editing && <Button onClick={cancelEditing} color="red">Cancelar</Button>}

            <div className="grid grid-cols-3 gap-4 py-4">
                {comments.map((comment, index) => (
                    <Card className="border border-blue-gray-100 shadow-sm h-full space-y-4" key={index}>
                        {comment.medias && comment.medias.length > 0 && (
                            <CardHeader className="h-32 w-full mx-0 p-0">
                                <Swiper modules={[Navigation, Pagination]} navigation pagination={{clickable: true}}
                                        className="relative h-full rounded-md">
                                    {comment.medias.map((media, i) => (
                                        <SwiperSlide key={i}>
                                            <AppImage src={media.content} alt={media.title}/>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </CardHeader>
                        )}
                        <CardBody className="p-2 text-right">
                            <Typography variant="small" className="font-normal text-blue-gray-600">
                                {comment.text.length > 50 ? `${comment.text.slice(0, 50)}...` : comment.text}
                            </Typography>
                            <Typography variant="small" color="blue-gray">
                                {new Date(comment.createDate).toLocaleDateString()}
                            </Typography>
                        </CardBody>
                        <CardFooter className="border-t border-blue-gray-50 p-2 mt-auto items-end">
                            <div className="flex space-x-1 justify-end">
                                {comment.text.length > 50 && (
                                    <Button variant="text" className="p-2" color="blue"
                                            onClick={() => setSelectedComment(comment)}>
                                        Ver más
                                    </Button>
                                )}
                                <Button variant="text" className="p-2" color="blue" onClick={() => startEditing(index)}>
                                    <PencilIcon className="w-5 h-5"/>
                                </Button>
                                <Button variant="text" className="p-2" color="red"
                                        onClick={() => handleSetActionToConfirm('delete')(comment)}>
                                    <TrashIcon className="w-5 h-5"/>
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

        </>
    );

    return isDialog ? (
        <Dialog open={open} handler={onClose}>
            <DialogHeader>Comentario</DialogHeader>
            <DialogBody className="h-[70vh] overflow-y-auto space-y-4">
                {renderFormContent()}
            </DialogBody>
            <DialogFooter className='space-x-4'>
                <Button variant="text"  onClick={onClose} color={"red"}>
                    Cancel
                </Button>
            </DialogFooter>
            {selectedComment && (
                <Dialog open={true} handler={() => setSelectedComment(null)}>
                    <DialogHeader>{selectedComment.author?.firstName}</DialogHeader>
                    <DialogBody divider>
                        <Typography>{selectedComment.text}</Typography>
                    </DialogBody>
                    <Swiper modules={[Navigation, Pagination]} navigation pagination={{clickable: true}}
                            className="relative h-full rounded-md">
                        {selectedComment.medias ? (
                            selectedComment.medias.map((media, i) => (
                                <SwiperSlide key={i}>
                                    <AppImage src={media.content} alt={media.title}/>
                                </SwiperSlide>
                            ))
                        ) : undefined
                        }
                    </Swiper>
                    <DialogFooter>
                        <Button variant="text" color="blue" onClick={() => setSelectedComment(null)}>
                            Cerrar
                        </Button>
                    </DialogFooter>
                </Dialog>
            )}
        </Dialog>
    ) : (
        <div className="form-container">
            {renderFormContent()}
            <div className="flex justify-end space-x-2">
                <Button onClick={onClose} className="bg-gray-500 text-white p-2 rounded-md">
                    Cancel
                </Button>
            </div>
        </div>
    );
};
