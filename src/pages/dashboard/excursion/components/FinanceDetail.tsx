import React, {useMemo} from "react";
import {Typography, Card, CardBody, CardHeader} from "@material-tailwind/react";
import {IFinance} from "../../../../models/financeModel";
import {IClient} from "../../../../models/clientModel";
import {IProjection} from "../../../../models/projectionModel";
import {IPayment} from "../../../../models/PaymentModel";
import {IOrganization} from "../../../../models/organizationModel";
import {ITransport} from "../../../../models/transportModel";
import StatisticsCard from "../../../../widgets/cards/statistics-card";
import {BanknotesIcon} from "@heroicons/react/24/solid";
import {BiDollar, BiTrip} from "react-icons/bi";
import {
    MdCardTravel,
    MdEmojiTransportation,
    MdOutlineTravelExplore,
    MdOutlineTripOrigin,
    MdPlace
} from "react-icons/md";
import {TruckIcon, UserGroupIcon, UserIcon} from "@heroicons/react/20/solid";
import {TbBus} from "react-icons/tb";
import {FaMountain, FaPlaceOfWorship} from "react-icons/fa";
import {FaMountainCity, FaMountainSun} from "react-icons/fa6";
import {GiMountainCave, GiMountainClimbing, GiTravelDress, GiTripwire} from "react-icons/gi";
import {RiTravestiLine} from "react-icons/ri";

interface IFinanceDetailsProps {
    finance: IFinance;
    clients: IClient[];
    projections: IProjection[];
    excursionId: string;
    destinations: IOrganization[];
    transport: ITransport;
}

export const FinanceDetails = ({
                                   finance,
                                   clients,
                                   projections,
                                   excursionId,
                                   destinations,
                                   transport
                               }: IFinanceDetailsProps) => {
    // Calculate profit
    const profit = useMemo(() => finance.price - (finance?.cost || 0), [finance]);


    // Calculate total received
    const totalReceived = useMemo(() => clients.reduce((total, client) => {
        const payments: IPayment[] = client.services.map(service => service.excursionId === excursionId ? service.payments : []).flat();
        return total + payments.reduce((sum, p) => sum + p.amount, 0);
    }, 0), [clients, excursionId]);

    // Calculate expected total from projections
    const totalExpected = useMemo(() => 0, []);

    const extraPayments = useMemo(() => clients.reduce((total, client) => {
        const payments: IPayment[] = client.services.map(service => (service.status === 'interested') && service.excursionId === excursionId ? service.payments : []).flat();
        return total + payments.reduce((sum, p) => sum + p.amount, 0);
    }, 0), [clients, excursionId]);

    // Calculate total to pay for transport
    const totalTransportCost = useMemo(() => transport.transportResources.reduce((total, resource) => total + (resource.finance?.cost || resource.finance?.price || 0), 0), [transport]);
    const totalDestinationsPerClient = useMemo(() => destinations.reduce((total, destination) => total + (destination.entryFee?.cost || destination.entryFee?.price || 0) * (clients).filter(client => {
        const service = client.services.find(service => service.excursionId === excursionId)
        return service && (service.status === 'paid' || service.status === 'reserved');
    }).length, 0), [destinations, clients.length]);
    // Calculate total to pay for destinations
    const destinationsPrice = useMemo(() => {
        return destinations.reduce((total, destination) => total + (destination.entryFee?.price || 0), 0);
    }, [destinations]);
    const totalDestinationsToPay = useMemo(() => destinationsPrice * clients.length, [destinations, destinationsPrice, clients.length]);

    // Calculate the gaining amount until now
    // const gainingAmount = useMemo(() => (totalReceived - ((finance.cost || 0) * clients.filter(client => {
    //     const service = client.services.find(service => service.excursionId === excursionId);
    //     return service && (service.status === 'paid');
    //
    // }).length)), [totalReceived, finance, clients]);

    const gainingAmount = useMemo(() => (totalReceived - totalTransportCost) - totalDestinationsPerClient, [totalReceived, totalTransportCost, totalDestinationsPerClient]);



    // Count clients by service stage related to the excursionId
    const clientCounts = useMemo(() => {
        return clients.reduce((counts, client) => {
            const service = client.services.find(service => service.excursionId === excursionId);
            if (service) {
                counts[service.status] = (counts[service.status] || 0) + 1;
            }
            return counts;
        }, {} as Record<string, number>);
    }, [clients, excursionId]);

    const investedInFreeClients = useMemo(() => {
        return (clientCounts['free'] || 0) * (finance.cost || 0);
    }, [finance, clientCounts['free']]);

    const transportPrice = useMemo(() => {
        const totalAmount = transport.transportResources.reduce((total, resource) => total + resource.finance?.price || 0, 0)
        const totalCapacity = transport.transportResources.reduce((total, resource) => total + (resource.bus?.capacity || 0), 0)

        return Math.ceil(totalAmount / totalCapacity);
    }, [transport]);



    // Calculate the expected gaining amount
    const expectedGainingAmount = useMemo(() => (profit * clients.length) - investedInFreeClients, [profit, clients]);

    // totoalGainingAmountWithoutExpenses
    const totalGainingAmountWithoutExpenses = useMemo(() => gainingAmount - investedInFreeClients,[gainingAmount, investedInFreeClients])
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
                                <Typography><b>Total actual por clientes pagos y reservados:</b> RD$ {totalDestinationsPerClient.toLocaleString()}</Typography>
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
                                <Typography><b>Gastos en clientes gratis:</b> RD$ {investedInFreeClients.toLocaleString()}</Typography>
                                <Typography><b>Ganancia Esperada:</b> RD$ {expectedGainingAmount.toLocaleString()}</Typography>
                                <Typography><b>Ganancia actual:</b> RD$ {gainingAmount.toLocaleString()}</Typography>
                                <Typography><b>Pagos Extra:</b> RD$ {extraPayments.toLocaleString()}</Typography>
                                <Typography><b>Ganancia total:</b> RD$ {totalGainingAmountWithoutExpenses.toLocaleString()}</Typography>
                                <Typography><b>Total Recibido:</b> RD$ {totalReceived.toLocaleString()}</Typography>
                            </Typography>
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