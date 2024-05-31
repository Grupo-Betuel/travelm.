// BusHandler.tsx
import React, {useState} from 'react';
import {Button, Input, Card, CardBody} from '@material-tailwind/react';
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
    const [updateBus, {isLoading: isUpdating}] = busesService.useUpdateBuses();
    const [deleteBusById, {isLoading: isDeleting}] = busesService.useDeleteBuses();
    const onConfirmAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IBus>) => {
        switch (type) {
            case 'delete':
                handleDeleteBus(data as IBus);
                break;
        }
    }

    const onDeniedAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IBus>) => {

    }

    const {
        handleSetActionToConfirm,
        resetActionToConfirm,
        ConfirmDialog
    } = useConfirmAction<CommonConfirmActions, CommonConfirmActionsDataTypes<IBus>>(onConfirmAction, onDeniedAction);

    const handleInputChange = ({target: {value, name, type}}: any) => {
        if (type === 'tel') {
            value = value.replace(/[^0-9]/g, '');
            if (value == '1') return;
        }

        if (type === 'number') value = parseInt(value);

        const newInfo = _.set(structuredClone(newBus), name, value);
        setNewBus(newInfo);
    };

    const handleFinanceChange = (finance: IFinance) => {
        setNewBus({
            ...newBus,
            finance
        });
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

    return (
        <div className="flex flex-col gap-3">
            <h2>{editingIndex !== null ? 'Edit Bus' : 'Add New Bus'}</h2>
            <div className="flex flex-wrap gap-4">
                <Input type="text"
                       label="Model"
                       value={newBus.model}
                       name="model"
                       onChange={handleInputChange}/>
                <Input type="number" label="Capacity" value={newBus.capacity.toString()}
                       name="capacity"
                       onChange={handleInputChange}/>
                <Input type="text" label="Color" value={newBus.color}
                       name="color"
                       onChange={handleInputChange}/>
                <Input type="text" label="Description" value={newBus.description}
                       name={"description"}
                       onChange={handleInputChange}/>

                <Button color="blue" onClick={addBus}>{editingIndex !== null ? 'Save Changes' : 'Add Bus'}</Button>
            </div>
            {/*<FinanceHandler finance={newBus.finance} type="transport" updateFinance={handleFinanceChange}/>*/}
            {/*<Button color="blue" onClick={addOrEditBus}>{editingIndex !== null ? 'Save Changes' : 'Add Bus'}</Button>*/}
            <div className="grid grid-cols-3 gap-4">
                {buses.map((bus, index) => (
                    <Card key={index} className="p-4 my-2 flex">
                        <p>Model: {bus.model}</p>
                        <p>Capacity: {bus.capacity}</p>
                        <p>Color: {bus.color}</p>
                        <p>Description: {bus.description}</p>
                        {/*{bus.finance?.cost ? <p>Cost: {bus.finance.cost}</p> : null}*/}
                        {/*<p>Price: RD${bus.finance?.price?.toLocaleString()}</p>*/}
                        <Button variant="text" color="green" onClick={() => startEditing(index)}>Edit</Button>
                        <Button variant="text" color="red"
                                onClick={() => handleSetActionToConfirm('delete', 'Eliminar Bus')(bus)}>Delete</Button>
                    </Card>
                ))}
            </div>

            <ConfirmDialog/>

        </div>
    );
};

export default BusHandler;
