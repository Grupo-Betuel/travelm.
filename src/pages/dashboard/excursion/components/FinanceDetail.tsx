import React from "react";
import {Typography, Card, CardBody, CardHeader} from "@material-tailwind/react";
import {IFinance} from "../../../../models/financeModel";
import {IClient} from "../../../../models/clientModel";
import {IProjection} from "../../../../models/projectionModel";

interface IFinanceDetailsProps {
    finance: IFinance;
    clients: IClient[];
    projections: IProjection[];
    excursionId: string;
}

export const FinanceDetails = ({finance, clients, projections, excursionId}: IFinanceDetailsProps) => {
    // Calculate profit
    const profit = finance.price - (finance?.cost || 0);

    // Calculate total received
    const totalReceived = clients.reduce((total, client) => {
        const paidServices = client.services.filter(service => service.excursionId === excursionId);
        return total + paidServices.reduce((sum, service) => sum + service.finance.price, 0);
    }, 0);

    // Calculate expected total from projections
    const totalExpected = projections.reduce((total, projection) => total + (projection.finance?.price || 0), 0);

    return (
        <Card className="border rounded shadow">
            <CardHeader color="blue" className="p-4">
                <Typography variant="h4" color="white">Finance Details</Typography>
            </CardHeader>
            <CardBody>
                <Typography>Excursion Price: ${finance.price.toFixed(2)}</Typography>
                <Typography><b>Cost:</b> RD$ {(finance?.cost || 0).toFixed(2)}</Typography>
                <Typography><b>Profit:</b> RD$ {profit.toLocaleString()}</Typography>
                <Typography><b>Total Received:</b> RD$ {totalReceived.toLocaleString()}</Typography>
                <Typography><b>Total Expected to Receive:</b> RD$ {totalExpected.toLocaleString()}
                </Typography>
            </CardBody>
        </Card>
    );
};
