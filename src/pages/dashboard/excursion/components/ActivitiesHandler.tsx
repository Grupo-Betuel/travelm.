import React, {MouseEvent, useState} from 'react';
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Dialog, DialogBody, DialogFooter,
    DialogHeader,
    Input,
    Typography
} from '@material-tailwind/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import MediaHandler, {IActivityHandled} from "./MediaHandler";
import DatePicker from "@/components/DatePicker";
import {IActivity} from "@/models/activitiesModel";
import {getCrudService} from "@/api/services/CRUD.service";
import {CommonConfirmActions, CommonConfirmActionsDataTypes} from "@/models/common";
import {useConfirmAction} from "@/hooks/useConfirmActionHook";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import {AppImage} from "@/components/AppImage"; // Include the Quill stylesheet


interface ActivitiesHandlerProps {
    activities: IActivity[];
    updateActivities: (activities: IActivity[]) => void;
}

export const emptyActivity: IActivity = {
    title: '',
    images: [],
    videos: [],
    date: new Date(),
    description: ''
}
export const activitiesService = getCrudService('activities');

const ActivitiesHandler: React.FC<ActivitiesHandlerProps> = ({activities, updateActivities}) => {
    const [activityForm, setActivityForm] = useState<IActivity>(emptyActivity);
    const [editActivityIndex, setEditActivityIndex] = useState<number>();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState<string>('');

    const [deleteActivity] = activitiesService.useDeleteActivities();

    const onConfirmAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IActivity>) => {
        switch (type) {
            case 'delete':
                handleDeleteActivity(data as IActivity);
                // setEditActivityIndex(undefined);
                // setActivityForm(emptyActivity);
                break;
        }
    }

    const onDeniedAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IActivity>) => {

    }

    const {
        handleSetActionToConfirm,
        resetActionToConfirm,
        ConfirmDialog
    } = useConfirmAction<CommonConfirmActions, CommonConfirmActionsDataTypes<IActivity>>(onConfirmAction, onDeniedAction);

    const handleAddOrUpdateActivity = (index?: number) => {
        if (!!activityForm._id || editActivityIndex !== undefined) {
            const updatedActivities = activities.map((act, idx) => {
                if (activityForm._id && act._id === activityForm._id) {
                    return activityForm;

                } else if (idx === editActivityIndex) {
                    return activityForm;
                }

                return act
            });

            updateActivities(updatedActivities);
        } else {
            updateActivities([...activities, activityForm]);
        }

        cleanActivityHandler()
    };

    const handleDeleteActivity = (activity: IActivity) => {
        const filteredActivities = activities.filter((a) => {
            if (a._id) {
                return a._id !== activity._id;
            }

            return JSON.stringify(a) !== JSON.stringify(activity);
        });

        updateActivities(filteredActivities)
        activity._id && deleteActivity(activity._id as string);
    };

    const onMediaSubmit = (data: IActivityHandled) => {
        const updatedMedia = {
            ...activityForm,
            ...data
        };

        setActivityForm(updatedMedia);
    }

    const onSelectDate = (
        date?: Date | undefined) => {
        setActivityForm({...activityForm, date});
    }

    const cleanActivityHandler = () => {
        // setActivityForm(emptyActivity);
        setActivityForm({...emptyActivity, images: []});
        setEditActivityIndex(undefined);
    }

    const editActivityMode = (index: number) => () => {
        setActivityForm(activities[index]);
        setEditActivityIndex(index);
    }

    const handleViewDescription = (description: string) => {
        setSelectedDescription(description);
        setIsDialogOpen(true);
    }

    // (date: Date) => setActivityForm({ ...activityForm, date })
    console.log('activities', activities.map ((a) => a.date));
    return (
        <div className="flex flex-col gap-5 pb-10">
            <div className="border-2 rounded-lg p-4">
                <div className="mb-4">
                    <Typography
                        variant="h5">{editActivityIndex !== undefined ? 'Editar' : 'Agregar Nueva'} Actividad</Typography>
                </div>
                <div className="flex flex-col gap-5">
                    <Input
                        type="text"
                        label="Title"
                        value={activityForm.title}
                        onChange={(e) => setActivityForm({...activityForm, title: e.target.value})}
                        className="mb-4"
                    />
                    <DatePicker
                        label="Select Date"
                        onChange={onSelectDate}
                        date={activityForm.date}
                    />
                    <ReactQuill
                        theme="snow"
                        value={activityForm.description}
                        onChange={(content) => setActivityForm({...activityForm, description: content})}
                    />
                </div>
                <MediaHandler key={editActivityIndex !== undefined ? `edit-${editActivityIndex}` : undefined}
                              handle={{images: true}} onChange={onMediaSubmit} medias={activityForm.images}/>
                <Button color="blue" onClick={() => handleAddOrUpdateActivity()}>
                    {editActivityIndex !== undefined ? 'Actualizar' : 'Crear'} Actividad
                </Button>
                {(editActivityIndex !== undefined ) && (
                <Button className='mx-2' color="gray" onClick={cleanActivityHandler}>Cancelar</Button>
                )}
            </div>
            <div className="grid gap-y-6 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
                {(activities || []).map((activity, index) => (
                    <Card className="bg-gray-100 rounded-xl py-4 mx-0" key={index}>
                        {!!activity?.images?.length && (
                            <CardHeader className="h-32 w-full mx-0">
                                <Swiper
                                    modules={[Navigation, Pagination]}
                                    navigation
                                    pagination={{clickable: true}}
                                    spaceBetween={5}
                                    slidesPerView={1}
                                    className="relative h-full rounded-md"
                                >
                                    {activity.images.map((image, index) => (
                                        <SwiperSlide key={index}>
                                            <AppImage src={image.content} alt={image.title} className="w-full h-full m-0 object-contain rounded-md"/>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </CardHeader>
                        )}

                        <CardBody className="flex flex-col space-y-2">
                            <Typography variant="h6" className="font-bold line-clamp-2">
                                {activity.title}
                            </Typography>
                            <DatePicker
                                label="Select Date"
                                onChange={onSelectDate}
                                date={activityForm.date}
                                disabled={true}
                            />
                            {activity.description &&
                            <Button color="blue" onClick={() => handleViewDescription(activity.description)}>
                                Ver Descripción Completa
                            </Button>
                            }
                        </CardBody>

                        <CardFooter className="flex justify-between pt-2">
                            <div className="flex space-x-4">
                                <Button
                                    variant="outlined"
                                    color="red"
                                    onClick={() => handleSetActionToConfirm('delete', 'Eliminar Habitacion')(activity)}
                                >
                                    Delete
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="blue"
                                    onClick={editActivityMode(index)}
                                >
                                    Editar
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <Dialog open={isDialogOpen} handler={setIsDialogOpen} className='h-[90vh] overflow-y-auto'>
                <DialogHeader>Descripción Completa</DialogHeader>
                <DialogBody divider>
                    <div dangerouslySetInnerHTML={{ __html: selectedDescription }} />
                </DialogBody>
                <DialogFooter>
                    <Button
                        color="blue"
                        onClick={() => setIsDialogOpen(false)}
                    >
                        Cerrar
                    </Button>
                </DialogFooter>
            </Dialog>
            <ConfirmDialog/>
        </div>
    );
};

export default ActivitiesHandler;
