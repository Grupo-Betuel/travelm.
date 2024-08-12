// BusHandler.tsx
import React, {useEffect, useState} from 'react';
import {Button, Input, Card, CardBody, CardFooter, Typography} from '@material-tailwind/react';
import {IBus} from "../../../../models/busesModel";
import IUser from "../../../../models/interfaces/userModel";
import {IFinance} from "../../../../models/financeModel";
import {FinanceHandler} from "./FinanceHandler";
import InputMask from "react-input-mask";
import _ from 'lodash';
import {getCrudService} from "../../../../api/services/CRUD.service";
import {CommonConfirmActions, CommonConfirmActionsDataTypes} from "../../../../models/common";
import {useConfirmAction} from "../../../../hooks/useConfirmActionHook";

interface BusHandlerProps {
    buses: IBus[];
    updateBuses: (buses: IBus[]) => void;
}

export const emptyBus: IBus = {
    model: '',
    capacity: 0,
    color: '',
    description: '',
};

const busesService = getCrudService('buses');
const BusHandler: React.FC<BusHandlerProps> = ({buses, updateBuses}) => {
    const [newBus, setNewBus] = useState<IBus>(emptyBus);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [hasContent, setHasContent] = useState(false);
    const [updateBus, {isLoading: isUpdating}] = busesService.useUpdateBuses();
    const [deleteBusById, {isLoading: isDeleting}] = busesService.useDeleteBuses();

    useEffect(() => {
        setHasContent(
            Object.values(newBus).some(value => value !== '' && value !== 0)
        );
    }, [newBus]);


    const onConfirmAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IBus>) => {
        switch (type) {
            case 'delete':
                handleDeleteBus(data as IBus);
                break;
        }
    }

    const onDeniedAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IBus>) => {

    }


    const handleInputChange = ({target: {value, name, type}}: any) => {
        if (type === 'tel') {
            value = value.replace(/[^0-9]/g, '');
            if (value == '1') return;
        }

        if (type === 'number') value = parseInt(value);

        const newInfo = _.set(structuredClone(newBus), name, value);
        setNewBus(newInfo);
    };

    const handleCancel = () => {
        setNewBus(emptyBus);
        setEditingIndex(null);
        setHasContent(false);
    };

    const addBus = () => {
        updateBuses([...buses, newBus]);
        setNewBus(emptyBus);
    };

    const startEditing = (index: number) => {
        setNewBus(buses[index]);
        setEditingIndex(index);
    };

    const handleDeleteBus = (bus: IBus) => {
        const updatedBuses = buses.filter(b => {
            if (bus._id) {
                return b._id !== bus._id
            }

            return JSON.stringify(b) !== JSON.stringify(bus);
        });

        updateBuses(updatedBuses);
        bus._id && deleteBusById(bus._id);
    };


    const addOrEditBus = () => {
        const updatedBuses = [...buses];
        if (editingIndex !== null) {
            updatedBuses[editingIndex] = newBus;
        } else {
            updatedBuses.push(newBus);
        }

        updateBuses(updatedBuses);
        setNewBus(emptyBus);
        setEditingIndex(null);
    };

    const {
        handleSetActionToConfirm,
        ConfirmDialog
    } = useConfirmAction<CommonConfirmActions, CommonConfirmActionsDataTypes<IBus>>(onConfirmAction, onDeniedAction);

    return (
        <div className="flex flex-col w-full gap-3 h-[70vh] overflow-y-auto overflow-x-hidden">
            <h2>{editingIndex !== null ? 'Edit Bus' : 'Add New Bus'}</h2>
            <div className="flex flex-wrap gap-4 w-full px-2">
                <Input crossOrigin={false} type="text"
                       label="Model"
                       value={newBus.model}
                       name="model"
                       onChange={handleInputChange}/>
                <Input crossOrigin={false} type="number" label="Capacity" value={newBus.capacity.toString()}
                       name="capacity"
                       onChange={handleInputChange}/>
                <Input crossOrigin={false} type="text" label="Color" value={newBus.color}
                       name="color"
                       onChange={handleInputChange}/>
                <Input crossOrigin={false} type="text" label="Description" value={newBus.description}
                       name={"description"}
                       onChange={handleInputChange}/>

                <Button color="blue" onClick={addBus}>{editingIndex !== null ? 'Save Changes' : 'Add Bus'}</Button>

                {hasContent && (
                    <Button color="red" onClick={handleCancel}>
                        Cancel
                    </Button>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4">
                {buses.map((bus, index) => (
                    <Card key={index} className="p-4 my-2 flex flex-col justify-between">
                        <div>
                            <Typography variant='h6'>Model: {bus.model}</Typography>
                            <p>Capacity: {bus.capacity}</p>
                            <p>Color: {bus.color}</p>
                            <p>Description: {bus.description}</p>
                        </div>
                        <CardFooter className="p-2">
                            <div className="flex mt-4 gap-2">
                                <Button variant='outlined' color="green"
                                        onClick={() => startEditing(index)}>Edit</Button>
                                <Button variant="outlined" color="red"
                                        onClick={() => handleSetActionToConfirm('delete', 'Eliminar Bus')(bus)}>Delete</Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <ConfirmDialog/>

        </div>
    );
};

export default BusHandler;
