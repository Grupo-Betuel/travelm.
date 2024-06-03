import React, {useEffect, useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {Button, Card, CardBody, Dialog, Typography} from "@material-tailwind/react";
import {IExcursion} from "../../../../models/excursionModel";
import {TrashIcon} from "@heroicons/react/20/solid";
import StatisticsCard from "../../../../widgets/cards/statistics-card";
import {BanknotesIcon} from "@heroicons/react/24/solid";
import {getCrudService} from "../../../../api/services/CRUD.service";
import {calculateExcursionsStatistics} from "../../../../utils/statistics.utils";
import ProtectedElement from "../../../../components/ProtectedElement";
import {UserRoleTypes, UserTypes} from "../../../../models/interfaces/userModel";
import {CommonConfirmActions, CommonConfirmActionsDataTypes} from "../../../../models/common";
import {useConfirmAction} from "../../../../hooks/useConfirmActionHook";
import {AiFillEdit} from "react-icons/ai";
import {DataPagination} from "../../../../components/DataPagination";
import {DataTable, IDataTableColumn, IFilterOption} from "../../../../components/DataTable";

const excursionService = getCrudService("excursions");

function ExcursionsList() {
    const [excursions, setExcursions] = useState<IExcursion[]>([]);
    const {data: excursionsData} = excursionService.useFetchAllExcursions();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Initial items per page
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

    const totalPages = Math.ceil(excursions.length / itemsPerPage);

    const excursionsToShow = excursions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Math.abs(Number(value)) || 1);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    const columns: IDataTableColumn<IExcursion>[] = [
        {key: 'title', label: 'Titulo'},
        {key: 'status', label: 'Estado'},
        {key: 'organizations', label: 'Organizaciones'},
        {key: 'destinations', label: 'Destinos'},
        {key: 'clients', label: 'Clientes'},
        {key: 'finance.price', label: 'Precio'},
        {key: 'reviews.stars', label: 'Estrellas'},
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
                <Link
                    to={excursion.status === 'completed' ? `/dashboard/excursions/${excursion._id}` : `/dashboard/excursions/handler/${excursion._id}`}
                    className="whitespace-pre-line line-clamp-2 w-[150px]">{excursion.title || ' _'}</Link>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {excursion.status}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {excursion.organizations.map(item => <Link to={`/organization/${item._id}`}>
                        {item.name}
                    </Link>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <p className="whitespace-break-spaces line-clamp-4">{excursion.destinations.map(item => item.name).join(',\n')}</p>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {excursion.clients.length}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${excursion.finance?.price.toFixed(2)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {excursion.reviews.reduce((acc, review) => acc + review.stars, 0) / excursion.reviews.length || 0}
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
            <div className="grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
                <StatisticsCard
                    title="Total Clients"
                    value={statistics.totalClients.toString()}
                    icon={React.createElement(BanknotesIcon, {
                        className: "w-6 h-6 text-white",
                    })}
                    footer={
                        <Typography className="font-normal text-blue-gray-600">
                            <strong className="red">strong</strong>
                            &nbsp;label
                        </Typography>
                    }
                />
                <StatisticsCard
                    title="Total Money Collected"
                    value={statistics.totalBenefit.toString()}
                    icon={React.createElement(BanknotesIcon, {
                        className: "w-6 h-6 text-white",
                    })}
                    footer={
                        <Typography className="font-normal text-blue-gray-600">
                            <strong className="red">strong</strong>
                            &nbsp;label
                        </Typography>
                    }
                />
                <StatisticsCard
                    title="Destinations Visited"
                    value={statistics.totalDestinationsVisited.toString()}
                    icon={React.createElement(BanknotesIcon, {
                        className: "w-6 h-6 text-white",
                    })}
                    footer={
                        <Typography className="font-normal text-blue-gray-600">
                            <strong className="red">strong</strong>
                            &nbsp;label
                        </Typography>
                    }
                />
                <StatisticsCard
                    title="Total Organizations"
                    value={statistics.totalOrganizations.toString()}
                    icon={React.createElement(BanknotesIcon, {
                        className: "w-6 h-6 text-white",
                    })}
                    footer={
                        <Typography className="font-normal text-blue-gray-600">
                            <strong className="red">strong</strong>
                            &nbsp;label
                        </Typography>
                    }
                />
                <StatisticsCard
                    title="Promedio de Satisfacción"
                    value={statistics.averageSatisfaction.toString()}
                    icon={React.createElement(BanknotesIcon, {
                        className: "w-6 h-6 text-white",
                    })}
                    footer={
                        <Typography className="font-normal text-blue-gray-600">
                            <strong className="red">strong</strong>
                            &nbsp;label
                        </Typography>
                    }
                />
            </div>
            <DataTable
                data={excursions}
                columns={columns}
                filterOptions={filterOptions}
                renderRow={renderRow}
            />
            <DataPagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
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
