import React, {useCallback, useMemo, useState} from "react";
import {IClient} from "../../../../models/clientModel";
import {
    Avatar,
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Dialog, DialogBody, DialogFooter,
    DialogHeader,
    Input, Select,
    Option,
    Typography
} from "@material-tailwind/react";
import {PencilIcon, TrashIcon, UserIcon} from "@heroicons/react/20/solid";
import ClientForm from "./ClientForm";
import {IService} from "../../../../models/serviceModel";
import {IExcursion} from "../../../../models/excursionModel";
import PaymentHandler from "./PaymentsHandler";
import {IPayment} from "../../../../models/PaymentModel";
import {getCrudService} from "../../../../api/services/CRUD.service";
import {BiCheck, BiDollar, BiPlus, BiSearch} from "react-icons/bi";
import {ClientsSearch} from "./ClientsSearch";
import {IBedroom} from "../../../../models/bedroomModel";
import {IConfirmActionExtraParams} from "../../../../hooks/useConfirmActionHook";
import {IWsGroup, IWsLabel, WhatsappGroupActionTypes, whatsappSessionKeys} from "../../../../models/WhatsappModels";
import SearchableSelect from "../../../../components/SearchableSelect";
import {IoReload} from "react-icons/io5";
import useWhatsapp from "../../../../hooks/UseWhatsapp";

export interface IUpdateClientExtra extends IConfirmActionExtraParams {
    isOptimistic?: boolean;
}

export interface IClientTableProps {
    clients: IClient[];
    onAddClient: (client: IClient) => void;
    onUpdateClient: (client: Partial<IClient>, extra?: IUpdateClientExtra) => void;
    updateExcursion: (excursion: Partial<IExcursion>, extra?: IUpdateClientExtra) => any;
    excursion: IExcursion;
    bedrooms?: IBedroom[]
}

const getStatusColor = (status: string): 'green' | 'yellow' | 'red' | 'gray' => {
    switch (status) {
        case 'Active':
            return 'green';
        case 'Pending':
            return 'yellow';
        case 'Cancelled':
            return 'red';
        default:
            return 'gray';  // Default color if no status matches
    }
};


