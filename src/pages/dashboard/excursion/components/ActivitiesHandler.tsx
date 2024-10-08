import React, {MouseEvent, useEffect, useState} from 'react';
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
import MediaHandler, {IMediaHandled} from "./MediaHandler";
import DatePicker from "@/components/DatePicker";
import {IActivity} from "@/models/activitiesModel";
import {getCrudService} from "@/api/services/CRUD.service";
import {CommonConfirmActions, CommonConfirmActionsDataTypes} from "@/models/common";
import {useConfirmAction} from "@/hooks/useConfirmActionHook";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import {AppImage} from "@/components/AppImage";
import {SubmitHandler, useForm, useWatch} from "react-hook-form";
import {IPayment} from "@/models/PaymentModel";
import {emptyPayment} from "@/pages/dashboard/excursion/components/PaymentsHandler";
import {IExpense} from "@/models/ExpensesModel";
import FormControl from "@/components/FormControl"; // Include the Quill stylesheet


interface ActivitiesHandlerProps {
    activities: IActivity[];
    updateActivities: (activities: IActivity[]) => void;
}

const emptyActivity: IActivity = {
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

    const handleViewDescription = (description: string) => {
        setSelectedDescription(description);
        setIsDialogOpen(true);
    }

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

    const {
        control,
        handleSubmit,
        formState: {errors, isValid},
        setValue,
        getValues,
        reset,
    } = useForm<IActivity>({mode: 'all', values: emptyActivity});

    // const newActivity: IActivity = useWatch({control})

    const handleSave: SubmitHandler<IActivity> = (formData) => {
        if (formData._id || editActivityIndex !== undefined) {
            // Actualizar actividad existente
            const updatedActivities = activities.map((act, idx) => {
                if (formData._id && act._id === formData._id) {
                    return formData;
                } else if (idx === editActivityIndex) {
                    return formData;
                }
                return act;
            });

            updateActivities(updatedActivities);
        } else {
            updateActivities([...activities, formData]);
        }

        reset(emptyActivity);
        setEditActivityIndex(undefined);
    };


    // const handleAddOrUpdateActivity = (index?: number) => {
    //     if (!!activityForm._id || editActivityIndex !== undefined) {
    //         const updatedActivities = activities.map((act, idx) => {
    //             if (activityForm._id && act._id === activityForm._id) {
    //                 return activityForm;
    //
    //             } else if (idx === editActivityIndex) {
    //                 return activityForm;
    //             }
    //
    //             return act
    //         });
    //
    //         updateActivities(updatedActivities);
    //     } else {
    //         updateActivities([...activities, activityForm]);
    //     }
    //
    //     cleanActivityHandler()
    // };

    const onMediaSubmit = (data: IMediaHandled) => {
        const updatedMedia = {
            ...activityForm,
            ...data
        };

        setValue('images', updatedMedia.images)
    }

    const cleanActivityHandler = () => {
        // setActivityForm(emptyActivity);
        // setActivityForm({...emptyActivity, images: []});
        reset(emptyActivity)
        setEditActivityIndex(undefined);
    }

    const editActivityMode = (index: number) => () => {
        reset(activities[index])
        // setActivityForm(activities[index]);
        setEditActivityIndex(index);
    }

    console.log("actividades",activities)

    return (
        <div className="flex flex-col gap-5 pb-10">
            <div className="border-2 rounded-lg p-4">
                <div className="mb-4">
                    <Typography
                        variant="h5">{editActivityIndex !== undefined ? 'Editar' : 'Agregar Nueva'} Actividad</Typography>
                </div>
                <form onSubmit={handleSubmit(handleSave)}>
                    <div className="flex flex-col gap-5">
                        <FormControl
                            name="title"
                            control={control}
                            label="Nombre de la Actividad"
                            rules={{required: 'El título de la Actividad es requerido'}}
                            className="w-full"
                        />
                        <ReactQuill
                            theme="snow"
                            value={getValues("description")} // Obtener valor del formulario
                            onChange={(content) => setValue("description", content)} // Actualizar el valor en react-hook-form
                        />
                    </div>
                    <MediaHandler key={editActivityIndex !== undefined ? `edit-${editActivityIndex}` : undefined}
                                  handle={{images: true}} onChange={onMediaSubmit} medias={activityForm.images}/>
                    <Button color="blue" type={"submit"}>
                        {editActivityIndex !== undefined ? 'Actualizar' : 'Crear'} Actividad
                    </Button>
                    {(editActivityIndex !== undefined) && (
                        <Button className='mx-2' color="gray" onClick={cleanActivityHandler}>Cancelar</Button>
                    )}
                </form>
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
                                            <AppImage src={image.content} alt={image.title}
                                                      className="w-full h-full m-0 object-contain rounded-md"/>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </CardHeader>
                        )}

                        <CardBody className="flex flex-col space-y-2">
                            <Typography variant="h6" className="font-bold line-clamp-2">
                                {activity.title}
                            </Typography>
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
                                    onClick={() => handleSetActionToConfirm('delete', 'Eliminar Actividad')(activity)}
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
            <Dialog open={isDialogOpen} handler={setIsDialogOpen} className=' '>
                <DialogHeader>Descripción Completa</DialogHeader>
                <DialogBody divider className='h-[70vh] overflow-y-auto'>
                    <div dangerouslySetInnerHTML={{__html: selectedDescription}}/>
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
