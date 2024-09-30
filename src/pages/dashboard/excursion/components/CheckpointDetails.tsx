import React from 'react';
import {Card, CardBody, CardHeader, Typography, Button} from '@material-tailwind/react';
import {IExcursion} from "@/models/excursionModel";

interface CheckpointDetailsProps {
    excursion: IExcursion;
}

export const CheckpointDetails: React.FC<CheckpointDetailsProps> = ({excursion}) => {
    return (
        <div className="container mx-auto flex flex-col gap-5">
            <Typography variant="h3">
                Checkpoints
            </Typography>
            <div className="flex space-x-4 overflow-x-auto py-8">
                {excursion.checkpoints.map((checkpoint, index) => (
                    <Card key={index} className="flex-shrink-0 flex flex-col max-w-[300px]">
                        <CardHeader color="blue-gray">
                            <Typography variant="h5" className="px-3 py-2">Checkpoint</Typography>
                        </CardHeader>
                        <CardBody>
                            <Typography variant="h6" color="blue-gray" className="mb-2">
                                {checkpoint.description}
                            </Typography>
                            <Typography variant="small" color="gray" className="mb-4">
                                {checkpoint.location.address}, {checkpoint.location.city},{" "}
                                {checkpoint.location.province}, {checkpoint.location.country}
                            </Typography>

                            {!!checkpoint.buses?.length && (
                                <div className="mb-4">
                                    <Typography variant="h6" color="blue-gray">
                                        Buses Disponibles:
                                    </Typography>
                                    <ul className="list-disc ml-4">
                                        {checkpoint.buses.map((bus, busIndex) => (
                                            <li key={busIndex}>
                                                <Typography variant="small" color="gray">
                                                    Modelo: {bus.model}, Capacidad: {bus.capacity},
                                                    Color: {bus.color}
                                                </Typography>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-auto">
                                <Button
                                    size="sm"
                                    color="blue"
                                    variant="outlined"
                                    onClick={() => window.open(checkpoint.location.link, "_blank")}
                                    className="w-full"
                                >
                                    Ver en Google Maps
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
};