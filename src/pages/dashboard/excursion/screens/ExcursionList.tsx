import React, {ChangeEvent, useEffect, useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {Button, Card, CardBody, Dialog, Input, Option, Select, Typography} from "@material-tailwind/react";
import {IExcursion} from "../../../../models/excursionModel";
import {ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, TrashIcon} from "@heroicons/react/20/solid";
// @ts-ignore
import StatisticsCard from "../../../../widgets/cards/statistics-card";
import {BanknotesIcon} from "@heroicons/react/24/solid";
import {IClient} from "../../../../models/clientModel";
import {getCrudService} from "../../../../api/services/CRUD.service";
import {calculateExcursionsStatistics} from "../../../../utils/statistics.utils";
import ProtectedElement from "../../../../components/ProtectedElement";
import {UserRoleTypes, UserTypes} from "../../../../models/interfaces/userModel";
import {CommonConfirmActions, CommonConfirmActionsDataTypes} from "../../../../models/common";
import {useConfirmAction} from "../../../../hooks/useConfirmActionHook";
import {AiFillEdit} from "react-icons/ai";


interface Filters {
    organization: string;
    destination: string;
    client: string;
    stars: number;
}

const excursionService = getCrudService("excursions");

function ExcursionsList() {
    const [excursions, setExcursions] = useState<IExcursion[]>([]);
    const {data: excursionsData} = excursionService.useFetchAllExcursions()
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<Filters>({
        organization: '',
        destination: '',
        client: '',
        stars: 0,
    });
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

    const onConfirmAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IExcursion>) => {
        switch (type) {
            case 'delete':
                handleDeleteExcursion(data as IExcursion);
                break;
        }
    }

    const onDeniedAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IExcursion>) => {

    }

    const {
        handleSetActionToConfirm,
        resetActionToConfirm,
        ConfirmDialog
    } = useConfirmAction<CommonConfirmActions, CommonConfirmActionsDataTypes<IExcursion>>(onConfirmAction, onDeniedAction);

    const handleDeleteExcursion = (excursion: IExcursion) => {
        // Handle delete
        excursion._id && deleteExcursion(excursion._id);
        //TODO: toast
    }


    const [sortConfig, setSortConfig] = useState<{
        key: keyof IExcursion;
        direction: 'ascending' | 'descending'
    } | null>(null);

    useEffect(() => {
        setExcursions(excursionsData || [])
        const stats = calculateExcursionsStatistics(excursionsData || []);
        setStatistics(stats);
    }, [excursionsData])

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleFilterChange = (filterKey: keyof Filters, value?: string | number) => {
        console.log(filterKey, value);
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterKey]: value as any
        }));
    };

    const handleSort = (key: keyof IExcursion) => {
        setSortConfig(prevConfig => {
            if (prevConfig && prevConfig.key === key && prevConfig.direction === 'ascending') {
                return {key, direction: 'descending'};
            }
            return {key, direction: 'ascending'};
        });
    };

    const sortedExcursions = useMemo(() => {
        if (!sortConfig) return excursions || [];

        return [...(excursions || [])].sort((a: any, b: any) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
    }, [excursions, sortConfig]);


    const filteredExcursions = useMemo(() => {
        const searchLower = searchTerm.toLowerCase();

        return excursions.filter(excursion => {
            const wrappedONames = excursion.organizations.map(org => org.name).join(' ').toLowerCase();
            const wrappedDNames = excursion.destinations.map(org => org.name).join(' ').toLowerCase();
            const organizationMatch = wrappedONames.includes(filters.organization.toLowerCase());
            const destinationMatch = wrappedDNames.includes(filters.destination.toLowerCase());
            const clientMatch = filters.client === '' || excursion.clients.some(client => client.firstName.toLowerCase().includes(filters.client.toLowerCase()));
            const starsMatch = filters.stars === 0 || excursion.reviews.some(review => review.stars === filters.stars);
            const excursionData = JSON.stringify(excursion).toLowerCase();
            const searchTermMatch = excursionData.includes(searchLower)

            return organizationMatch && destinationMatch && clientMatch && starsMatch && searchTermMatch;
        });
    }, [excursions, filters, sortedExcursions, searchTerm]);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setModalOpen(true);
    };


    const totalPages = useMemo(() => Math.ceil(filteredExcursions.length / itemsPerPage), [filteredExcursions, itemsPerPage]);

    const excursionsToShow = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredExcursions.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredExcursions, currentPage, itemsPerPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Math.abs(Number(value)) || 1);
        setCurrentPage(1); // Reset to first page when changing items per page
    };


    return (
        <div className="p-4 flex flex-col gap-6 min-h-[88dvh]">
            <div className=" grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
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
            <div className="flex flex-col gap-4">
                <div className="mb-1 flex flex-col gap-6">
                    <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                        Buscar
                    </Typography>
                    <Input
                        size="lg"
                        placeholder="name@mail.com"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                        onChange={handleSearch}
                    />
                </div>
                <div className="flex gap-4 mb-4">
                    <Select
                        value={filters.organization}
                        label="Filter by Organization"
                        onChange={(value?: string) => handleFilterChange('organization', value)}
                    >
                        <Option value="">Todos</Option>

                        {Array.from(new Set(excursions.map(e => e.organizations.name))).map(org => (
                            <Option key={org} value={org}>{org}</Option>
                        ))}
                    </Select>
                    <Select
                        label="Filter by Destination"
                        onChange={(value?: string) => handleFilterChange('destination', value)}
                        value={filters.destination}
                    >
                        <Option value="">Todos</Option>
                        {Array.from(new Set(excursions.map(e => e.destinations.name))).map(dest => (
                            <Option key={dest} value={dest}>{dest}</Option>
                        ))}
                    </Select>
                    <Select
                        label="Filter by Client"
                        onChange={(value?: string) => handleFilterChange('client', value)}
                        value={filters.client}
                    >
                        <Option value="">Todos</Option>
                        {excursions.flatMap(excursion => excursion.clients).map((client: IClient, index: number) => (
                            <Option key={`client-${index}`} value={client.firstName}>{client.firstName}</Option>
                        ))}
                    </Select>
                    <Select
                        label="Filter by Stars"
                        onChange={(value?: string) => handleFilterChange('stars', parseInt(value || '0'))}
                        value={filters.stars.toString()}
                    >
                        <Option value="">Todos</Option>
                        {[1, 2, 3, 4, 5].map(star => (
                            <Option key={star} value={star.toString()}>{star} Stars</Option>
                        ))}
                    </Select>
                    <ProtectedElement roles={[UserRoleTypes.ADMIN]} userTypes={[UserTypes.AGENCY]}>
                        <Link to={"handler/"}>
                            <Button variant="text" color="blue" className="whitespace-nowrap">Crear Excursion</Button>
                        </Link>
                    </ProtectedElement>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        {["Titulo", "Estado", "Organizaciones", "Destinos", "Clientes", 'Precio', "Estrellas", "Acciones"].map((key) => (
                            <th key={key} scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                <div onClick={() => handleSort(key as keyof IExcursion)}>
                                    {key}
                                    {sortConfig?.key === key && (
                                        sortConfig.direction === 'ascending' ?
                                            <ArrowUpIcon className="ml-2 inline h-4 w-4"/> :
                                            <ArrowDownIcon className="ml-2 inline h-4 w-4"/>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {excursionsToShow.map(excursion => (
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
                            {/*<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">*/}
                            {/*    <div className="flex items-center space-x-2">*/}
                            {/*        {excursion.images.map((image, i) => (*/}
                            {/*            <img*/}
                            {/*                key={i}*/}
                            {/*                src={image.content}*/}
                            {/*                alt="Flyer"*/}
                            {/*                className="w-10 h-10 cursor-pointer"*/}
                            {/*                onClick={() => handleImageClick(image.content)}*/}
                            {/*            />*/}
                            {/*        ))}*/}
                            {/*    </div>*/}
                            {/*</td>*/}

                            {/*<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">*/}
                            {/*    {excursion?.transport?.organization?.name},*/}
                            {/*    ${(excursion.transport?.finance?.price || 0).toFixed(2)},*/}
                            {/*    Buses: {excursion.transport?.buses?.length || 0}*/}
                            {/*</td>*/}
                            {/*<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">*/}
                            {/*    {excursion.foods.map(food => `${food.type}: ${food.menu}`).join(', ')}*/}
                            {/*</td>*/}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        size="sm"
                        color="gray"
                        variant="outlined"
                        className="rounded-full"
                        ripple
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        <ArrowLeftIcon className="h-5 w-5"/>
                    </Button>
                    {Array.from({length: totalPages}, (_, index) => (
                        <Button
                            key={index}
                            size="sm"
                            color={currentPage === index + 1 ? "blue" : "gray"}
                            variant="outlined"
                            className="rounded-full"
                            ripple
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Button>
                    ))}
                    <Button
                        size="sm"
                        variant="outlined"
                        color="gray"
                        className="rounded-full"
                        ripple
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        <ArrowRightIcon className="h-5 w-5"/>
                    </Button>
                </div>
                <div className="flex items-center gap-3">
                    <Typography color="gray" className="text-sm whitespace-nowrap">
                        Items per page:
                    </Typography>
                    <Input
                        type="number"
                        value={itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(e.target.value || '1')}

                        color="light-blue"
                        className="text-center"
                    />
                </div>
            </div>

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
