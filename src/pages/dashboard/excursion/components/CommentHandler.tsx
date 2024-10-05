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
import FormControl from "@/components/FormControl";
import {SubmitHandler, useForm, useWatch} from "react-hook-form";
import {InfoCardItem} from "@/components/InfoCardItem";
import {BiEdit, BiSave, BiTrash} from "react-icons/bi";
import {FaRegSave} from "react-icons/fa";


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
    const [selectedComment, setSelectedComment] = useState<IComment | null>(null);
    const {user} = useAuth();
    const {
        control,
        handleSubmit,
        formState: {errors, isValid},
        setValue,
        reset,
    } = useForm<IComment>({mode: 'all', defaultValues: emptyComment});

    const newComment: IComment = useWatch({control}) as IComment;

    useEffect(() => {
        if (initialComments && initialComments.length > 0) {
            setComments(initialComments);
        }
    }, [initialComments]);


    const handleMedia = (media: IMediaHandled) => {
        if (media.images && media.images.length > 0) {
            const images = media.images || [];
            setValue('medias', images);
        } else {
            setValue('medias', undefined);
        }
    };

    const handleSave: SubmitHandler<IComment> = (comment) => {
        const commentWithAuthor = {...comment, author: user as IUser};

        if (commentWithAuthor._id) {
            onUpdateComments(commentWithAuthor);
        } else {
            onUpdateComments(commentWithAuthor);
        }

        reset(emptyComment);
    };

    const startEditing = (comment: IComment) => {
        reset(comment);
    };

    const cancelEditing = () => {
        reset(emptyComment);
    };

    const handleDelete = (comment: IComment) => {
        onDeleteComments(comment);
    };


    const renderFormContent = () => (
        <>
            <form onSubmit={handleSubmit(handleSave)} className="flex flex-col">
                <FormControl
                    name="text"
                    control={control}
                    label="Comentario"
                    type="textarea"
                    className="w-full"
                    rules={{
                        required: 'La descripción es requerida',
                        minLength: {
                            value: 3,
                            message: 'La descripción debe tener al menos 3 caracteres',
                        },
                    }}
                />
                <MediaHandler onChange={handleMedia} handle={{images: true}}
                              medias={newComment?.medias ? newComment.medias : undefined}/>
                <div className="self-end flex gap-3">
                    {newComment._id && <Button
                        className="text-sm flex items-center gap-3"
                        variant="text"
                        onClick={cancelEditing} color="red">Cancelar</Button>}
                    <Button
                        className="text-sm flex items-center gap-3"
                        variant="text"
                        disabled={!isValid}
                        type={'submit'} color={newComment._id ? "blue" : "green"}>
                        <FaRegSave className="text-md" />
                        {newComment._id ? "Guardar Cambios" : "Agregar"}
                    </Button>
                </div>
            </form>
            <Typography variant="h4" className="">Comentarios</Typography>
            <div className="flex items-end gap-4 pt-10 pb-2 overflow-x-auto">
                {comments.map((comment, index) => (
                    <InfoCardItem
                        key={index}
                        title={`Author/a: ${comment.author?.firstName}`}
                        subtitle={`Author/a: ${comment.author?.firstName}`}
                        medias={comment.medias}
                        description={comment.text}
                        actions={[
                            {
                                icon: <BiEdit className="w-5 h-5"/>,
                                text: "Editar",
                                color: "blue",
                                onClick: () => startEditing(comment),
                            },
                            {
                                icon: <BiTrash className="w-5 h-5"/>,
                                text: "Eliminar",
                                color: "red",
                                onClick: () => handleDelete(comment),
                            },
                        ]}/>
                ))}
            </div>
        </>
    );

    const dialogHandler = () => {
        dialog?.handler && dialog.handler();
        reset(emptyComment);
    };

    return dialog ? (
        <Dialog open={dialog.open} handler={dialogHandler} dismiss={{enabled: false}}>
            <DialogHeader className="flex justify-center">Gestor de Comentarios</DialogHeader>
            <DialogBody className="max-h-[70vh] overflow-y-auto space-y-4">
                {renderFormContent()}
            </DialogBody>
            <DialogFooter className='space-x-4'>
                <Button variant="text" size="lg" onClick={dialogHandler} color={"red"}>
                    Cerrar
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
