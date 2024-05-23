import React, {useState} from 'react';
import {Button, Checkbox, Input, Typography} from '@material-tailwind/react';
import DatePicker from "../../../../components/DatePicker";
import {IProjection} from "../../../../models/projectionModel";
import {CommonConfirmActions, CommonConfirmActionsDataTypes} from "../../../../models/common";
import {useConfirmAction} from "../../../../hooks/useConfirmActionHook";
import {getCrudService} from "../../../../api/services/CRUD.service";


interface ProjectionsHandlerProps {
    projections: IProjection[];
    updateProjections: (projections: IProjection[]) => void;
}

export const emptyProjection: IProjection = {clients: 0, date: new Date(), done: false}

const projectionService = getCrudService('projections');
const ProjectionsHandler: React.FC<ProjectionsHandlerProps> = ({projections, updateProjections}) => {
    const [projectionForm, setProjectionForm] = useState<IProjection>(emptyProjection);
    const [editProjectionIndex, setEditProjectionIndex] = useState<number>();

    const [deleteProjection] = projectionService.useDeleteProjections();

    const onConfirmAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IProjection>) => {
        switch (type) {
            case 'delete':
                handleDeleteProjection(data as IProjection);
                break;
        }
    }

    const onDeniedAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IProjection>) => {

    }

    const {
        handleSetActionToConfirm,
        resetActionToConfirm,
        ConfirmDialog
    } = useConfirmAction<CommonConfirmActions, CommonConfirmActionsDataTypes<IProjection>>(onConfirmAction, onDeniedAction);

    const handleAddOrUpdateProjection = () => {
        if (projectionForm._id || editProjectionIndex) {
            const updatedProjections = projections.map((proj, idx) => {
                if ((projectionForm._id && proj._id === projectionForm._id) || editProjectionIndex === idx) {
                    return projectionForm;
                }

                return proj;
            });

            updateProjections(updatedProjections);
        } else {
            updateProjections([...projections, projectionForm]);
        }

        cleanProjectionHandler()
    };

    const handleDeleteProjection = (projection: IProjection) => {
        const filteredProjections = projections.filter((p, idx) => {
            if (projection._id) {
                return p._id !== projection._id;
            }
            return JSON.stringify(p) !== JSON.stringify(projection);
        });

        updateProjections(filteredProjections);
        projection._id && deleteProjection(projection._id);
    };

    const cleanProjectionHandler = () => {
        setProjectionForm(emptyProjection);
        setEditProjectionIndex(undefined);
    }

    const editProjectionMode = (index: number) => () => {
        setProjectionForm(projections[index]);
        setEditProjectionIndex(index);
    }

    return (
        <div className="p-4">
            <Typography variant="h5" className="mb-4">Manage Projections</Typography>
            <Input
                type="number"
                label="Number of Clients"
                value={projectionForm.clients.toString()}
                onChange={(e) => setProjectionForm({...projectionForm, clients: Number(e.target.value)})}
                className="mb-4"
            />
            <Typography variant="h6" className="mb-2">Select Date:</Typography>
            <DatePicker
                date={projectionForm.date}
                onChange={(date?: Date) => setProjectionForm({...projectionForm, date})}
            />
            <Checkbox
                label="Done"
                checked={projectionForm.done}
                onChange={(e) => setProjectionForm({...projectionForm, done: e.target.checked})}
                color="blue"
                className="mb-4"
            />
            <div className="flex justify-between">
                <Button color="blue"
                        onClick={handleAddOrUpdateProjection}>{editProjectionIndex ? 'Actualizar' : 'Crear'} Proyeccion</Button>
            </div>
            {projections.map((projection, index) => (
                <div key={index} className="mt-2 bg-gray-100 p-2 rounded">
                    <Typography variant="h6">Clients: {projection.clients}</Typography>
                    <Typography variant="h6">Date: {new Date(projection.date || '')?.toDateString()}</Typography>
                    <Typography variant="h6">Done: {projection.done ? 'Yes' : 'No'}</Typography>
                    <div className="flex space-x-2 mt-2">
                        <Button color="red"
                                onClick={() => handleSetActionToConfirm('delete', 'Eliminar Proyeccion')(projection)}>Delete</Button>
                        <Button onClick={editProjectionMode(index)}>Editar</Button>
                    </div>
                </div>
            ))}
            <ConfirmDialog/>
        </div>
    );
};

export default ProjectionsHandler;
