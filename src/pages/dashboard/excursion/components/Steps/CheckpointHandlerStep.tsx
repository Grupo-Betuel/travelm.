import React, { useState, useEffect } from 'react';
import { Card } from "@material-tailwind/react";
import { ICheckpoint } from "@/models/checkpointModel";
import { IExcursion } from "@/models/excursionModel";
import { ILocation } from "@/models/ordersModels";
import { IBus } from "@/models/busesModel";
import CheckpointResourceHandler from "@/pages/dashboard/excursion/components/CheckpointResourceHandler";

interface ICheckpointFormProps {
    excursionData: IExcursion;
    updateExcursion: (data: Partial<IExcursion>) => void;
}

export const CheckpointHandlerStep = ({
                                          excursionData,
                                          updateExcursion
                                      }: ICheckpointFormProps) => {

    const [localCheckpoints, setLocalCheckpoints] = useState<ICheckpoint[]>(excursionData.checkpoints || []);

    // Load existing checkpoints from excursion data
    useEffect(() => {
        setLocalCheckpoints(excursionData.checkpoints || []);
    }, [excursionData]);

    // Function to handle updates to the checkpoints
    const updateCheckpoints = (updatedCheckpoints: ICheckpoint[]) => {
        setLocalCheckpoints(updatedCheckpoints);
        // Propagate the change to the parent (excursion data)
        updateExcursion({ checkpoints: updatedCheckpoints });
    };

    const availableBuses = excursionData.transport?.transportResources;
    console.log('availableBuses', excursionData.transport?.transportResources);
    return (
        <div>
            <CheckpointResourceHandler
                checkpoints={localCheckpoints}
                updateCheckpoints={updateCheckpoints}
                excursionBuses={availableBuses}
            />
        </div>
    );
};