const paymentsService = getCrudService('payments');
const servicesService = getCrudService('services');
export const ClientsExcursionTable = (
    {
        bedrooms,
        clients,
        onAddClient,
        excursion,
        onUpdateClient,
        updateExcursion
    }: IClientTableProps) => {
    const [selectedClient, setSelectedClient] = useState<IClient | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isClientSearchOpen, setIsClientSearchOpen] = useState(false);
    const [editClientIndex, setEditClientIndex] = useState<number | null>(null);
    const [editedClients, setEditedClients] = useState<{ [key: string]: IClient }>({});
    const [isNewClientOpen, setIsNewClientOpen] = useState<boolean>(false);
    const [assignWsGroupModal, setAssignWsGroupModal] = useState<boolean>(false);
    const [deletePayment, {isLoading: isDeletingPayment}] = paymentsService.useDeletePayments();
    const [updateService, {isLoading: isUpdatingService}] = servicesService.useUpdateServices();
    const {
        seedData,
        loading: wsLoading,
        fetchWsSeedData,
    } = useWhatsapp(whatsappSessionKeys.betueltravel);

    const toggleHandleClient = () => {
        setIsNewClientOpen(!isNewClientOpen)
        setClientToEdit(undefined);
    };

    const toggleAssignGroupModal = () => {
        setSelectedWsGroup(null)
        setAssignWsGroupModal(!assignWsGroupModal);
    }

    const toggleClientSearch = () => setIsClientSearchOpen(!isClientSearchOpen);
    const getServiceStatus = (client: IClient) => {
        const service = client.services.find(s => s.excursionId === excursion._id);
        return service ? service.status : 'No Service';
    };

    const getService = (client: IClient) => {
        return client.services.find(s => s.excursionId === excursion._id);
    }
    const openModal = (client: IClient) => {
        setSelectedClient(client);
        setModalOpen(true);
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
    }

    const excursionService: IService = useMemo(() => ({
        type: 'excursion',
        status: 'interested',
        excursionId: excursion._id,
        payments: [],
        finance: excursion.finance,
    }) as IService, [excursion]);


    const selectedService: IService = useMemo(() => {
        return selectedClient?.services.find(s => s.excursionId === excursion._id) || excursionService;

    }, [selectedClient]);

    const handleUpdatePayment = async (payments: IPayment[]) => {
        if (!selectedClient || !selectedService) {
            // TODO: toast error message
            return;
        }

        const updatedClient = {
            ...selectedClient,
            services: selectedClient.services.map(s =>
                s._id === selectedService._id ? {...s, payments}
                    : s
            ) as IService[]
        };

        onUpdateClient(updatedClient);
    }

    const handleChangePayment = async (payments: IPayment[]) => {
        if (!selectedClient) {
            // TODO: toast error message
            return
        }

        const updatedService = {...selectedService, payments};

        const updatedClient: IClient = {
            ...selectedClient,
            services: selectedClient?.services.map(s => s.excursionId === excursion._id ? updatedService : s) || []
        };

        setSelectedClient(updatedClient);
    }

    const handleDeleteClient = (client: IClient) => () => {
        const updatedClients = clients.filter(c => c._id !== client._id);
        updateExcursion({
            clients: updatedClients
        });
    }


    const handleDeletePayment = (payment: IPayment) => {
        if (selectedClient) {
            payment._id && deletePayment(payment._id);

            const updatedPayments = selectedService.payments.filter(p => p._id !== payment._id);
            // handleUpdatePayment(updatedPayments);

            const updatedService = {
                ...selectedService,
                payments: updatedPayments,
            };

            const updatedClient: IClient = {
                ...selectedClient,
                services: selectedClient?.services.map(s => s.excursionId === excursion._id ? updatedService : s) || []
            };

            setSelectedClient(updatedClient);
        }


    }

    const [clientToEdit, setClientToEdit] = useState<IClient>();
    const handleClientToEdit = (client: IClient) => () => {
        setClientToEdit(client);
        setIsNewClientOpen(true);
    }

    const bedroomsExist = useMemo(() => !!bedrooms?.length, [bedrooms]);

    const columns = useMemo(() => {
        const c = ["Nombre", "Email", "Teléfono", "Estado", "Habitación", ""]
        return bedroomsExist ? c : c.filter(el => el !== 'Habitación')
    }, [bedroomsExist]);


    const onChangeBedroom = (client: IClient) => (value?: string) => {

        const bedroom = bedrooms?.find(b => b._id === value);
        const service = getService(client);
        const updatedService = {...service, bedroom};
        if (!service) {
            // TODO: toast service not found
            return;
        }

        const updatedClient: IClient = {
            ...client,
            services: client.services.map(s => s.excursionId === excursion._id ? updatedService : s) as IService[]
        };

        onUpdateClient(updatedClient, {isOptimistic: true, avoidConfirm: true});

        updatedService?._id && updateService({_id: updatedService._id, ...updatedService});
    }

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
    }

    const [selectedWsGroup, setSelectedWsGroup] = useState<IWsGroup | null>(null);
    const loadWsGroups = async () => fetchWsSeedData(whatsappSessionKeys.betueltravel, 'groups');

    const handleWsGroupSelection = async (selectedList: IWsGroup[], selectedItem: IWsGroup) => {
        console.log('selectedItem', selectedItem, selectedList);
        setSelectedWsGroup(selectedItem);
    }


    return (
        <Card>
            <CardHeader variant="gradient" color="blue" className="p-3">
                <div className="flex justify-between items-center gap-3">
                    <Typography variant="h4" color="white">
                        Client Table
                    </Typography>

                    <div className="flex items-center">
                        <Button variant="text" color="white" className="flex items-center gap-3"
                                onClick={toggleClientSearch}>
                            <BiSearch size="18px"/>
                            <Typography className="capitalize font-bold">Buscar Clientes</Typography>
                        </Button>
                        <Button className="flex items-center gap-3" variant="text" color="white"
                                onClick={toggleHandleClient}>
                            <BiPlus size="18px"/>
                            <Typography className="capitalize font-bold">Agregar Clientes</Typography>
                        </Button>
                    </div>

                </div>
                <div className="flex items-center justify-end bg-red-400">
                    <p>{excursion.whatsappGroupID}</p>
                    <Button variant="text" color="white" className="flex items-center gap-3"
                            onClick={toggleAssignGroupModal}
                    >
                        <BiCheck size="18px"/>
                        <Typography className="capitalize font-bold">Asignar Grupo de WS</Typography>
                    </Button>
                    <Button variant="text" color="white" className="flex items-center gap-3"
                            onClick={handleWsGroupAction('create-ws-group')}>
                        <BiCheck size="18px"/>
                        <Typography className="capitalize font-bold">Crear Grupo de WS</Typography>
                    </Button>
                    <Button variant="text" color="white" className="flex items-center gap-3"
                            onClick={handleWsGroupAction('sync-ws-group')}>
                        <BiCheck size="18px"/>
                        <Typography className="capitalize font-bold">Sync Grupo de WS</Typography>
                    </Button>
                </div>
            </CardHeader>
            <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
                <table className="w-full min-w-[640px] table-auto">
                    <thead className="bg-gray-50">
                    <tr>
                        {columns.map((el) => (
                            <th
                                key={el}
                                className="border-b border-blue-gray-50 py-3 px-5 text-left"
                            >
                                <Typography
                                    variant="small"
                                    className="text-[11px] font-bold uppercase text-blue-gray-400"
                                >
                                    {el}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">

                    {clients.map((client, index) => {
                        const serviceStatus = getServiceStatus(client);
                        const statusColor = getStatusColor(serviceStatus);
                        const service = getService(client);
                        return (
                            <tr key={`${client._id}-${index}`}>
                                <td>
                                    {editClientIndex === index ? (
                                        <Input type="text" value={editedClients[index]?.firstName || client.firstName}
                                               onChange={(e) => handleInputChange(e.target.value, index, 'firstName')}/>
                                    ) : <Typography className="p-3">{client.firstName} {client.lastName}</Typography>}
                                </td>
                                <td>
                                    {editClientIndex === index ? (
                                        <Input type="email" value={editedClients[index]?.email || client.email}
                                               onChange={(e) => handleInputChange(e.target.value, index, 'email')}/>
                                    ) : (<a href={`mailto:${client.email}`} target="_blank">
                                        <Button variant="text">{client.email}</Button>
                                    </a>)}
                                </td>
                                <td>
                                    {editClientIndex === index ? (
                                        <Input type="text" value={editedClients[index]?.phone || client.phone}
                                               onChange={(e) => handleInputChange(e.target.value, index, 'phone')}/>
                                    ) : (<a href={`https://wa.me/${client.phone}`} target="_blank">
                                        <Button variant="text">{client.phone}</Button>
                                    </a>)}
                                </td>
                                <td><Chip color={statusColor}
                                          value={serviceStatus}/></td>
                                {bedroomsExist && <td>
                                    <div className="p-4">
                                        <Select
                                            value={service?.bedroom?._id}
                                            onChange={onChangeBedroom(client)}
                                        >
                                            {bedrooms?.map(b => (
                                                <Option key={b._id} value={b._id}>{b.name} | {b.zone}</Option>
                                            ))}
                                        </Select>
                                    </div>
                                </td>}
                                <td>
                                    <div className="flex items-center px-2 justify-end">
                                        <Button variant="text" color="blue" size="sm"
                                                onClick={() => openModal(client)}><BiDollar
                                            className="h-5 w-5"/></Button>
                                        <Button variant="text" color="blue" size="sm"
                                                onClick={handleClientToEdit(client)}>
                                            <PencilIcon className=" h-5 w-5"/></Button>
                                        <Button variant="text" color="red" size="sm"
                                                onClick={handleDeleteClient(client)}>
                                            <TrashIcon className=" h-5 w-5"/>
                                        </Button>
                                        <Button variant="text" color="light-blue" size="sm"><UserIcon
                                            className=" h-5 w-5"/>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </CardBody>

            <ClientForm
                initialClient={clientToEdit}
                dialog={{
                    open: isNewClientOpen,
                    handler: toggleHandleClient,
                }} enableService
                serviceData={excursionService}
                onSubmit={handleAddClient}
            />

            <Dialog open={isClientSearchOpen} handler={toggleClientSearch}>
                <DialogHeader>
                    <Typography variant="h4">Buscar Clientes</Typography>
                </DialogHeader>
                <DialogBody>
                    <ClientsSearch/>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" size="lg" color="red" onClick={toggleClientSearch}>Cerrar</Button>
                    <Button variant="text" size="lg" color="blue" onClick={toggleClientSearch}>Agregar</Button>
                </DialogFooter>
            </Dialog>
            {
                selectedClient && (
                    <Dialog open={isModalOpen} handler={() => setModalOpen(false)}>
                        <DialogHeader>
                            <Typography variant="h4">Pagos de {selectedClient?.firstName || ''}</Typography>
                        </DialogHeader>
                        <DialogBody className="overflow-y-scroll max-h-[80dvh]">
                            {selectedService ?
                                <PaymentHandler payments={selectedService.payments}
                                                onDeletePayment={handleDeletePayment}
                                                onUpdatePayment={handleUpdatePayment}
                                                onChangePayment={handleChangePayment}/>
                                :
                                <Typography>No Service</Typography>
                            }
                        </DialogBody>
                        <DialogFooter>
                            <Button variant="text" size="lg" color="red" onClick={() => setModalOpen(false)}>Cerrar</Button>
                        </DialogFooter>
                    </Dialog>
                )
            }

            <Dialog open={assignWsGroupModal} handler={toggleAssignGroupModal}>
                <DialogHeader>
                    Asignar grupo
                </DialogHeader>
                <DialogBody>
                    <div className="flex items-center">
                        <SearchableSelect<IWsGroup>
                            options={seedData.groups.filter(item => !item.subject?.toLowerCase()?.includes('sin filtro'))}
                            displayProperty="subject"
                            label="Selecciona un grupo"
                            disabled={wsLoading}
                            onSelect={handleWsGroupSelection}
                        />
                        <Button loading={wsLoading}
                                disabled={wsLoading}
                                onClick={loadWsGroups}
                                color="blue" variant="text">
                            <IoReload/>
                        </Button>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" size="lg" color="red" onClick={toggleAssignGroupModal}>Cerrar</Button>
                    <Button variant="text" size="lg" color="blue" onClick={handleWsGroupAction('assign-ws-group')}
                            disabled={!selectedWsGroup}>Asignar</Button>
                </DialogFooter>
            </Dialog>
        </Card>
    )
        ;
};

