import React, {useCallback, useEffect, useMemo, useState} from "react";
import {IClient} from "@/models/clientModel";
import {
    Button,
    Card,
    CardBody,
    CardHeader, Checkbox,
    Chip,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader, IconButton,
    Menu, MenuHandler, MenuItem, MenuList,
    Typography, Tooltip
} from "@material-tailwind/react";
import {
    AcademicCapIcon,
    ArrowDownIcon,
    ChevronDownIcon,
    PencilIcon,
    TrashIcon,
    UserIcon
} from "@heroicons/react/20/solid";
import ClientForm, {emptyClient} from "./ClientForm";
import PaymentHandler from "./PaymentsHandler";
import {BiDollar, BiPlus, BiSearch, BiSync} from "react-icons/bi";
import {ClientsSearch} from "./ClientsSearch";
import {IBedroom} from "../../../../models/bedroomModel";
import {IConfirmActionExtraParams} from "../../../../hooks/useConfirmActionHook";
import {IWsGroup, WhatsappGroupActionTypes, whatsappSessionKeys} from "../../../../models/WhatsappModels";
import SearchableSelect, {IOption} from "../../../../components/SearchableSelect";
import {IoReload} from "react-icons/io5";
import useWhatsapp from "../../../../hooks/UseWhatsapp";
import {UserRoleTypes, UserTypes} from "../../../../models/interfaces/userModel";
import ProtectedElement from "../../../../components/ProtectedElement";
import {AiFillFileAdd, AiOutlineComment} from "react-icons/ai";
import {CgAssign} from "react-icons/cg";
import {IExcursion} from "@/models/excursionModel";
import {DataTable, IFilterOption, IFilterOptionItem} from "@/components/DataTable";
import {IPayment} from "@/models/PaymentModel";
import {IService, serviceStatusLabels, serviceStatusList, ServiceStatusTypes} from "@/models/serviceModel";
import {getCrudService} from "@/api/services/CRUD.service";
import {CommentHandler} from "@/pages/dashboard/excursion/components/CommentHandler";
import {IComment} from "@/models/commentModel";
import {useAuth} from "@/context/authContext";
import {useAppLoading} from "@/context/appLoadingContext";
import {formatPhoneNumber} from "@/utils/text.utils";

export interface IUpdateClientExtra extends IConfirmActionExtraParams {
    isOptimistic?: boolean;
}

export interface IClientTableProps {
    clients: IClient[];
    onAddClient: (client: Partial<IClient>, extra?: IUpdateClientExtra) => void;
    onUpdateClient: (client: Partial<IClient> | Partial<IClient>[], extra?: IUpdateClientExtra) => void;
    onUpdateService: (service: Partial<IService> | Partial<IService>[], extra?: IUpdateClientExtra) => void;
    updateExcursion: (excursion: Partial<IExcursion>, extra?: IUpdateClientExtra) => any;
    onClientSelected?: (clients: IClient[]) => void;
    excursion: IExcursion;
    bedrooms?: IBedroom[];
}

const getStatusColor = (status: string): 'green' | 'yellow' | 'red' | 'gray' | 'blue' => {
    switch (status) {
        case 'paid':
            return 'green';
        case 'reserved':
            return 'blue';
        case 'interested':
            return 'yellow';
        case 'canceled':
            return 'red';
        default:
            return 'gray'; // Default color if no status matches
    }
};

const paymentService = getCrudService('payments');
const commentService = getCrudService('comments');
const serviceService = getCrudService('services');

