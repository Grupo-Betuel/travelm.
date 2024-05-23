import React, { useState } from 'react';
import { Button, Card, CardBody, Input, Textarea } from "@material-tailwind/react";
import {ICheckpoint} from "../../../../../models/checkpointModel";
import {IExcursion} from "../../../../../models/excursionModel";

interface CheckpointFormProps {
    checkpoint: ICheckpoint | null; // null when adding new
    onSave: (checkpoint: ICheckpoint) => void;
    onCancel: () => void;
    excursionData: IExcursion;
    updateExcursion: (data: Partial<IExcursion>) => IExcursion;
}

const CheckpointFormStep: React.FC<CheckpointFormProps> = ({ excursionData, updateExcursion, checkpoint, onSave, onCancel }) => {
    const [location, setLocation] = useState(checkpoint?.location.address || '');
    const [latitude, setLatitude] = useState(checkpoint?.location.latitude.toString() || '');
    const [longitude, setLongitude] = useState(checkpoint?.location.longitude.toString() || '');
    const [description, setDescription] = useState(checkpoint?.description || '');

    const handleSubmit = () => {
        const newCheckpoint: ICheckpoint = {
            _id: checkpoint?._id || Date.now().toString(), // Simplified unique ID generation
            location: {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                address: location,
            },
            description,
        };
        onSave(newCheckpoint);
        onCancel(); // Clear form/close modal
    };

    return (
        <Card>
            <CardBody>
                <Input label="Location Address" value={location} onChange={e => setLocation(e.target.value)} />
                <Input label="Latitude" type="number" value={latitude} onChange={e => setLatitude(e.target.value)} />
                <Input label="Longitude" type="number" value={longitude} onChange={e => setLongitude(e.target.value)} />
                <Textarea label="Description" value={description} onChange={e => setDescription(e.target.value)} />
                <div className="flex justify-end space-x-4">
                    <Button color="blue" onClick={handleSubmit}>Save</Button>
                    <Button color="red" onClick={onCancel}>Cancel</Button>
                </div>
            </CardBody>
        </Card>
    );
};
