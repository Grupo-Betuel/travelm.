import React from 'react';
import { Button } from '@material-tailwind/react';

interface CheckpointsProps {
    formData: any;
    updateFormData: any;
}

const Checkpoints: React.FC<CheckpointsProps> = ({ formData, updateFormData }) => {
    // Example: Adding a simple interface to add a checkpoint. Assume you have a model for checkpoints.
    const addCheckpoint = () => {
        const newCheckpoint = { location: 'New Location', description: 'New Description' }; // Simplified example
        const updatedCheckpoints = formData.checkpoints ? [...formData.checkpoints, newCheckpoint] : [newCheckpoint];
        updateFormData({ checkpoints: updatedCheckpoints });
    };

    return (
        <div>
            <Button color="green" onClick={addCheckpoint}>Add Checkpoint</Button>
            <div>
                {formData.checkpoints && formData.checkpoints.map((checkpoint: any, index: any) => (
                    <p key={index}>{checkpoint.location} - {checkpoint.description}</p>
                ))}
            </div>
        </div>
    );
};

export default Checkpoints;
