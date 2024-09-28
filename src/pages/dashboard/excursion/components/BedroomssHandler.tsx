import React, {useMemo, useState} from 'react';
import {Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Typography} from '@material-tailwind/react';
import {IBedroom} from "@/models/bedroomModel";
import {getCrudService} from "@/api/services/CRUD.service";
import {CommonConfirmActions, CommonConfirmActionsDataTypes, ICustomComponentDialog} from "@/models/common";
import {useConfirmAction} from "@/hooks/useConfirmActionHook";
import {DataTable} from "@/components/DataTable";
import {generateFilterOptions, bedroomColumns} from "@/constants/bedroom.constant";


interface BedroomsHandlerProps {
    bedrooms: IBedroom[];
    updateBedrooms: (bedrooms: IBedroom[]) => void;
    dialog?: ICustomComponentDialog;
}

const emptyBedroom: IBedroom = {
    capacity: 0,
    level: 0,
    name: '',
    zone: '',
}

export const bedroomService = getCrudService('bedrooms');

const BedroomsHandler: React.FC<BedroomsHandlerProps> = ({
                                                             bedrooms,
                                                             updateBedrooms,
                                                             dialog
                                                         }) => {
    const [bedroomForm, setBedroomForm] = useState<IBedroom>(emptyBedroom);
    const [editBedroomIndex, setEditBedroomIndex] = useState<number>();
    const [deleteBedroom] = bedroomService.useDeleteBedrooms();
    const filterOptions = useMemo(() => generateFilterOptions(bedrooms), [bedrooms]);
    const columns = bedroomColumns;

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
        dialog?.handler && dialog.handler();
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
        dialog?.handler && dialog.handler();
    }


    const renderRow = (bedroom: IBedroom, key: number) => {
        const {name, capacity, level, zone} = bedroom;
        return (
            <tr key={`${name}-${key}`}>
                <td className="py-3 px-5">
                    <Typography className="text-xs font-semibold">{name}</Typography>
                </td>
                <td className="py-3 px-5">
                    <Typography className="text-xs font-semibold">{capacity}</Typography>
                </td>
                <td className="py-3 px-5">
                    <Typography className="text-xs font-semibold">{level}</Typography>
                </td>
                <td className="py-3 px-5">
                    <Typography className="text-xs font-semibold">{zone}</Typography>
                </td>
                <td className="py-3 px-5">
                    <div className="flex items-center gap-2">
                        <Button color="blue" size="sm" onClick={editBedroomMode(key)}>
                            Editar
                        </Button>
                        <Button color="red" size="sm" onClick={() => handleSetActionToConfirm('delete')(bedroom)}>
                            Eliminar
                        </Button>
                    </div>
                </td>
            </tr>
        );
    };

    const form = (
        <div className="p-4 flex flex-col gap-5">
            <Input
                crossOrigin={false}
                type="number"
                label="Capacidad"
                name="capacity"
                value={bedroomForm?.capacity}
                onChange={handleOnChangeBedroom}
            />
            <Input
                crossOrigin={false}
                label="Nombre"
                name="name"
                value={bedroomForm?.name}
                onChange={handleOnChangeBedroom}
            />
            <Input
                crossOrigin={false}
                type="number"
                label="Planta"
                name="level"
                value={bedroomForm?.level}
                onChange={handleOnChangeBedroom}
            />
            <Input
                crossOrigin={false}
                label="Zona"
                name="zone"
                value={bedroomForm?.zone}
                onChange={handleOnChangeBedroom}
            />
        </div>
    );

    const dialogHandler = () => {
        dialog?.handler && dialog.handler();
        cleanBedroomHandler();
    };


    return (
        <div>
            {dialog ? (
                <Dialog open={dialog.open} handler={dialogHandler}>
                    <DialogHeader>Manage Bedrooms</DialogHeader>
                    <DialogBody>{form}</DialogBody>
                    <DialogFooter>
                        <Button color="red" variant="text" onClick={dialogHandler}>
                            Cancelar
                        </Button>
                        <Button color="blue" onClick={handleAddOrUpdateBedroom}>
                            {editBedroomIndex !== undefined ? 'Actualizar' : 'Crear'} Habitacion
                        </Button>
                    </DialogFooter>
                </Dialog>
            ) : (
                <div className="p-4">
                    <Typography variant="h5" className="mb-4">Manage Bedrooms</Typography>
                    {form}
                    <div className="flex justify-between">
                        <Button color="blue" onClick={handleAddOrUpdateBedroom}>
                            {editBedroomIndex !== undefined ? 'Actualizar' : 'Crear'} Habitacion
                        </Button>
                    </div>
                </div>
            )}
            <div className="pt-7">
                <DataTable
                    data={bedrooms}
                    columns={columns}
                    filterOptions={filterOptions}
                    renderRow={renderRow}
                />
            </div>

            <ConfirmDialog/>
        </div>
    );
};

export default BedroomsHandler;
