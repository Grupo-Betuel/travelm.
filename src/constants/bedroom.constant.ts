// bedroom.constant.ts
import { IDataTableColumn, IFilterOption} from "@/components/DataTable";
import {IBedroom} from "@/models/bedroomModel";

export const generateFilterOptions = (bedrooms: IBedroom[]): IFilterOption<IBedroom>[] => {
    return [
        {
            key: 'capacity',
            label: 'Filtrar por Capacidad',
            type: 'select',
            options: Array.from(new Set(bedrooms.map(bedroom => bedroom.capacity.toString()))).map(capacity => ({
                label: capacity,
                value: capacity
            }))
        },
        {
            key: 'level',
            label: 'Filtrar por Planta',
            type: 'select',
            options: Array.from(new Set(bedrooms.map(bedroom => bedroom.level.toString()))).map(level => ({
                label: level,
                value: level
            }))
        },
        {
            key: 'zone',
            label: 'Filtrar por Zona',
            type: 'select',
            options: Array.from(new Set(bedrooms.map(bedroom => bedroom.zone))).map(zone => ({
                label: zone,
                value: zone
            }))
        }
    ];
};

export const bedroomColumns: IDataTableColumn<IBedroom>[] = [
    {key: 'name', label: 'Nombre'},
    {key: 'capacity', label: 'Capacidad'},
    {key: 'level', label: 'Planta'},
    {key: 'zone', label: 'Zona'},
    {key: 'actions', label: 'Acciones'}
];
