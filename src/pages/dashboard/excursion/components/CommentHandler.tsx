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
import MediaHandler, {IMediaHandled} from "@/pages/dashboard/excursion/components/MediaHandler";
import {IMedia} from "@/models/mediaModel";
import {IComment} from "@/models/commentModel";
import {PencilIcon, TrashIcon} from "@heroicons/react/20/solid";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import {AppImage} from "@/components/AppImage";
import {useAuth} from "@/context/authContext";
import IUser from "@/models/interfaces/userModel";
import {ICustomComponentDialog} from "@/models/common";


interface CommentHandlerProps {
    dialog?: ICustomComponentDialog;
    initialComments?: IComment[];
    onUpdateComments: (comments: IComment) => void;
    onDeleteComments: (comment: IComment) => void;
}

const emptyComment: IComment = {
    text: "",
    medias: undefined,
    createDate: new Date(),
    author: {} as IUser
};

export const CommentHandler: React.FC<CommentHandlerProps> = ({
                                                                  dialog,
                                                                  initialComments = [],
                                                                  onUpdateComments,
                                                                  onDeleteComments,
                                                              }) => {
    const [comments, setComments] = useState<IComment[]>(initialComments);
    const [newComment, setNewComment] = useState<IComment>(emptyComment);
    const [selectedComment, setSelectedComment] = useState<IComment | null>(null);
    const {user} = useAuth();

    useEffect(() => {
        if (initialComments && initialComments.length > 0) {
            setComments(initialComments);
        }
    }, [initialComments]);

    const handleInputChange = (field: keyof IComment, value: any) => {
        setNewComment(prevComment => ({
            ...prevComment,
            author: user as IUser ,
            [field]: value
        }));
    };

    const handleMedia = (media: IMediaHandled) => {
        const images = media.images || [];

        // Almacena temporalmente las imágenes en el estado 'newComment'
        setNewComment({
            ...newComment,
            medias: [...(newComment.medias || []), ...images],
        });
    };

    const handleSave = () => {
        const commentWithAuthor = { ...newComment, author: user as IUser };

        if (commentWithAuthor._id) {
            const updatedComments = comments.map(comment =>
                comment._id === commentWithAuthor._id ? { ...comment, ...commentWithAuthor } : comment
            );
            setComments(updatedComments);
            onUpdateComments(commentWithAuthor);
        } else {
            const newComments = [...comments, commentWithAuthor];
            setComments(newComments);
            onUpdateComments(commentWithAuthor);
        }

        setNewComment(emptyComment);
    };

    const startEditing = (comment: IComment) => {
        setNewComment(comment);
    };

    const cancelEditing = () => {
        setNewComment(emptyComment);
    };

    const handleDelete = (comment: IComment) => {
        const filteredComments = comments.filter((c) => c._id !== comment._id);
        setComments(filteredComments);
        onDeleteComments(comment);
    };


    const renderFormContent = () => (
        <>
            <Textarea
                value={newComment.text}
                onChange={(e) => handleInputChange('text', e.target.value)}
                label="Comentario"
            />
            <MediaHandler onChange={handleMedia} handle={{images: true}}
                          medias={newComment?.medias ? newComment.medias : undefined}/>
            <Button onClick={handleSave} color={newComment._id ? "blue" : "green"}>
                {newComment._id ? "Guardar Cambios" : "Agregar Comentario"}
            </Button>
            {newComment._id && <Button onClick={cancelEditing} color="red">Cancelar</Button>}

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
                                <Button variant="text" className="p-2" color="blue"
                                        onClick={() => startEditing(comment)}>
                                    <PencilIcon className="w-5 h-5"/>
                                </Button>
                                <Button variant="text" className="p-2" color="red"
                                        onClick={() => handleDelete(comment)}>
                                    <TrashIcon className="w-5 h-5"/>
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    );

    const dialogHandler = () => {
        dialog?.handler && dialog.handler();
        setNewComment(emptyComment);
    };

    return dialog ? (
        <Dialog open={dialog.open} handler={dialogHandler} dismiss={{enabled: false}}>
            <DialogHeader>Comentario</DialogHeader>
            <DialogBody className="h-[70vh] overflow-y-auto space-y-4">
                {renderFormContent()}
            </DialogBody>
            <DialogFooter className='space-x-4'>
                <Button variant="text" onClick={dialogHandler} color={"red"}>
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
                <Button onClick={dialogHandler} className="bg-gray-500 text-white p-2 rounded-md">
                    Cancel
                </Button>
            </div>
        </div>
    );
};
