import React, {MouseEvent, useState} from 'react';
import {Button, Input, Typography} from '@material-tailwind/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import MediaHandler, {IActivityHandled} from "./MediaHandler";
import DatePicker from "@/components/DatePicker";
import {IActivity} from "@/models/activitiesModel";
import {getCrudService} from "@/api/services/CRUD.service";
import {CommonConfirmActions, CommonConfirmActionsDataTypes} from "@/models/common";
import {useConfirmAction} from "@/hooks/useConfirmActionHook"; // Include the Quill stylesheet


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
        setActivityForm(emptyActivity);
        setEditActivityIndex(undefined);
    }

    const editActivityMode = (index: number) => () => {
        setActivityForm(activities[index]);
        setEditActivityIndex(index);
    }

    // (date: Date) => setActivityForm({ ...activityForm, date })

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
                <MediaHandler handle={{
                    images: true,
                }} onChange={onMediaSubmit} medias={activityForm.images}/>
                <Button color="blue" onClick={() => handleAddOrUpdateActivity()}>
                    {editActivityIndex !== undefined ? 'Actualizar' : 'Crear'} Actividad
                </Button>
            </div>
            <div className="flex gap-4 items-center">
                {activities.map((activity, index) => (
                    <div key={index} className="mt-2">
                        <Typography variant="h6">{activity.title}</Typography>
                        <Button color="red"
                                onClick={
                                    () => handleSetActionToConfirm('delete', 'Eliminar Actividad')(activity)
                                }>
                            Delete
                        </Button>
                        <Button onClick={editActivityMode(index)}>Editar</Button>
                    </div>
                ))}
            </div>
            <ConfirmDialog/>
        </div>
    );
};

export default ActivitiesHandler;
