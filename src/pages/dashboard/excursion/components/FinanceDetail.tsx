import React, {useMemo, useState} from "react";
import {Typography, Card, CardBody, CardHeader, Button} from "@material-tailwind/react";
import {IFinance} from "@/models/financeModel";
import {IClient} from "@/models/clientModel";
import {IProjection} from "@/models/projectionModel";
import {IPayment} from "@/models/PaymentModel";
import {IOrganization} from "@/models/organizationModel";
import {ITransport} from "@/models/transportModel";
import StatisticsCard from "@/widgets/cards/statistics-card";
import {BanknotesIcon} from "@heroicons/react/24/solid";
import {BiDollar, BiEdit, BiTrip} from "react-icons/bi";
import {
    MdPlace
} from "react-icons/md";
import {UserGroupIcon} from "@heroicons/react/20/solid";
import {TbBus} from "react-icons/tb";
import {IExpense} from "@/models/ExpensesModel";


interface IFinanceDetailsProps {
    finance: IFinance;
    expenses?: IExpense[];
    clients: IClient[];
    projections: IProjection[];
    excursionId: string;
    destinations: IOrganization[];
    transport: ITransport;
    dialog?: () => void;
}

export const FinanceDetails = ({
                                   finance,
                                   clients,
                                   expenses = [],
                                   projections,
                                   excursionId,
                                   destinations,
                                   dialog,
                                   transport
                               }: IFinanceDetailsProps) => {

    // Calculate profit
    const profit = useMemo(() => finance.price - (finance?.cost || 0), [finance]);

    // Calculate total received
    const totalReceived = useMemo(
        () =>
            clients.reduce((total, client) => {
                const payments: IPayment[] = client.services
                    .map((service) => (service.excursionId === excursionId ? service.payments : []))
                    .flat();
                return total + payments.reduce((sum, p) => sum + p.amount, 0);
            }, 0),
        [clients, excursionId]
    );

    const extraPayments = useMemo(
        () =>
            clients.reduce((total, client) => {
                const payments: IPayment[] = client.services
                    .map((service) => (service.status === "interested" && service.excursionId === excursionId ? service.payments : []))
                    .flat();
                return total + payments.reduce((sum, p) => sum + p.amount, 0);
            }, 0),
        [clients, excursionId]
    );


    // Calculate total to pay for transport
    const totalTransportCost = useMemo(
        () =>
            transport.transportResources.reduce(
                (total, resource) => total + (resource.finance?.cost || resource.finance?.price || 0),
                0
            ),
        [transport]
    );
    const totalDestinationsPerClient = useMemo(
        () =>
            destinations.reduce((total, destination) => {
                const perClientCost =
                    (destination.entryFee?.cost || destination.entryFee?.price || 0) *
                    clients.filter((client) => {
                        const service = client.services.find((service) => service.excursionId === excursionId);
                        return service && (service.status === "paid" || service.status === "reserved");
                    }).length;
                return total + perClientCost;
            }, 0),
        [destinations, clients, excursionId]
    );

    //calculate total expenses extra
    const totalExpenses = expenses?.length ?? 0;
    const totalAmount = expenses?.reduce((acc, expense) => acc + (expense.finance?.price ?? 0), 0);

    // Calculate total to pay for destinations
    const destinationsPrice = useMemo(
        () => destinations.reduce((total, destination) => total + (destination.entryFee?.price || 0), 0),
        [destinations]
    );

    const totalDestinationsToPay = useMemo(() => destinationsPrice * clients.length, [destinationsPrice, clients]);

    const gainingAmount = useMemo(
        () => totalReceived - totalTransportCost - totalDestinationsPerClient - totalAmount,
        [totalReceived, totalTransportCost, totalDestinationsPerClient, totalAmount]
    );

    // Count clients by service stage related to the excursionId
    const clientCounts = useMemo(
        () =>
            clients.reduce((counts, client) => {
                const service = client.services.find((service) => service.excursionId === excursionId);
                if (service) {
                    const seats = service.seats || 0; // Fallback to 0 if seats is undefined or falsy
                    console.log("Service found:", seats); // Debugging line
                    counts[service.status] = (counts[service.status] || 0) + seats;
                } else {
                    console.log("No service found for client:", client); // Debugging line
                }
                return counts;
            }, {} as Record<string, number>),
        [clients, excursionId]
    );

    const investedInFreeClients = useMemo(() => {
        return (clientCounts['free'] || 0) * (finance.cost || 0);
    }, [finance, clientCounts['free']]);

    const transportPrice = useMemo(() => {
        const totalAmount = transport.transportResources.reduce(
            (total, resource) => total + (resource.finance?.price || 0),
            0
        );
        const totalCapacity = transport.transportResources.reduce(
            (total, resource) => total + (resource.bus?.capacity || 0),
            0
        );
        return Math.ceil(totalAmount / totalCapacity);
    }, [transport]);

    console.log('expenses',expenses)

    const totalSeats = useMemo(() => {
        return clients.reduce((total, client) => {
            const service = client.services.find((service) => service.excursionId === excursionId);
            return total + (service?.seats || 0);
        }, 0);
    }, [clients, excursionId]);

    // Calculate the expected gaining amount
    const expectedGainingAmount = useMemo(
        () => profit * totalSeats - investedInFreeClients,
        [profit, totalSeats, investedInFreeClients]
    );
    // totoal GainingAmountWithoutExpenses
    const totalGainingAmountWithoutExpenses = useMemo(
        () => gainingAmount - investedInFreeClients,
        [gainingAmount, investedInFreeClients]
    );

    return (
        <Card className="mt-10">
            <CardHeader color="blue" className="p-4">
                <Typography variant="h4" color="white">Finanzas</Typography>
            </CardHeader>
            <CardBody>
                <div className="grid gap-y-6 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
                    <StatisticsCard
                        title="Excursion"
                        value={
                            <div className="font-bold">
                                RD${finance.price.toLocaleString()} <span className={"text-sm"}> p/p</span>
                            </div>
                        }
                        icon={<BiTrip className="w-6 h-6 text-white"/>}
                        footer={
                            <Typography className="font-normal text-blue-gray-600">
                                <Typography className="flex items-center gap-1">
                                    <b>Costo<span className={"text-sm"}> (p/p)</span>:</b>
                                    RD$ {(finance?.cost || 0).toLocaleString()}
                                </Typography>

                            </Typography>
                        }
                    />
                    <StatisticsCard
                        title="Transporte"
                        value={
                            <div className="font-bold">
                                RD${transportPrice.toLocaleString()} <span className={"text-sm"}> p/p</span>
                            </div>
                        }
                        icon={<TbBus className="w-6 h-6 text-white"/>}
                        footer={
                            <Typography className="font-normal text-blue-gray-600">
                                <Typography><b>Total a pagar:</b> RD$ {totalTransportCost.toLocaleString()}</Typography>
                            </Typography>
                        }
                    />
                    <StatisticsCard
                        title="Destinos"
                        value={
                            <div className="font-bold">
                                RD${destinationsPrice.toLocaleString()} <span className={"text-sm"}> p/p</span>
                            </div>
                        }
                        icon={<MdPlace className="w-6 h-6 text-white"/>}
                        footer={
                            <Typography className="font-normal text-blue-gray-600">
                                <Typography><b>Total estimado a pagar:</b> RD$ {totalDestinationsToPay.toLocaleString()}
                                </Typography>
                                <Typography><b>Total actual por clientes pagos y
                                    reservados:</b> RD$ {totalDestinationsPerClient.toLocaleString()}</Typography>
                            </Typography>
                        }
                    />

                    <StatisticsCard
                        title="Gastos Extras"
                        value={<div className="font-bold">{expenses?.length}</div>}
                        icon={<BanknotesIcon className="w-6 h-6 text-white"/>}
                        footer={
                            <>
                                <Typography className="font-normal text-blue-gray-600">
                                    <Typography><b>Gastos Pendientes:</b> {totalExpenses} </Typography>
                                    <Typography><b>Total a Pagar:</b>RD$ {totalAmount.toLocaleString()} </Typography>
                                </Typography>
                                <div className="absolute bottom-4">
                                    <Button className="p-3" onClick={dialog} color="blue">
                                        <BiEdit className="inline-block w-6 h-6" />
                                    </Button>
                                </div>
                            </>
                        }
                    />

                    <StatisticsCard
                        title="Clientes"
                        value={
                            <div className="font-bold">
                                {clients.length}
                            </div>
                        }
                        icon={<UserGroupIcon className="w-6 h-6 text-white"/>}
                        footer={
                            <Typography className="font-normal text-blue-gray-600">
                                <Typography><b>Pagados:</b> {clientCounts['paid'] || 0}</Typography>
                                <Typography><b>Reservados:</b> {clientCounts['reserved'] || 0}</Typography>
                                <Typography><b>Interesados:</b> {clientCounts['interested'] || 0}</Typography>
                                <Typography><b>Gratis:</b> {clientCounts['free'] || 0}</Typography>
                                <Typography><b>Cancelados:</b> {clientCounts['canceled'] || 0}</Typography>
                            </Typography>
                        }
                    />

                    <StatisticsCard
                        title="Ganancias y Gastos"
                        value={
                            <div className="font-bold">
                                RD${profit.toLocaleString()} <span className={"text-sm"}> p/p</span>
                            </div>
                        }
                        icon={<BiDollar className="w-6 h-6 text-white"/>}
                        footer={
                            <Typography className="font-normal text-blue-gray-600">
                                <Typography><b>Gastos en clientes
                                    gratis:</b> RD$ {investedInFreeClients.toLocaleString()}</Typography>
                                <Typography><b>Gastos Extras:</b> RD$ {totalAmount.toLocaleString()}</Typography>
                                <Typography><b>Ganancia Esperada:</b> RD$ {expectedGainingAmount.toLocaleString()}
                                </Typography>
                                <Typography><b>Ganancia actual:</b> RD$ {gainingAmount.toLocaleString()}</Typography>
                                <Typography><b>Pagos Extra:</b> RD$ {extraPayments.toLocaleString()}</Typography>
                                <Typography><b>Ganancia
                                    total:</b> RD$ {totalGainingAmountWithoutExpenses.toLocaleString()}</Typography>
                                <Typography><b>Total Recibido:</b> RD$ {totalReceived.toLocaleString()}</Typography>
                            </Typography>
                        }
                    />

                </div>
                <div className="flex flex-col items-end p-1">
                    <Typography variant="small" className="font-normal text-blue-gray-600">
                        Total a Gastar
                    </Typography>
                    <Typography variant="h4" color="blue-gray">
                        RD${(totalDestinationsToPay + totalTransportCost).toLocaleString()}
                    </Typography>
                </div>
            </CardBody>
        </Card>
    );
};