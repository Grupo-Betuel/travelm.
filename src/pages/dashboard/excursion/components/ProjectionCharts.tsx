import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {IProjection} from "../../../../models/projectionModel";
import React from "react";

export interface IProjectionChartsProps {
    projections: IProjection[]
};


export const ProjectionsCharts = ({projections}: IProjectionChartsProps) => {
    const data = projections.map(proj => ({
        name: new Date(proj.date).toDateString(),
        clients: proj.clients,
        finance: proj?.finance?.price || 0
    }));

    return (
        <LineChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name"/>
            <YAxis/>
            <Tooltip/>
            <Legend/>
            <Line type="monotone" dataKey="clients" stroke="#8884d8"/>
            <Line type="monotone" dataKey="finance" stroke="#82ca9d"/>
        </LineChart>
    );
};
