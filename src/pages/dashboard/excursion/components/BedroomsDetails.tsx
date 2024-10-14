import React, { useMemo } from 'react';
import { Card, CardBody, Typography, Progress } from '@material-tailwind/react';
import { IOrganization } from "@/models/organizationModel";
import { IExcursion } from "@/models/excursionModel";
import { IClient } from "@/models/clientModel";
import { IService } from "@/models/serviceModel";
import { IBedroom } from "@/models/bedroomModel";
import { DataTable, IDataTableColumn, IFilterOption } from "@/components/DataTable";

interface BedroomStatusProps {
    excursion: IExcursion;
}

interface IBedroomWithStats extends IBedroom {
    remainingCapacity: number;
}

const calculateOccupiedCapacity = (excursion: IExcursion, bedroomId?: string) => {
    const { clients, _id: excursionId } = excursion;

    let occupiedCapacity = 0;
    clients.forEach((client: IClient) => {
        client.services.forEach((service: IService) => {
            if (service.excursionId === excursionId && service.bedroom && (bedroomId ? service.bedroom._id === bedroomId : true)) {
                occupiedCapacity += 1;
            }
        });
    });
    return occupiedCapacity;
};

export const BedroomDetails: React.FC<BedroomStatusProps> = ({ excursion }) => {
    const bedrooms = useMemo(() => {
        return excursion.destinations.reduce((acc: IBedroomWithStats[], org: IOrganization) => {
            return [...acc, ...org.bedrooms];
        }, [] as IBedroomWithStats[]).map((bedroom: IBedroomWithStats) => {
            const occupiedQuantity = calculateOccupiedCapacity(excursion, bedroom._id);
            return { ...bedroom, occupiedQuantity: occupiedQuantity || 0 }; // Asegurar que occupiedQuantity no sea undefined
        });
    }, [excursion.destinations, excursion.clients]);

    const totalCapacity = useMemo(() =>
            bedrooms.reduce((acc: number, bedroom: IBedroomWithStats) => acc + bedroom.capacity, 0),
        [bedrooms]
    );
    const occupiedCapacity = useMemo(() => calculateOccupiedCapacity(excursion), [excursion.clients, excursion._id]);

    const occupiedPercentage = Math.ceil((occupiedCapacity / totalCapacity) * 100);

    const columns: IDataTableColumn<IBedroomWithStats>[] = [
        { key: 'name', label: 'Habitación' },
        { key: 'zone', label: 'Zona' },
        { key: 'level', label: 'Planta' },
        { key: 'capacity', label: 'Capacidad' },
        { key: 'occupiedQuantity', label: 'Ocupadas' },
        { key: 'remainingCapacity', label: 'Restante' },
    ];

    const filterOptions: IFilterOption<IBedroomWithStats>[] = useMemo(() => [
        {
            key: 'name',
            label: 'Nombre de la Habitación',
            type: 'text',
        }
    ], []);

    const renderRow = (bedroom: IBedroomWithStats, key: number) => {
        const { name, zone, level, capacity, occupiedQuantity } = bedroom;
        const remainingCapacity = capacity - (occupiedQuantity || 0);

        return (
            <tr key={`${name}-${key}`}>
                <td className="py-3 px-5">
                    <Typography variant="small" color="blue-gray" className="font-semibold w-28">{name}</Typography>
                </td>
                <td className="py-3 px-5">
                    <Typography variant="small" color="blue-gray" className="font-semibold w-28">{zone}</Typography>
                </td>
                <td className="py-3 px-5">
                    <Typography className="text-xs font-semibold text-blue-gray-600">{level}</Typography>
                </td>
                <td className="py-3 px-5">
                    <Typography className="text-xs font-normal text-blue-gray-500">{capacity}</Typography>
                </td>
                <td className="py-3 px-5">
                    <Typography className="text-xs font-normal text-blue-gray-500">{occupiedQuantity}</Typography>
                </td>
                <td className="py-3 px-5">
                    <Typography className="text-xs font-normal text-blue-gray-500">{remainingCapacity}</Typography>
                </td>
            </tr>
        );
    };

    return (
        <div className="container mx-auto flex flex-col gap-5">
            <Typography variant="h3">Habitaciones</Typography>
            <Card className="w-full mb-4">
                <CardBody>
                    <Typography className="text-lg mb-2">Porcentaje Ocupado</Typography>
                    <Progress value={occupiedPercentage} label=" " color="blue" />
                    <Typography className="text-sm mt-2">
                        {occupiedCapacity} / {totalCapacity} (Ocupadas / Capacidad total)
                    </Typography>
                </CardBody>
            </Card>
            <DataTable
                data={bedrooms}
                columns={columns}
                filterOptions={filterOptions}
                renderRow={renderRow}
            />
        </div>
    );
};