export const ClientsExcursionTable = (
    {
        bedrooms,
        clients,
        onAddClient,
        excursion,
        onUpdateClient,
        onUpdateService,
        updateExcursion,
        onClientSelected,
    }: IClientTableProps) => {
    const [selectedClient, setSelectedClient] = useState<IClient | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isClientSearchOpen, setIsClientSearchOpen] = useState(false);
    const [editClientIndex, setEditClientIndex] = useState<number | null>(null);
    const [editedClients, setEditedClients] = useState<{ [key: string]: IClient }>({});
    const [isNewClientOpen, setIsNewClientOpen] = useState<boolean>(false);
    const [assignWsGroupModal, setAssignWsGroupModal] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [comments, setComments] = useState<IComment[]>([]); // Comentarios del servicio
    const {user: authUser} = useAuth();
    const {setAppIsLoading} = useAppLoading()
    console.log('user', authUser);
    // Función para abrir el diálogo y cargar los comentarios del cliente seleccionado
    const openCommentDialog = (client: IClient) => {
        const service = client.currentService;
        if (service) {
            setSelectedClient(client);
            setComments(service.comments || []);
            setDialogOpen(true);
        }
    };

    // Función para cerrar el diálogo
    const closeCommentDialog = () => {
        setDialogOpen(false);
        setSelectedClient(null);
        setComments([]); // Limpiar comentarios al cerrar
    };

    // Función para actualizar los comentarios del cliente seleccionado

    const {
        seedData,
        loading: wsLoading,
        fetchWsSeedData,
    } = useWhatsapp(authUser?.organization?.sessionId);

    const [deletePayment] = paymentService.useDeletePayments();
    const [deleteComment] = commentService.useDeleteComments();
    const [updateService] = serviceService.useUpdateServices();
    const toggleHandleClient = () => {
        setClientToEdit(emptyClient);
        setIsNewClientOpen(!isNewClientOpen);
    };

    const toggleAssignGroupModal = () => {
        setSelectedWsGroup(null);
        setAssignWsGroupModal(!assignWsGroupModal);
    };

    const toggleClientSearch = () => setIsClientSearchOpen(!isClientSearchOpen);

    const getServiceStatus = (client: IClient): ServiceStatusTypes | undefined => {
        const service = client.services.find(s => s.excursionId === excursion._id);
        return service ? service.status : undefined;
    };

    const getService = (client: IClient) => {
        return client.services.find(s => s.excursionId === excursion._id);
    };

    const openModal = (client: IClient) => {
        setSelectedClient(client);
        setModalOpen(true);
    };

    const handleToggleCoordinator = async (client: IClient) => {
        const service = getService(client);
        if (!service) return;

        const updatedService = {...service, isCoordinator: !service.isCoordinator};

        if (updatedService._id) {
            await onUpdateService({_id: updatedService._id, ...updatedService});
        }

    };

    const toggleEdit = (index: number, client: IClient) => {
        if (editClientIndex === index) {
            setEditClientIndex(null); // Save changes here if needed
        } else {
            setEditedClients(prev => ({...prev, [index]: client}));
            setEditClientIndex(index);
        }
    };

    const handleInputChange = useCallback((value: string, index: number, field: keyof IClient) => {
        setEditedClients(prev => ({
            ...prev,
            [index]: {...prev[index], [field]: value}
        }));
    }, [editedClients]);

    const handleAddClient = (client: IClient) => {
        const exist = clients.find(c => c?._id === client?._id);

        if (exist) {
            onUpdateClient(client);
        } else {
            onAddClient(client);
        }

        toggleHandleClient();
    };

    const emptyComment: IComment = {
        text: '',
        medias: [],
        createDate: new Date()
    }


    const excursionService: IService = useMemo(() => ({
        type: 'excursion',
        status: 'interested',
        excursionId: excursion._id,
        payments: [],
        finance: excursion.finance,
        seats: 1,
        comment: [emptyComment]
    }) as IService, [excursion]);

    const selectedService: IService = useMemo(() => {
        return selectedClient?.services.find(s => s.excursionId === excursion._id) || excursionService;
    }, [selectedClient]);

    const handleUpdateComment = async (comment: IComment, isOptimistic?: boolean) => {
        if (!selectedService) {
            return;
        }

        let updatedComments: IComment[] = selectedService.comments || [];

        if (comment._id) {
            updatedComments = updatedComments.map(c => c._id === comment._id ? {...c, ...comment} : c);
        } else {
            updatedComments = [...updatedComments, comment];
        }

        const updatedService = {
            ...selectedService,
            comments: updatedComments,
        };

        if (updatedService._id) {
            await onUpdateService({_id: updatedService._id, ...updatedService});
        }

    };

    const handleDeleteComment = async (comment: IComment) => {
        if (!selectedClient || !selectedService) {
            // TODO: mostrar mensaje de error con un toast
            return;
        }

        const updatedComments = selectedService.comments?.filter(c => c._id !== comment._id) || [];

        await onUpdateService({
            _id: selectedService._id as string,
            comments: updatedComments,
        });
    };

    const handleChangePayment = async (payments: IPayment[]) => {
        setAppIsLoading(true);

        if (!selectedClient) {
            // TODO: toast error message
            return;
        }

        const {data: updatedService} = await updateService({
            _id: selectedService._id as string, ...selectedService,
            payments
        });

        const updatedClient: IClient = {
            ...selectedClient,
            currentService: updatedService,
            services: selectedClient?.services.map(s => s._id === updatedService?._id ? updatedService as IService : s) || []
        };

        setSelectedClient(updatedClient);
        onUpdateClient(updatedClient, {isOptimistic: true, avoidConfirm: true});

        setAppIsLoading(false);


    };


    const handleDeleteClient = (client: IClient) => () => {
        const updatedClients = clients.filter(c => c._id !== client._id);
        const updatedClient = {
            ...client,
            services: client.services.filter(s => s.excursionId !== excursion._id) as IService[]
        }
        onUpdateClient(updatedClient);
        updateExcursion({
            clients: updatedClients
        }, {isOptimistic: true, avoidConfirm: true});
    };


    const handleDeletePayment = (payment: IPayment) => {
        if (selectedClient) {
            payment._id && deletePayment(payment._id);
            const updatedPayments = selectedService.payments.filter(p => p._id !== payment._id);

            const updatedService: IService = {
                ...selectedService,
                payments: updatedPayments,
            };

            const updatedClient: IClient = {
                ...selectedClient,
                currentService: updatedService,
                services: selectedClient?.services.map(s => s.excursionId === excursion._id ? updatedService : s) || []
            };

            setSelectedClient(updatedClient);
            onUpdateClient(updatedClient, {isOptimistic: true, avoidConfirm: true});
        }
    };


    const [clientToEdit, setClientToEdit] = useState<IClient>();
    const handleClientToEdit = (client: IClient) => () => {
        setClientToEdit(client);
        setIsNewClientOpen(true);
    };

    const bedroomsExist = useMemo(() => !!bedrooms?.length, [bedrooms]);

    const columns = useMemo(() => {
        const columnsData = [
            {key: 'firstName', label: 'Nombre'},
            {key: 'phone', label: 'Teléfono'},
            {key: 'status', label: 'Estado'},
        ]
        if (bedroomsExist) {
            columnsData.push({key: 'bedroom', label: 'Habitación'})
        }
        columnsData.push({key: 'actions', label: ''});

        return columnsData;
    }, [bedrooms, clients, excursion]);

    const clientStatusOptions = useMemo(() => clients.map(c => c.services.find(s => s.excursionId === excursion._id)?.status).filter((v, i, a) => a.indexOf(v) === i).map(status => ({
        label: status ? serviceStatusLabels[status] : status,
        value: status
    })) as IFilterOptionItem[], [clients, excursion]);

    const bedroomsOptions = useMemo(() => (bedrooms?.map(b => ({
        label: `${b.name} | ${b.zone}`,
        value: b._id as string
    })) || []), [bedrooms]);

    const filterOptions: IFilterOption<IClient>[] = useMemo(() => {
        const filters: IFilterOption<IClient>[] = [
            {
                key: 'firstName',
                label: 'Nombre',
                type: 'text'
            },
            {
                key: 'phone',
                label: 'Teléfono',
                type: 'text'
            },
            {
                key: 'services',
                label: 'Estado',
                type: 'select',
                options: clientStatusOptions,
            },
            {
                key: 'services',
                label: 'Habitación',
                type: 'select',
                options: bedroomsOptions
            },
        ]
        return filters;
    }, [clients, bedrooms, excursion]);


    const onChangeBedroom = (client: IClient) => (value?: string, currentSelect?: any) => {
        const bedroom = bedrooms?.find(b => b._id === value);
        const service = client.currentService;
        if (!service) {
            // TODO: toast service not found
            return;
        }

        const updatedService = {...service, bedroom: bedroom || null};

        const updatedClient: IClient = {
            ...client,
            currentService: updatedService,
            services: client.services.map(s => s.excursionId === excursion._id ? updatedService : s) as IService[]
        };

        onUpdateClient(updatedClient, {isOptimistic: true, avoidConfirm: true});

        updatedService?._id && updateService({_id: updatedService._id, ...updatedService});
    };

    const handleWsGroupAction = (action: WhatsappGroupActionTypes) => () => {
        const excursionData = {
            title: excursion.title,
            description: excursion.description,
            clients: clients,
            finance: excursion.finance,
            whatsappGroupID: action === 'assign-ws-group' ? selectedWsGroup?.id : excursion.whatsappGroupID,
            queryData: {
                type: action,
            }
        };

        updateExcursion(excursionData);
    };

    const [selectedWsGroup, setSelectedWsGroup] = useState<IWsGroup | null>(null);
    const loadWsGroups = async () => fetchWsSeedData(undefined, 'groups');

    const handleWsGroupSelection = async (selectedList: IWsGroup[], selectedItem: IWsGroup) => {
        setSelectedWsGroup(selectedItem);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const totalPages = useMemo(() => Math.ceil(clients.length / itemsPerPage), [clients.length, itemsPerPage]);

    const paginatedClients = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return clients.slice(startIndex, startIndex + itemsPerPage);
    }, [clients, currentPage, itemsPerPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Math.abs(Number(value)) || 1);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    const [selectedClients, setSelectedClients] = useState<IClient[]>([]);

    const onSelectClient = (sClients: IClient[]) => {
        setSelectedClients(sClients);
        onClientSelected && onClientSelected(sClients);
    }

    const onChangeClientsBedrooms = (options: IOption[]) => {
        const value = options[0].value;
        const bedroom = bedrooms?.find(b => b._id === value);
        if (!bedroom || selectedClients.length === 0) {
            return;
        }

        const mapClients = selectedClients.map(client => {
            const service = client.currentService;
            const updatedService = {...service, bedroom};
            if (!service) {
                // TODO: toast service not found
                return null;
            }

            const updatedClient: IClient = {
                ...client,
                currentService: updatedService,
                services: client.services.map(s => s.excursionId === excursion._id ? updatedService : s) as IService[]
            };

            return updatedClient;
        }).filter(item => !!item) as IClient[];


        onUpdateClient(mapClients);
        setSelectedClients([])

    }

    const onChangeClientsServiceStatus = (options: IOption<ServiceStatusTypes>[]) => {
        const status = options[0].value;
        if (!status || selectedClients.length === 0) {
            return;
        }

        const mapClients: IClient[] = selectedClients.map(client => {
            const service = client.currentService;
            if (!service) {
                return;
            }

            const updatedService = {...service, status};

            const updatedClient: IClient = {
                ...client,
                services: client.services.map(s => s.excursionId === service.excursionId ? updatedService : s) as IService[]
            };

            return updatedClient;
        }).filter(item => !!item) as IClient[];

        onUpdateClient(mapClients);
    }

    const onChangeServiceStatus = (client: IClient, option: IOption<ServiceStatusTypes>) => {
        const status = option.value;
        const service = client.currentService;
        if (!service) {
            // TODO: toast service not found
            return;
        }
        const updatedService = {...service, status};

        const updatedClient: IClient = {
            ...client,
            currentService: updatedService,
            services: client.services.map(s => s.excursionId === excursion._id ? updatedService : s) as IService[]
        };

        onUpdateClient(updatedClient, {isOptimistic: true, avoidConfirm: true});
        updatedService?._id && updateService({_id: updatedService._id, ...updatedService});
    }


    useEffect(() => {
        if (selectedClient) {
            const clientData = clients.find(c => c._id === selectedClient._id);
            if (JSON.stringify(clientData) !== JSON.stringify(selectedClient)) {
                setSelectedClient(clientData || selectedClient);
            }
        }
    }, [clients]);

    const enableWhatsappOptions = useMemo(() => {
        return excursion.owner._id === authUser?.organization?._id
    }, [excursion.owner, authUser?.organization]);


    const renderRow = (client: IClient, index: number, selected: boolean, onSelect: (checked: boolean) => void) => {
        const noService = "No Service";
        const serviceStatus = client.currentService?.status;
        const statusColor = getStatusColor(serviceStatus || noService);
        const serviceC = client.currentService;
        const bedroomOptions: IOption[] = (bedrooms?.map((b) => ({
            label: `${b.name} | ${b.zone}`,
            value: b._id
        })) || []) as IOption[];
        const totalAmount = serviceC?.payments?.reduce((a, b) => a + b.amount, 0) || 0;
        const clientBedroom = bedroomOptions.find(b => b.value === serviceC?.bedroom?._id);

        return (
            <tr key={`${client._id}-${index}`}>
                <td>
                    <Checkbox
                        color="blue"
                        crossOrigin
                        checked={selected}
                        onChange={(e) => onSelect(e.target.checked)}
                    />
                </td>
                <td>
                    <Typography className="p-3">{client.firstName} {client.lastName}</Typography>
                </td>
                <td>
                    <a href={`https://wa.me/${client.phone}`} target="_blank">
                        <Button variant="text">{formatPhoneNumber(client.phone)}</Button>
                    </a>
                </td>
                <td>
                    <div className="flex flex-col items-center">
                        <Menu placement="bottom">
                            <MenuHandler>
                                <Chip color={statusColor}
                                      className="cursor-pointer"
                                      value={
                                          <div className="flex items-center gap-2 justify-between">
                                              {serviceStatus ? serviceStatusLabels[serviceStatus] : noService}
                                              <ChevronDownIcon width={18}/>
                                          </div>
                                      }/>
                            </MenuHandler>
                            <MenuList>
                                {serviceStatusList.map(status => (
                                    <MenuItem key={`s-status-${status.value}`}
                                              onClick={() => onChangeServiceStatus(client, status)}>
                                        <Chip color={getStatusColor(status.value)} value={status.label}/>
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                        <div className='flex justify-center items-center'>
                            <Typography variant="paragraph">RD${totalAmount.toLocaleString()}</Typography>
                            <IconButton variant="text" color="blue" size="sm" onClick={() => openCommentDialog(client)}>
                                <AiOutlineComment className="h-5 w-5"/>
                            </IconButton>
                        </div>
                    </div>
                </td>
                {bedroomsExist && (
                    <td>
                        <div className="p-4">
                            <SearchableSelect
                                selectedValues={clientBedroom ? [clientBedroom] : undefined}
                                label="Habitación"
                                options={bedroomOptions}
                                onSelect={(selectedValues: IOption[], currentSelect?: IOption) => onChangeBedroom(client)(selectedValues[0]?.value, currentSelect)}
                                displayProperty="label"
                                className="min-w-[200px]"
                            />
                        </div>
                    </td>
                )}
                <td>
                    <div className="flex items-center px-2 justify-end gap-1">
                        <Tooltip
                            className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
                            content={
                                <div className="">
                                    <Typography
                                        color="blue-gray"
                                        className="font-extralight opacity-80"
                                    >
                                        {client.currentService?.isCoordinator ? 'Este cliente es coordinador' : 'Asignar como coordinador'}
                                    </Typography>
                                </div>
                            }
                        >
                            <IconButton
                                variant="text"
                                color={client.currentService?.isCoordinator ? "yellow" : "blue"}
                                size="sm"
                                onClick={() => handleToggleCoordinator(client)}
                            >
                                <AcademicCapIcon className="h-5 w-5"/>
                            </IconButton>
                        </Tooltip>
                        <IconButton variant="text" color="blue" size="sm" onClick={() => openModal(client)}>
                            <BiDollar className="h-5 w-5"/>
                        </IconButton>
                        <IconButton variant="text" color="blue" size="sm" onClick={handleClientToEdit(client)}>
                            <PencilIcon className="h-5 w-5"/>
                        </IconButton>
                        <IconButton variant="text" color="red" size="sm" onClick={handleDeleteClient(client)}>
                            <TrashIcon className="h-5 w-5"/>
                        </IconButton>
                    </div>
                </td>
            </tr>
        );
    };


    return (<>
            <Card className="mt-10">
                <CardHeader variant="gradient" color="blue" className="p-3">
                    <div className="flex justify-between items-center gap-3">
                        <Typography variant="h4" color="white">
                            Clientes
                        </Typography>
                        <div className="flex items-center">
                            <ProtectedElement roles={[UserRoleTypes.ADMIN]} userTypes={[UserTypes.AGENCY]}>
                                <Button variant="text" color="white" className="flex items-center gap-3"
                                        onClick={toggleClientSearch}>
                                    <BiSearch size="18px"/>
                                    <Typography className="capitalize font-bold">Buscar otros clientes</Typography>
                                </Button>
                            </ProtectedElement>
                            <Button className="flex items-center gap-3" variant="text" color="white"
                                    onClick={toggleHandleClient}>
                                <BiPlus size="18px"/>
                                <Typography className="capitalize font-bold">Agregar Clientes</Typography>
                            </Button>
                        </div>
                    </div>
                    <ProtectedElement
                        roles={[UserRoleTypes.ADMIN]}
                        userTypes={[UserTypes.AGENCY]}
                        condition={enableWhatsappOptions}
                    >
                        <div className="flex items-center px-4 justify-between bg-green-400 rounded-md shadow-lg">
                            <p>Opciones de Whatsapp: {excursion.whatsappGroupID?.slice(0, 5)}</p>
                            <div className="flex items-center">
                                <Button variant="text" color="white" className="flex items-center gap-3"
                                        onClick={toggleAssignGroupModal}>
                                    <CgAssign size="18px"/>
                                    <Typography className="capitalize font-bold">Asignar Grupo de WS</Typography>
                                </Button>
                                {!excursion.whatsappGroupID && (
                                    <Button variant="text" color="white" className="flex items-center gap-3"
                                            onClick={handleWsGroupAction('create-ws-group')}>
                                        <AiFillFileAdd size="18px"/>
                                        <Typography className="capitalize font-bold">Crear Grupo de WS</Typography>
                                    </Button>
                                )}
                                {excursion.whatsappGroupID && (
                                    <Button variant="text" color="white" className="flex items-center gap-3"
                                            onClick={handleWsGroupAction('sync-ws-group')}>
                                        <BiSync size="18px"/>
                                        <Typography className="capitalize font-bold">Sync Grupo de WS</Typography>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </ProtectedElement>
                </CardHeader>
                <CardBody className="overflow-x-auto">
                    {!!selectedClients.length &&
                        <div className="flex items-center gap-3 pb-5 ">
                            <SearchableSelect<IOption<ServiceStatusTypes>>
                                label="Cambiar Estado"
                                options={serviceStatusList}
                                onSelect={onChangeClientsServiceStatus}
                                className="min-w-[200px]"
                            />
                            <SearchableSelect
                                label="Cambiar Habitacion"
                                options={bedroomsOptions}
                                onSelect={onChangeClientsBedrooms}
                                className="min-w-[200px]"
                            />
                        </div>}
                    <DataTable<IClient>
                        enableSelection
                        onSelect={onSelectClient}
                        data={clients}
                        columns={columns}
                        filterOptions={filterOptions}
                        renderRow={renderRow}
                    />
                </CardBody>
                <ClientForm
                    initialClient={clientToEdit}
                    dialog={{
                        open: isNewClientOpen,
                        handler: toggleHandleClient,
                    }}
                    enableService
                    serviceData={clientToEdit?.currentService || excursionService}
                    onSubmit={handleAddClient}
                />
                <Dialog open={isClientSearchOpen} handler={toggleClientSearch}>
                    <DialogHeader>
                        <Typography variant="h4">Buscar otros clientes</Typography>
                    </DialogHeader>
                    <DialogBody>
                        <ClientsSearch/>
                    </DialogBody>
                    <DialogFooter>
                        <Button variant="text" size="lg" color="red" onClick={toggleClientSearch}>Cerrar</Button>
                        <Button variant="text" size="lg" color="blue" onClick={toggleClientSearch}>Agregar</Button>
                    </DialogFooter>
                </Dialog>
                {selectedClient && (
                    <Dialog open={isModalOpen} handler={() => setModalOpen(false)} dismiss={{enabled: false}}>
                        <DialogHeader>
                            <Typography variant="h4">Pagos de {selectedClient?.firstName || ''}</Typography>
                        </DialogHeader>
                        <DialogBody className="overflow-y-scroll max-h-[80dvh]">
                            {selectedService ? (
                                <PaymentHandler
                                    client={selectedClient}
                                    excursion={excursion}
                                    enableAddPayment={selectedService.status !== 'paid'}
                                    payments={selectedService.payments}
                                    onDeletePayment={handleDeletePayment}
                                    onChangePayment={handleChangePayment}
                                />
                            ) : (
                                <Typography>No Service</Typography>
                            )}
                        </DialogBody>
                        <DialogFooter>
                            <Button variant="text" size="lg" color="red"
                                    onClick={() => setModalOpen(false)}>Cerrar</Button>
                        </DialogFooter>
                    </Dialog>
                )}
                <Dialog open={assignWsGroupModal} handler={toggleAssignGroupModal}>
                    <DialogHeader>Asignar grupo</DialogHeader>
                    <DialogBody>
                        <div className="flex items-center">
                            <SearchableSelect<IWsGroup>
                                options={seedData.groups.filter(item => !item.subject?.toLowerCase()?.includes('sin filtro'))}
                                displayProperty="title"
                                label="Selecciona un grupo"
                                disabled={wsLoading}
                                onSelect={handleWsGroupSelection}
                            />
                            <Button loading={wsLoading} disabled={wsLoading} onClick={loadWsGroups} color="blue"
                                    variant="text">
                                <IoReload/>
                            </Button>
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <Button variant="text" size="lg" color="red" onClick={toggleAssignGroupModal}>Cerrar</Button>
                        <Button
                            variant="text"
                            size="lg"
                            color="blue"
                            onClick={handleWsGroupAction('assign-ws-group')}
                            disabled={!selectedWsGroup}
                        >
                            Asignar
                        </Button>
                    </DialogFooter>
                </Dialog>
            </Card>
            <CommentHandler
                dialog={{
                    open: dialogOpen,
                    handler: closeCommentDialog
                }}
                initialComments={selectedService.comments}
                onUpdateComments={handleUpdateComment}
                onDeleteComments={handleDeleteComment}
            />
        </>
    );
};
