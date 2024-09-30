import React, {useEffect, useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {Button, Card, CardBody, Dialog, Typography} from "@material-tailwind/react";
import {IExcursion} from "../../../../models/excursionModel";
import {TrashIcon, UserGroupIcon} from "@heroicons/react/20/solid";
import StatisticsCard from "../../../../widgets/cards/statistics-card";
import {BanknotesIcon} from "@heroicons/react/24/solid";
import {getCrudService} from "../../../../api/services/CRUD.service";
import {calculateExcursionsStatistics} from "../../../../utils/statistics.utils";
import ProtectedElement from "../../../../components/ProtectedElement";
import {UserRoleTypes, UserTypes} from "../../../../models/interfaces/userModel";
import {CommonConfirmActions, CommonConfirmActionsDataTypes} from "../../../../models/common";
import {useConfirmAction} from "../../../../hooks/useConfirmActionHook";
import {AiFillEdit, AiFillStar} from "react-icons/ai";
import {DataTable, IDataTableColumn, IFilterOption} from "../../../../components/DataTable";
import {BiDollar} from "react-icons/bi";
import {MdPlace} from "react-icons/md";
import {RiOrganizationChart} from "react-icons/ri";
import LoginScreen from "@/components/formvalidationexample";

const excursionService = getCrudService("excursions");

function ExcursionsList() {
    const [excursions, setExcursions] = useState<IExcursion[]>([]);
    const {data: excursionsData} = excursionService.useFetchAllExcursions();
    const [statistics, setStatistics] = useState({
        totalClients: 0,
        totalBenefit: 0,
        totalDestinationsVisited: 0,
        totalOrganizations: 0,
        averageSatisfaction: 0
    });
    const [deleteExcursion, {isLoading: isDeleting}] = excursionService.useDeleteExcursions();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const onConfirmAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IExcursion>) => {
        switch (type) {
            case 'delete':
                handleDeleteExcursion(data as IExcursion);
                break;
        }
    };

    const {
        handleSetActionToConfirm,
        ConfirmDialog
    } = useConfirmAction<CommonConfirmActions, CommonConfirmActionsDataTypes<IExcursion>>(onConfirmAction);

    const handleDeleteExcursion = (excursion: IExcursion) => {
        // Handle delete
        excursion._id && deleteExcursion(excursion._id);
        //TODO: toast
    };

    useEffect(() => {
        setExcursions(excursionsData || []);
        const stats = calculateExcursionsStatistics(excursionsData || []);
        setStatistics(stats);
    }, [excursionsData]);

    const columns: IDataTableColumn<IExcursion>[] = [
        {key: 'title', label: 'Titulo'},
        {key: 'status', label: 'Estado'},
        {key: 'organizations', label: 'Organizaciones'},
        {key: 'destinations', label: 'Destinos'},
        {key: 'clients', label: 'Clientes'},
        {key: 'finance.price', label: 'Precio'},
        // {key: 'reviews.stars', label: 'Estrellas'},
        {key: 'actions', label: 'Acciones'}
    ];

    const filterOptions: IFilterOption<IExcursion>[] = useMemo(() => [
        {
            key: 'organizations',
            label: 'Filtrar por Organizacion',
            type: 'select',
            options: Array.from(new Set(excursions.map(e => e.organizations).flat())).map(org => ({
                label: org.name,
                value: org._id as string
            }))
        },
        {
            key: 'destinations',
            label: 'Filtrar por Destino',
            type: 'select',
            options: Array.from(new Set(excursions.map(e => e.destinations).flat())).map(dest => ({
                label: dest.name,
                value: dest._id as string
            }))
        },
        {
            key: 'clients',
            label: 'Filtrar por Ciente',
            type: 'select',
            options: excursions.flatMap(excursion => excursion.clients).map((client, index) => ({
                label: client.firstName,
                value: client._id as string,
            }))
        },
        {
            key: 'reviews',
            label: 'Filtrar por Estrellas',
            type: 'select',
            options: [1, 2, 3, 4, 5].map(star => ({
                label: `${star} Stars`,
                value: star as number
            }))
        }
    ], [excursions]);

    const renderRow = (excursion: IExcursion) => (
        <tr key={excursion._id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <Button variant="text" className="text-start capitalize" size="lg">
                    <Link
                        to={excursion.status === 'completed' ? `/dashboard/excursions/${excursion._id}` : `/dashboard/excursions/handler/${excursion._id}`}
                        className="whitespace-pre-line line-clamp-2 w-[150px]">{excursion.title || ' _'}</Link>
                </Button>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {excursion.status}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {excursion.organizations.map(item => item.name).join(', ')}

            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <p className="whitespace-break-spaces line-clamp-4">{excursion.destinations.map(item => item.name).join(',\n')}</p>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {excursion.clients.length}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                RD${excursion.finance?.price.toLocaleString()}
            </td>
            <td>
                <ProtectedElement roles={[UserRoleTypes.ADMIN]} userTypes={[UserTypes.AGENCY]}>
                    <div className="flex items-center">
                        <Link
                            to={`/dashboard/excursions/handler/${excursion._id}`}>
                            <Button
                                size="sm"
                                color="blue"
                                variant="text"
                                className="rounded-full"
                                ripple
                            >
                                <AiFillEdit className="w-[21px] h-[21px]"/>
                            </Button>
                        </Link>
                        <Button
                            size="sm"
                            color="red"
                            variant="text"
                            className="rounded-full"
                            onClick={() => handleSetActionToConfirm('delete', 'eliminar esta excursion')(excursion)}
                            ripple
                        >
                            <TrashIcon className="w-[21px] h-[21px]"/>
                        </Button>
                    </div>
                </ProtectedElement>
            </td>
        </tr>
    );

    return (
        <div className="p-4 flex flex-col gap-6 min-h-[88dvh]">
            <LoginScreen />
            <div className="grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
                <StatisticsCard
                    title="Clientes"
                    value={statistics.totalClients.toString()}
                    icon={<UserGroupIcon className="w-6 h-6 text-white"/>}
                    footer={
                        <Typography variant="small" className="font-normal text-blue-gray-600">
                            Total de clientes alcanzados
                        </Typography>
                    }
                />
                <StatisticsCard
                    title="Ganancia total"
                    value={`RD${statistics.totalBenefit.toLocaleString()}`}
                    icon={<BiDollar className="w-6 h-6 text-white"/>}

                    footer={
                        <Typography variant="small" className="font-normal text-blue-gray-600">
                            Ganancia de todas las excursiones
                        </Typography>
                    }
                />
                <StatisticsCard
                    title="Destinos"
                    value={statistics.totalDestinationsVisited.toString()}
                    icon={<MdPlace className="w-6 h-6 text-white"/>}

                    footer={
                        <Typography variant="small" className="font-normal text-blue-gray-600">
                            Todos los destinos visitados
                        </Typography>
                    }
                />
                <StatisticsCard
                    title="Organizaciones"
                    value={statistics.totalOrganizations.toString()}
                    icon={<RiOrganizationChart className="w-6 h-6 text-white"/>}
                    footer={
                        <Typography variant="small" className="font-normal text-blue-gray-600">
                            Total de colaboraciones con organizaciones
                        </Typography>
                    }
                />
                <StatisticsCard
                    title="Promedio de Satisfacción"
                    value={statistics.averageSatisfaction.toString()}
                    icon={<AiFillStar className="w-6 h-6 text-white"/>}

                    footer={
                        <Typography variant="small" className="font-normal text-blue-gray-600">
                            Promedio de satisfacción de todas las excursiones
                        </Typography>
                    }
                />
            </div>
            <div className="flex items-center justify-end gap-5">
                <ProtectedElement roles={[UserRoleTypes.ADMIN]} userTypes={[UserTypes.AGENCY]}>
                    <Button color="blue" variant="text" size="lg">
                        <Link to="/dashboard/excursions/handler">
                            Crear Excursion
                        </Link>
                    </Button>
                </ProtectedElement>
            </div>
            <DataTable
                data={excursions}
                columns={columns}
                filterOptions={filterOptions}
                renderRow={renderRow}
            />
            <Dialog open={modalOpen} handler={() => setModalOpen(false)}>
                <Card>
                    <CardBody>
                        <div>
                            {selectedImage && <img src={selectedImage} alt="Selected" className="max-w-full h-auto"/>}
                        </div>
                    </CardBody>
                </Card>
            </Dialog>
            <ConfirmDialog/>
        </div>
    );
}

export default ExcursionsList;
