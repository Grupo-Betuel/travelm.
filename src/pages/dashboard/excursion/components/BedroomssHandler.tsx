import React, {useState} from 'react';
import {Button, Input, Typography} from '@material-tailwind/react';
import {IBedroom} from "@/models/bedroomModel";
import {getCrudService} from "@/api/services/CRUD.service";
import {CommonConfirmActions, CommonConfirmActionsDataTypes} from "../../../../models/common";
import {useConfirmAction} from "../../../../hooks/useConfirmActionHook";

interface BedroomsHandlerProps {
    bedrooms: IBedroom[];
    updateBedrooms: (bedrooms: IBedroom[]) => void;
}

const emptyBedroom: IBedroom = {
    capacity: 0,
    level: 0,
    name: '',
    zone: '',
}

export const bedroomService = getCrudService('bedrooms');

const BedroomsHandler: React.FC<BedroomsHandlerProps> = ({bedrooms, updateBedrooms}) => {
    const [bedroomForm, setBedroomForm] = useState<IBedroom>(emptyBedroom);
    const [editBedroomIndex, setEditBedroomIndex] = useState<number>();
    const [deleteBedroom] = bedroomService.useDeleteBedrooms();

    const onConfirmAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IBedroom>) => {
        switch (type) {
            case 'delete':
                handleDeleteBedroom(data as IBedroom);
                break;
        }
    }

    const onDeniedAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IBedroom>) => {

    }

    const {
        handleSetActionToConfirm,
        resetActionToConfirm,
        ConfirmDialog
    } = useConfirmAction<CommonConfirmActions, CommonConfirmActionsDataTypes<IBedroom>>(onConfirmAction, onDeniedAction);

    const cleanBedroomHandler = () => {
        setBedroomForm(emptyBedroom);
        setEditBedroomIndex(undefined);
    }
    const handleAddOrUpdateBedroom = () => {
        if (bedroomForm._id || editBedroomIndex !== undefined) {
            const updatedBedrooms = bedrooms.map((fd, idx) => {
                if ((bedroomForm._id && bedroomForm._id === fd._id) || idx === editBedroomIndex) {
                    return bedroomForm
                }

                return fd
            });
            updateBedrooms(updatedBedrooms);
        } else {
            updateBedrooms([...bedrooms, bedroomForm]);
        }

        cleanBedroomHandler();
    };

    const handleDeleteBedroom = (bedroom: IBedroom) => {
        const filteredBedrooms = bedrooms.filter((b) => {
            if (bedroom._id) {
                return b._id !== bedroom._id;
            }
            return JSON.stringify(b) !== JSON.stringify(bedroom);
        });

        updateBedrooms(filteredBedrooms);
        bedroom._id && deleteBedroom(bedroom._id);
    };

    const handleOnChangeBedroom = ({target: {name, value, type}}: any) => {
        if (type === 'number') {
            value = Number(value);
        }
        setBedroomForm({...bedroomForm, [name]: value});
    }


    const editBedroomMode = (index: number) => () => {
        setBedroomForm(bedrooms[index]);
        setEditBedroomIndex(index);
    }


    return (
        <div className="p-4">
            <Typography variant="h5" className="mb-4">Manage Bedrooms</Typography>
            <div className="flex flex-col gap-5 pb-5">
                <Input
                    type="number"
                    label="Capacidad"
                    name="capacity"
                    value={bedroomForm?.capacity}
                    onChange={handleOnChangeBedroom}
                />
                <Input
                    label="Nombre"
                    name="name"
                    value={bedroomForm?.name}
                    onChange={handleOnChangeBedroom}
                />
                <Input
                    type="number"
                    label="Planta"
                    name="level"
                    value={bedroomForm?.level}
                    onChange={handleOnChangeBedroom}
                />
                <Input
                    label="Zona"
                    name="zone"
                    value={bedroomForm?.zone}
                    onChange={handleOnChangeBedroom}
                />
            </div>
            <div className="flex justify-between">
                <Button color="blue"
                        onClick={handleAddOrUpdateBedroom}>{editBedroomIndex !== undefined ? 'Actualizar' : 'Crear'} Habitacion</Button>
            </div>
            <div className="grid gap-y-6 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
                {(bedrooms || []).map((bedroom, index) => (
                    <div key={index} className="mt-2 bg-gray-100 rounded-xl p-4">
                        <Typography variant="h6">Nombre: {bedroom.name}</Typography>
                        <Typography variant="h6">Capacidad: {bedroom.capacity}</Typography>
                        <Typography variant="h6">Planta: {bedroom.level}</Typography>
                        <Typography variant="h6">Zona: {bedroom.zone}</Typography>
                        <div className="flex space-x-4 mt-2">
                            <Button color="red"
                                    onClick={() => handleSetActionToConfirm('delete', 'Eliminar Habitacion')(bedroom)}>Delete</Button>
                            <Button onClick={editBedroomMode(index)}>Edit</Button>
                        </div>
                    </div>
                ))}
            </div>
            <ConfirmDialog/>
        </div>
    );
};

export default BedroomsHandler;
