import React, {useMemo} from 'react';
import {Card, CardBody, CardHeader, Typography, Progress} from '@material-tailwind/react';
import {IOrganization} from "../../../../models/organizationModel";
import {IExcursion} from "../../../../models/excursionModel";
import {IClient} from "../../../../models/clientModel";
import {IService} from "../../../../models/serviceModel";
import {IBedroom} from "../../../../models/bedroomModel";

interface BedroomStatusProps {
    excursion: IExcursion;
}

const calculateOccupiedCapacity = (excursion: IExcursion, bedroomId?: string) => {
    const {clients, _id: excursionId} = excursion;

    let occupiedCapacity = 0;
    clients.forEach((client: IClient) => {
        client.services.forEach((service: IService) => {
            if (service.excursionId === excursionId && service.bedroom && (bedroomId ? service.bedroom._id === bedroomId : true)) {
                occupiedCapacity += 1; // Count only one occupied capacity per service with a bedroom
            }
        });
    });
    return occupiedCapacity;
};

export const BedroomDetails: React.FC<BedroomStatusProps> = ({excursion}) => {
    const bedrooms = useMemo(() => {
        return excursion.destinations.reduce((acc: IBedroom[], org: IOrganization) => {
            return [...acc, ...org.bedrooms];
        }, [] as IBedroom[]).map((bedroom: IBedroom) => {
            const occupiedQuantity = calculateOccupiedCapacity(excursion, bedroom._id);
            return {...bedroom, occupiedQuantity};
        });
    }, [excursion.destinations, excursion.clients]);

    const totalCapacity = useMemo(() => bedrooms.reduce((acc: number, bedroom: IBedroom) => acc + bedroom.capacity, 0), [bedrooms]);

    const occupiedCapacity = useMemo(() => calculateOccupiedCapacity(excursion), [excursion.clients, excursion._id]);

    const occupiedPercentage = (occupiedCapacity / totalCapacity) * 100;

    return (
        <div className="container mx-auto flex flex-col gap-5">
            <Typography variant="h2">
                Estado de las Habitaciones
            </Typography>
            <Card className="w-full mb-4">
                <CardBody>
                    <Typography className="text-lg mb-2">Overall Occupancy</Typography>
                    <Progress value={occupiedPercentage} color="blue"/>
                    <Typography className="text-sm mt-2">
                        {occupiedCapacity} / {totalCapacity} (Occupied / Total Capacity)
                    </Typography>
                </CardBody>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bedrooms.map((bedroom: IBedroom, index: number) => {
                    const bedroomOccupiedCapacity = bedroom.occupiedQuantity || 0;
                    const remainingCapacity = bedroom.capacity - bedroomOccupiedCapacity;
                    const bedroomOccupiedPercentage = (bedroomOccupiedCapacity / bedroom.capacity) * 100;

                    return (
                        <Card key={index} className="w-full">
                            <CardHeader>
                                <Typography variant="h5" className="px-3 py-2">{bedroom.name}</Typography>
                            </CardHeader>
                            <CardBody>
                                <Typography className="text-sm mb-2">Zone: {bedroom.zone}</Typography>
                                <Typography className="text-sm mb-2">Level: {bedroom.level}</Typography>
                                <Typography className="text-sm mb-2">Total Capacity: {bedroom.capacity}</Typography>
                                <Typography className="text-sm mb-2">Occupied
                                    Capacity: {bedroomOccupiedCapacity}</Typography>
                                <Typography className="text-sm mb-2">Remaining
                                    Capacity: {remainingCapacity}</Typography>
                                <Progress value={bedroomOccupiedPercentage} color="blue"/>
                            </CardBody>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
