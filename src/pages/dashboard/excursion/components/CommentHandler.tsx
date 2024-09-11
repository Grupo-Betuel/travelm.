import React, { useMemo, useState } from "react";
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
    IconButton,
} from "@material-tailwind/react";
import MediaHandler, { IMediaHandled } from "@/pages/dashboard/excursion/components/MediaHandler";
import { IMedia } from "@/models/mediaModel";
import { IComment } from "@/models/commentModel";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { AppImage } from "@/components/AppImage";
import DatePicker from "@/components/DatePicker";

interface CommentFormProps {
    isDialog?: boolean;
    open?: boolean;
    onClose: () => void;
    initialComments?: IComment[];
    updateComments: (comments: IComment[]) => void;
}

const DefaultComment: IComment = {
    text: "",
    medias: [],
    createDate: new Date(),
};

export const CommentForm: React.FC<CommentFormProps> = ({
                                                            isDialog = false,
                                                            open = false,
                                                            onClose,
                                                            initialComments = [],
                                                            updateComments,
                                                        }) => {
    const [comments, setComments] = useState<IComment[]>(initialComments);
    const [currentComment, setCurrentComment] = useState<IComment | null>(null);
    const [newCommentText, setNewCommentText] = useState<string>("");
    const [medias, setMedias] = useState<IMedia[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewCommentText(e.target.value);
    };

    const handleMediasChange = (data: IMediaHandled) => {
        setMedias(data.images);
    };

    const handleSave = () => {
        if (currentComment) {
            const updatedComments = comments.map((comment) =>
                comment.createDate === currentComment.createDate
                    ? { ...comment, text: newCommentText, medias }
                    : comment
            );
            setComments(updatedComments);
        } else {
            const newComment: IComment = {
                text: newCommentText,
                medias: medias,
                createDate: new Date(),
            };
            setComments([...comments, newComment]);
        }

        setCurrentComment(null);
        setNewCommentText("");
        setMedias([]);
    };

    const handleEdit = (comment: IComment) => {
        setCurrentComment(comment);
        setNewCommentText(comment.text);
        setMedias(comment.medias || []);
    };

    const handleDelete = (createDate: Date) => {
        const updatedComments = comments.filter(
            (comment) => comment.createDate !== createDate
        );
        setComments(updatedComments);
    };

    const handleSaveAndClose = () => {
        updateComments(comments);
        onClose?.();
    };

    const renderFormContent = () => (
        <>
            <Textarea
                value={newCommentText}
                onChange={handleInputChange}
                label="Comment"
            />
            <MediaHandler
                handle={{ images: true }}
                onChange={handleMediasChange}
                medias={medias}
                key={medias.length}
            />
            <div className="mt-4">
                <Button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded-md">
                    {currentComment ? "Update Comment" : "Add Comment"}
                </Button>
            </div>
            <div className="overflow-y-auto h-[33vh] py-4">
                <div className="grid gap-y-6 gap-x-6 md:grid-cols-2 xl:grid-cols-2 mt-4">
                    {(comments || []).map((comment, index) => (
                        <Card className="bg-gray-100 rounded-xl py-4 mx-0" key={index}>
                            {!!comment?.medias?.length && (
                                <CardHeader className="h-32 w-full mx-0">
                                    <Swiper
                                        modules={[Navigation, Pagination]}
                                        navigation
                                        pagination={{ clickable: true }}
                                        spaceBetween={5}
                                        slidesPerView={1}
                                        className="relative h-full rounded-md"
                                    >
                                        {comment.medias.map((image, index) => (
                                            <SwiperSlide key={index}>
                                                <AppImage
                                                    src={image.content}
                                                    alt={image.title}
                                                    className="w-full h-full m-0 object-contain rounded-md"
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </CardHeader>
                            )}

                            <CardBody className="flex flex-col space-y-2">
                                <Typography variant="h6" className="font-bold line-clamp-2">
                                    {comment.text}
                                </Typography>
                                <DatePicker
                                    label="Select Date"
                                    onChange={() => { }}
                                    date={comment.createDate}
                                    disabled={true}
                                />
                                {comment.author && (
                                    <Typography variant="h6" className="font-bold line-clamp-2">
                                        {comment.author.firstName} {comment.author.lastName}
                                    </Typography>
                                )}
                            </CardBody>

                            <CardFooter className="flex justify-between pt-2">
                                <div className="flex space-x-4">
                                    <Button
                                        variant="outlined"
                                        color="red"
                                        onClick={() => handleDelete(comment.createDate)}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="blue"
                                        onClick={() => handleEdit(comment)}
                                    >
                                        Editar
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );

    return isDialog ? (
        <Dialog open={open} handler={onClose}>
            <DialogHeader>Comentario</DialogHeader>
            <DialogBody className="h-[80vh] overflow-hidden">
                {renderFormContent()}
            </DialogBody>
            <DialogFooter className='space-x-4'>
                <Button onClick={onClose} className="bg-gray-500 text-white p-2 rounded-md">
                    Cancel
                </Button>
                <Button onClick={handleSaveAndClose} className="bg-blue-500 text-white p-2 rounded-md">
                    Save & Close
                </Button>
            </DialogFooter>
        </Dialog>
    ) : (
        <div className="form-container">
            {renderFormContent()}
            <div className="flex justify-end space-x-2">
                <Button onClick={onClose} className="bg-gray-500 text-white p-2 rounded-md">
                    Cancel
                </Button>
                <Button onClick={handleSaveAndClose} className="bg-blue-500 text-white p-2 rounded-md">
                    Save & Close
                </Button>
            </div>
        </div>
    );
};
