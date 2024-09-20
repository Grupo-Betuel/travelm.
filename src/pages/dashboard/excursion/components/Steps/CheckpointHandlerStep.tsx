import React, { useState, useEffect } from 'react';
import { Card, CardBody, Select, Option, Textarea, Button } from "@material-tailwind/react";
import { ICheckpoint } from "@/models/checkpointModel";
import { IExcursion } from "@/models/excursionModel";
import { ILocation } from "@/models/ordersModels";
import { IBus } from "@/models/busesModel";
import MapPicker from "@/components/MapPicker";

interface CheckpointFormProps {
    excursionData: IExcursion;
    updateExcursion: (data: Partial<IExcursion>) => void;
}

export const CheckpointHandlerStep: React.FC<CheckpointFormProps> = ({ excursionData, updateExcursion }) => {
    const [localCheckpoints, setLocalCheckpoints] = useState<ICheckpoint[]>(excursionData.checkpoints || []);
    const [selectedBuses, setSelectedBuses] = useState<IBus[]>([]);
    const [description, setDescription] = useState<string>('');
    const [currentLocation, setCurrentLocation] = useState<ILocation | null>(null);
    useEffect(() => {
    const checkpoins = excursionData.checkpoints;
        setLocalCheckpoints(checkpoins || []);
    }, [excursionData]);

    // Handle location change
    const handleLocationChange = (location: ILocation) => {
        setCurrentLocation(location);
    };

    // Handle bus selection
    const handleBusSelect = (busId: string | undefined) => {
        if (!busId) return;

        const bus = excursionData.transport?.transportResources.find(resource => resource.bus._id === busId)?.bus;
        if (bus) {
            const updatedBuses = selectedBuses.includes(bus)
                ? selectedBuses.filter(b => b._id !== busId)
                : [...selectedBuses, bus];

            setSelectedBuses(updatedBuses);
        }
    };

    // Handle description change
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    // Add checkpoint to the list
    const handleAddCheckpoint = () => {
        if (!currentLocation) return;

        const newCheckpoint: ICheckpoint = {
            location: currentLocation,
            description,
            time: new Date(),
            buses: selectedBuses,
        };

        setLocalCheckpoints([...localCheckpoints, newCheckpoint]);
        setDescription('');
        setSelectedBuses([]);
        setCurrentLocation(null);
    };

    // Save checkpoints to excursion
    const handleSaveCheckpoints = () => {
        updateExcursion({ checkpoints: localCheckpoints });
    };

    const availableBuses = excursionData.transport?.transportResources.map(resource => resource.bus) || [];

    return (
        <Card>
            <CardBody className="space-y-4">
                <MapPicker
                    initialLocation={{
                        latitude: currentLocation?.latitude || 18.485424,
                        longitude: currentLocation?.longitude || -70.00008070000001,
                    }}
                    onLocationSelect={handleLocationChange}
                />

                {/* Description Textarea */}
                <Textarea
                    label="Description"
                    value={description}
                    onChange={handleDescriptionChange}
                />

                {/* Bus Selection */}
                <Select
                    label="Select Bus"
                    onChange={e => handleBusSelect(e as string | undefined)}
                    value={selectedBuses.map(bus => bus._id).join(', ')}
                >
                    {availableBuses.map(bus => (
                        <Option key={bus._id} value={bus._id}>
                            {bus.model} - Capacity: {bus.capacity}
                        </Option>
                    ))}
                </Select>

                {/* Add Checkpoint Button */}
                <Button onClick={handleAddCheckpoint} color="blue">
                    Add Checkpoint
                </Button>

                {/* List of Checkpoints */}
                <ul>
                    {localCheckpoints.map((checkpoint, index) => (
                        <li key={index}>
                            <strong>Location:</strong> {checkpoint.location.address},
                            <strong>Description:</strong> {checkpoint.description},
                            <strong>Buses:</strong> {checkpoint.buses.map(bus => bus.model).join(', ')}
                        </li>
                    ))}
                </ul>

                {/* Save Checkpoints Button */}
                <Button onClick={handleSaveCheckpoints} color="green">
                    Save Checkpoints
                </Button>
            </CardBody>
        </Card>
    );
};
