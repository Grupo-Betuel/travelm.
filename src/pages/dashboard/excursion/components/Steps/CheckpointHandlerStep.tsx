import React from 'react';
import { Button, Card, CardBody, Textarea } from "@material-tailwind/react";
import { ICheckpoint } from "@/models/checkpointModel";
import { IExcursion } from "@/models/excursionModel";
import { ILocation } from "@/models/ordersModels";
import MapPicker from "@/components/MapPicker";

interface CheckpointFormProps {
    checkpoint: ICheckpoint | null; // null when adding new
    onSave: (checkpoint: ICheckpoint) => void;
    onCancel: () => void;
    excursionData: IExcursion;
    updateExcursion: (data: Partial<IExcursion>) => IExcursion;
}

export const CheckpointHandlerStep: React.FC<CheckpointFormProps> = ({ excursionData, updateExcursion, checkpoint, onSave, onCancel }) => {
    console.log('excursionData', excursionData);
    const handleLocationChange = (location: ILocation) => {
        const updatedCheckpoint: ICheckpoint = {
            ...checkpoint,
            location: {
                latitude: location.latitude,
                longitude: location.longitude,
                address: location.address,
                description: location.description || checkpoint?.location.description || '',  // Ensure description is a string
            },
            description: checkpoint?.description || '',
            buses: checkpoint?.buses || [],
        };

        const updatedCheckpoints = excursionData.checkpoints.map(cp =>
            cp._id === checkpoint?._id ? updatedCheckpoint : cp
        );
        updateExcursion({
            checkpoints: updatedCheckpoints,
        });
    };

    const buses = excursionData.transport?.transportResources.map(resource => resource.bus) || [];

    console.log(buses);

    return (
        <Card>
            <CardBody className='space-y-4'>
                <MapPicker
                    initialLocation={{
                        latitude: checkpoint?.location.latitude || 18.485424,
                        longitude: checkpoint?.location.longitude || -70.00008070000001,
                    }}
                    onLocationSelect={handleLocationChange}
                />
                <Textarea
                    label="Description"
                    value={checkpoint?.description || ''}
                    onChange={e => handleLocationChange({
                        ...checkpoint?.location,
                        latitude: checkpoint?.location.latitude ?? 0,  // Default to 0 if undefined
                        longitude: checkpoint?.location.longitude ?? 0,  // Default to 0 if undefined
                        description: e.target.value
                    })}
                />
                <div className="flex justify-end space-x-4">
                    <Button color="blue" onClick={() => onSave(checkpoint!)}>Save</Button>
                    <Button color="red" onClick={onCancel}>Cancel</Button>
                </div>
            </CardBody>
        </Card>
    );
};
