import React, { useState, useEffect } from 'react';
import {
    Button,
    Input,
    Card,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    Typography,
    CardFooter,
    CardBody,
    Select,
    Option,
} from '@material-tailwind/react';
import { getCrudService } from "@/api/services/CRUD.service";
import { useConfirmAction } from "@/hooks/useConfirmActionHook";
import { ICheckpoint } from "@/models/checkpointModel";
import { ILocation } from "@/models/ordersModels";
import { IBus } from "@/models/busesModel";
import BusHandler from "./BusesHandler";
import MapPicker from "@/components/MapPicker";
import SearchableSelect, { IOption } from "@/components/SearchableSelect";
import { AlertWithContent } from "@/components/AlertWithContent";
import {ITransportResource} from "@/models/transportResourcesModel";

interface CheckpointHandlerProps {
    checkpoints: ICheckpoint[];
    updateCheckpoints: (checkpoints: ICheckpoint[]) => void;
    excursionBuses: ITransportResource[]; // Added prop for excursion-specific buses
}

export const emptyCheckpoint: ICheckpoint = {
    location: {} as ILocation,
    buses: [] as IBus[],
    time: new Date(),
    description: ''
};

const busesService = getCrudService('buses');
const CheckpointHandler: React.FC<CheckpointHandlerProps> = ({
                                                                 checkpoints,
                                                                 updateCheckpoints,
                                                                 excursionBuses // Receive excursion buses
                                                             }) => {
    const [newCheckpoint, setNewCheckpoint] = useState<ICheckpoint>(emptyCheckpoint);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isBusDialogOpen, setIsBusDialogOpen] = useState(false);
    const [buses, setBuses] = useState<IBus[]>([]); // All available buses
    const [selectedBuses, setSelectedBuses] = useState<IOption[]>([]);
    const [inValid, setInValid] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<ILocation | null>(null);

    const { data: busesData } = busesService.useFetchAllBuses();

    useEffect(() => {
        if (busesData) {
            setBuses(busesData);
        }
    }, [busesData]);

    const handleDescriptionChange = ({ target: { value } }: any) => {
        setNewCheckpoint({
            ...newCheckpoint,
            description: value
        });
    };


    const handleLocationChange = (location: ILocation) => {
        setCurrentLocation(location);
        setNewCheckpoint({
            ...newCheckpoint,
            location: location
        });
    };

    const handleBusSelect = (busId: string | undefined) => {
        if (!busId) return;

        const selectedBus = buses.find(bus => bus._id === busId);

        if (selectedBus) {
            const alreadySelected = newCheckpoint.buses.some(bus => bus._id === busId);

            const updatedBuses = alreadySelected
                ? newCheckpoint.buses.filter(bus => bus._id !== busId)
                : [...newCheckpoint.buses, selectedBus];

            setNewCheckpoint({
                ...newCheckpoint,
                buses: updatedBuses
            });

            const updatedSelectedBuses = alreadySelected
                ? selectedBuses.filter(bus => bus.value !== busId)
                : [...selectedBuses, { value: selectedBus._id, label: `${selectedBus.model} - ${selectedBus.capacity} pasajeros` }];

            setSelectedBuses(updatedSelectedBuses);
        }
    };

    const availableBuses = excursionBuses.map(resource => ({
        value: resource.bus._id,
        label: `${resource.bus.model} (Capacidad: ${resource.bus.capacity}) - Conductor: ${resource.driver.firstName}`
    })) || [];


    const addOrEditCheckpoint = () => {
        if (!newCheckpoint.location || newCheckpoint.buses.length === 0) {
            setInValid(true);
            return;
        }

        const updatedCheckpoints = [...checkpoints];
        if (editingIndex !== null) {
            updatedCheckpoints[editingIndex] = newCheckpoint;
        } else {
            updatedCheckpoints.push(newCheckpoint);
        }

        updateCheckpoints(updatedCheckpoints);
        setNewCheckpoint(emptyCheckpoint);
        setSelectedBuses([]);
        setEditingIndex(null);
    };

    const startEditing = (index: number) => {
        const checkpointToEdit = checkpoints[index];
        setNewCheckpoint(checkpointToEdit);
        setEditingIndex(index);
        setCurrentLocation(checkpointToEdit.location);

        // Populate selectedBuses with the buses of the checkpoint being edited
        const selectedBusesForEdit = checkpointToEdit.buses.map(bus => ({
            value: bus._id,
            label: `${bus.model} - ${bus.capacity} pasajeros`
        }));
        setSelectedBuses(selectedBusesForEdit);
    };

    const handleDeleteCheckpoint = (index: number) => {
        const updatedCheckpoints = checkpoints.filter((_, i) => i !== index);
        updateCheckpoints(updatedCheckpoints);
    };

    return (
        <div className="flex flex-col gap-4 px-4">
            <AlertWithContent open={inValid} setOpen={setInValid} content={"Debe seleccionar una ubicación y autobuses"} type="warning" />
            <div className="flex flex-col gap-4">
                <MapPicker
                    initialLocation={{
                        latitude: currentLocation?.latitude || 18.485424,
                        longitude: currentLocation?.longitude || -70.00008070000001,
                    }}
                    onLocationSelect={handleLocationChange}
                />

                <Input
                    crossOrigin={false}
                    type="text"
                    label="Descripción"
                    value={newCheckpoint.description}
                    onChange={handleDescriptionChange}
                />

                <Typography variant="h6">Ubicación:</Typography>
                {newCheckpoint.location && newCheckpoint.location.latitude !== undefined && newCheckpoint.location.longitude !== undefined ? (
                    <Typography>
                        {newCheckpoint.location.address || `Lat: ${newCheckpoint.location.latitude}, Lng: ${newCheckpoint.location.longitude}`}
                    </Typography>
                ) : (
                    <Typography>No se ha seleccionado ubicación aún</Typography>
                )}

                <Select
                    label="Select Bus"
                    onChange={e => handleBusSelect(e as string | undefined)}
                    value={selectedBuses.map(bus => bus.value).join(', ')}
                >
                    {availableBuses.map(bus => (
                        <Option key={bus.value} value={bus.value}>
                            {bus.label}
                        </Option>
                    ))}
                </Select>

                <Button color="blue" onClick={addOrEditCheckpoint}>
                    {editingIndex !== null ? 'Guardar Cambios' : 'Agregar Punto de Control'}
                </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
                {checkpoints.map((checkpoint, index) => (
                    <Card key={index} className="p-4">
                        <Typography variant="h6">Descripción: {checkpoint.description}</Typography>
                        <Typography variant="h6">Ubicación: {checkpoint.location?.address || `Lat: ${checkpoint.location?.latitude}, Lng: ${checkpoint.location?.longitude}`}</Typography>
                        <Typography variant="h6">Autobuses:</Typography>
                        {checkpoint.buses.map(bus => (
                            <Typography key={bus._id} variant="paragraph">{bus.model} - {bus.capacity} pasajeros</Typography>
                        ))}

                        <CardFooter className="flex gap-2">
                            <Button variant="outlined" onClick={() => startEditing(index)}>Editar</Button>
                            <Button variant="outlined" color="red" onClick={() => handleDeleteCheckpoint(index)}>Eliminar</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Dialog size="md" open={isBusDialogOpen} handler={setIsBusDialogOpen}>
                <DialogHeader>Gestionar Autobuses</DialogHeader>
                <DialogBody>
                    <BusHandler buses={buses} updateBuses={setBuses} />
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={() => setIsBusDialogOpen(false)}>Cancelar</Button>
                    <Button variant="text" color="green" onClick={() => setIsBusDialogOpen(false)}>Guardar</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default CheckpointHandler;
