import React, {useEffect, useMemo, useState} from 'react';
import {Button, Menu, MenuHandler, MenuItem, MenuList, Tooltip, Typography} from "@material-tailwind/react";
import {Link, useParams} from 'react-router-dom';
import {StarIcon} from "@heroicons/react/24/solid";
import {Swiper, SwiperSlide} from 'swiper/react';
import {mockExcursion} from "@/data/excursions-mock-data";
import {ExcursionDetailActions, ExcursionDetailActionsDataTypes, IExcursion} from "@/models/excursionModel";
import {EffectCoverflow, Pagination} from "swiper/modules";
import {ClientsExcursionTable, IUpdateClientExtra} from "../components/ClientsExcursionTable";
import {FinanceDetails} from "../components/FinanceDetail";
import {OrganizationCard} from "../components/OrganizationCard";
import {useRenderMedia} from "@/hooks/useRenderMedia";
import AudioPlayer from "../components/AudioCard";
import {getCrudService} from "@/api/services/CRUD.service";
import {IClient} from "@/models/clientModel";
import {useConfirmAction} from "@/hooks/useConfirmActionHook";
import {EXCURSION_CONSTANTS} from "@/constants/excursion.constant";
import {CLIENTS_CONSTANTS} from "@/constants/clients.constant";
import {IBedroom} from "@/models/bedroomModel";
import {BedroomDetails} from "../components/BedroomsDetails";
import Messaging from "../../../../components/WhatsappMessageHandler";
import {UserRoleTypes, UserTypes} from "@/models/interfaces/userModel";
import ProtectedElement from "../../../../components/ProtectedElement";
import {IoReload, IoSettings} from "react-icons/io5";
import {FaUser, FaUsers, FaWhatsapp} from "react-icons/fa";
import {useAppLoading} from "@/context/appLoadingContext";
import ExcursionDetailsSkeleton from "../../../../components/ExcursionDetailsSkeleton";
import {IExpense} from "@/models/ExpensesModel";
import {ExpensesHandler} from "@/pages/dashboard/excursion/components/ExpensesHandler";
import {SERVICE_CONSTANTS} from "@/constants/service.constant";
import {IService} from "@/models/serviceModel";
import {EXPENSES_CONSTANTS} from "@/constants/expenses.constant";
import {CheckpointDetails} from "@/pages/dashboard/excursion/components/CheckpointDetails";
import {ExcursionConfigurationHandler} from "@/components/ExcursionConfigurationHandler";
import WhatsappExcursionMessageHandler from "@/components/WhatsappExcursionMessageHandler";
import {WhatsappRecipientTypes} from "@/models/WhatsappModels";
import {TbDotsVertical} from "react-icons/tb";

export type UpdateExcursionHandlerType = (excursion: Partial<IExcursion>, extra?: IUpdateClientExtra) => any;

const excursionService = getCrudService('excursions');
const clientService = getCrudService('travelClients');
const serviceService = getCrudService('services');
const expenseService = getCrudService('travelExpenses');
export const ExcursionDetails: React.FC = () => {
    const [excursion, setExcursion] = useState<IExcursion>(mockExcursion);
    const [selectedClients, setSelectedClients] = useState<IClient[]>([]);
    const {renderMedia} = useRenderMedia();
    const [updateService, {isLoading: isUpdatingService}] = serviceService.useUpdateServices();
    const [updateClient, {isLoading: isUpdatingClient}] = clientService.useUpdateTravelClients();
    const [deleteExpense, {isLoading: isDropingClient}] = expenseService.useDeleteTravelExpenses();
    const [addClient, {isLoading: isCreatingClient}] = clientService.useAddTravelClients();
    const params = useParams();
    const [updateExcursion, {isLoading: isUpdating, data: updatedExcursion}] = excursionService.useUpdateExcursions();
    const [wsMessagingIsOpen, setWsMessagingIsOpen] = useState(false);
    const [settingsIsOpen, setSettingsIsOpen] = useState(false);
    const ownerOrganization = useMemo(() => excursion.owner, [excursion.owner]);
    const toggleWsMessaging = () => setWsMessagingIsOpen(!wsMessagingIsOpen);
    const toggleSettings = () => setSettingsIsOpen(!settingsIsOpen);
    const {setAppIsLoading} = useAppLoading();

    const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
    const toggleExpenseDialog = () => setIsExpenseDialogOpen(!isExpenseDialogOpen);
    const [wsRecipientType, setWsRecipientType] = useState<WhatsappRecipientTypes>('user');

    const {
        data: excursionData,
        isLoading: isLoadingExcursion,
        isFetching: isFetchingExcursion,
        refetch: refetchExcursion
    } = excursionService.useFetchByIdExcursions(params.excursionId as string, {skip: !params.excursionId});

    useEffect(() => {
        setAppIsLoading(isLoadingExcursion || isFetchingExcursion);
    }, [isLoadingExcursion, isFetchingExcursion]);


    const onConfirmAction = (type?: ExcursionDetailActions, data?: ExcursionDetailActionsDataTypes, ...extra: any) => {
        switch (type) {
            case 'update':
                onUpdateExcursion(data as IExcursion, ...extra);
                break;
            case 'add-client':
                onAddClient(data as IClient);
                break;
            case 'update-client':
                onUpdateClient(data as IClient, ...extra);
                break;
            case 'update-service':
                onUpdateService(data as IService, ...extra);
                break;
            case 'remove-client':
                onUpdateExcursion(data as IExcursion);
                break;
            case 'update-expense':
                onExpenseUpdate(data as IExpense, ...extra);
                break;
            case 'delete-expense':
                onExpenseDelete(data as IExpense);
                break;
        }
    }

    const onDeniedAction = (type?: ExcursionDetailActions, data?: ExcursionDetailActionsDataTypes) => {

    }

    const {
        handleSetActionToConfirm,
        resetActionToConfirm,
        ConfirmDialog
    } = useConfirmAction<ExcursionDetailActions, ExcursionDetailActionsDataTypes>(onConfirmAction, onDeniedAction);


    useEffect(() => {
        setExcursion(excursionData ? {
            ...excursionData,
            clients: excursionData.clients || []
        } : mockExcursion);
    }, [excursionData])

    useEffect(() => {
        if (updatedExcursion) {
            setExcursion({
                ...excursion,
                ...updatedExcursion,
                clients: updatedExcursion.clients || excursion.clients || []
            });
        }
    }, [updatedExcursion]);

    const carouselItems = [
        excursion.flyer,
        ...excursion.images,
        ...excursion.videos
    ];

    const mediaItems = [
        excursion.flyer,
        ...excursion.images,
        ...excursion.videos,
        ...excursion.audios // Audios won't display as images but are included for completeness
    ];

    const onAddClient = async (newClient: IClient) => {
        setAppIsLoading(true);
        console.log('newClient', newClient);

        const clientData = {
            ...newClient,
        }

        const {data: createdClient} = await addClient(clientData);
        newClient = {...newClient, ...createdClient};

        const updatedClients = [...excursion.clients, newClient];
        setExcursion({
            ...excursion,
            clients: updatedClients,
        });

        setAppIsLoading(false);
    };

    const onUpdateClient = async (client: Partial<IClient>, isOptimistic?: boolean) => {
        setAppIsLoading(true);
        // if (Array.isArray(client)) {
        //     setExcursion({
        //         ...excursion,
        //         clients: excursion.clients.map(c => {
        //             const updatedClient = (client as Partial<IClient>[]).find(cl => cl._id === c._id);
        //             return updatedClient ? {...c, ...updatedClient} : c;
        //         })
        //     });
        //     !isOptimistic && updateClient(client as any);
        // } else {
        if (!client._id) {
            // TODO: error toast
            return;
        }

        if (!isOptimistic) {
            const {data} = await updateClient({_id: client._id, ...client})
            client = {
                ...client,
                ...data,
            };
        }

        setExcursion({
            ...excursion,
            clients: excursion.clients.map(c => c._id === client._id ? {...c, ...client} : c)
        });

        setAppIsLoading(false);
    }

    const onUpdateService = async (service: Partial<IService>, extra?: IUpdateClientExtra) => {
        setAppIsLoading(true);

        if (!service?._id) {
            // TODO: error toast
            setAppIsLoading(false);
            return;
        }

        if (!extra?.isOptimistic) {
            const {data} = await updateService({_id: service._id, ...service});
            service = {
                ...service,
                ...data,
            };
        }

        setExcursion({
            ...excursion,
            clients: excursion.clients.map(client => {
                const selectService = client.services.some(s => s._id === service._id);
                if (selectService) {
                    return {
                        ...client,
                        services: client.services.map(s => s._id === service._id ? {...s, ...service} : s),
                        currentService: {...client.currentService, ...service} as IService
                    };
                }
                return client;
            })
        });

        setAppIsLoading(false);
    };

    const onUpdateExcursion = (e: Partial<IExcursion>, extra?: { isOptimistic?: boolean, avoidConfirm?: boolean }) => {
        setExcursion({...excursion, ...e});
        if (!extra?.isOptimistic) {
            updateExcursion({_id: excursion._id || '', ...e});
        }
    };

    const excursionBedrooms: IBedroom[] = useMemo(() => {
        return excursion.destinations.reduce((acc, org) => {
            if (!org.bedrooms) return acc;
            return [...acc, ...org.bedrooms];
        }, [] as IBedroom[]);
    }, [excursion.destinations]);


    const onExpenseUpdate = async (expense: IExpense, isOptimistic?: boolean) => {
        setAppIsLoading(true);

        let updatedExpenses: IExpense[] = excursion.expenses || [];

        if (expense._id) {
            updatedExpenses = updatedExpenses.map(e => e._id === expense._id ? {...e, ...expense} : e);
        } else {
            updatedExpenses = [...updatedExpenses, expense];
        }

        await onUpdateExcursion({expenses: updatedExpenses});

        setAppIsLoading(false);
    };

    const onExpenseDelete = async (expense: IExpense) => {
        await deleteExpense(expense._id as string);
        const updatedExpenses = excursion.expenses?.filter(e => e._id !== expense._id) || [];
        onUpdateExcursion({expenses: updatedExpenses}, {avoidConfirm: true, isOptimistic: true});
    };

    if (
        !excursion._id
    ) return (
        <div className="container mx-auto relative flex flex-col gap-5">
            <ExcursionDetailsSkeleton/>
        </div>
    );

    const handleOpenWhatsapp = (recipientType: WhatsappRecipientTypes) => () => {
        setWsRecipientType(recipientType);
        toggleWsMessaging();
    }

    return (
        <div className="container mx-auto relative flex flex-col gap-5">
            <Swiper
                initialSlide={1}
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    // depth: 100,
                    modifier: 1,
                    slideShadows: false,
                }}
                autoplay={{delay: 3000}}
                grabCursor
                slidesPerView={3}
                // spaceBetween={10}
                effect={'coverflow'}
                pagination
                modules={[
                    // Navigation,
                    Pagination, EffectCoverflow]}
                centeredSlides
                // navigation
                cssMode
                wrapperClass={'!overflow-y-hidden'}
                className="relative h-[500px] w-full"
            >
                {mediaItems.map((media, index) => (
                    <SwiperSlide key={`slider-item-${index}`} className=" py-5 !flex justify-center">
                        {renderMedia(media)}
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="flex justify-end">
                <ProtectedElement roles={[UserRoleTypes.ADMIN]} userTypes={[UserTypes.AGENCY]}>
                    <Button variant="text" color="blue" className="whitespace-nowrap">
                        <Link to={`/dashboard/excursions/handler/${excursion._id}/`}>
                            Editar Excursion
                        </Link>
                    </Button>
                </ProtectedElement>
            </div>
            {excursion.audios.map((audio, index) => (
                <AudioPlayer key={index} src={audio.content} title={`Audio Track ${index + 1}`}/>
            ))}
            {/* Star rating overlay */}
            <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded z-50">
                <StarIcon className="h-5 w-5 inline-block text-yellow-400"/>
                <span className="ml-2">{excursion.reviews[0]?.stars || 0} Stars</span>
            </div>

            <div className="flex items-center justify-between">
                {/* Excursion title */}
                <Typography variant="h1" className="mt-4 mb-2">
                    {excursion.title}
                </Typography>
            </div>

            <div className="flex gap-3 items-center justify-end">
                <ProtectedElement roles={[UserRoleTypes.ADMIN]} userTypes={[UserTypes.AGENCY]}>
                    <Menu
                        animate={{mount: {scale: 1}, unmount: {scale: 0.9}}}
                    >
                        <MenuHandler>
                            <Button color="green" className="flex items-center gap-2"
                                    variant="outlined">
                                Whatsapp <FaWhatsapp className="w-[18px] h-[18px] cursor-pointer"/>
                            </Button>
                        </MenuHandler>
                        <MenuList
                            className="absolute z-[9999] bg-white shadow-lg rounded-lg p-2">
                            <MenuItem
                                className="flex items-center text-nowrap gap-2"
                                onClick={handleOpenWhatsapp('group')}>
                                Enviar al grupo
                                <FaUsers />
                            </MenuItem>
                            <MenuItem
                                className="flex items-center text-nowrap gap-2"
                                disabled={!selectedClients?.length}
                                onClick={handleOpenWhatsapp('user')}>
                                <Tooltip content={!selectedClients?.length ? 'Selecciona almenos 1 cliente' : ''}>
                                    Enviar a Clientes
                                </Tooltip>
                                <FaUser />
                            </MenuItem>

                        </MenuList>
                    </Menu>

                </ProtectedElement>
                <Button color="blue" className="flex items-center gap-2" onClick={refetchExcursion} variant="outlined">
                    Recargar <IoReload className="w-[18px] h-[18px] cursor-pointer"/>
                </Button>
                <Button color="blue" className="flex items-center gap-2" onClick={toggleSettings} variant="outlined">
                    Ajustes
                    <IoSettings className="w-[18px] h-[18px] cursor-pointer"/>
                </Button>
            </div>

            <ClientsExcursionTable
                bedrooms={excursionBedrooms}
                excursion={excursion}
                clients={excursion.clients || []}
                updateExcursion={handleSetActionToConfirm('update', EXCURSION_CONSTANTS.UPDATE_EXCURSION_TEXT)}
                onUpdateClient={handleSetActionToConfirm('update-client', CLIENTS_CONSTANTS.UPDATE_CLIENT_TEXT)}
                onUpdateService={handleSetActionToConfirm('update-service', SERVICE_CONSTANTS.UPDATE_SERVICE_TEXT)}
                onAddClient={handleSetActionToConfirm('add-client', CLIENTS_CONSTANTS.ADD_CLIENT_TEXT)}
                onClientSelected={clients => {
                    setSelectedClients(clients);
                }}
            />
            <FinanceDetails
                transport={excursion.transport}
                destinations={excursion.destinations}
                expenses={excursion.expenses}
                finance={excursion.finance}
                clients={excursion.clients || []}
                projections={excursion.projections} excursionId={excursion._id as string}
                dialog={toggleExpenseDialog}
            />
            <ExpensesHandler
                dialog={{
                    open: isExpenseDialogOpen,
                    handler: toggleExpenseDialog,
                }}
                initialExpenses={excursion.expenses || []}
                onUpdateExpense={handleSetActionToConfirm('update-expense', EXPENSES_CONSTANTS.UPDATE_EXPENSES_TEXT)}
                onDeleteExpense={handleSetActionToConfirm('delete-expense', EXPENSES_CONSTANTS.DELETE_EXPENSES_TEXT)}
            />
            {!!excursionBedrooms?.length && <BedroomDetails excursion={excursion}/>}
            {/*{!!excursion.activities.length && <ActivityDetails activities={excursion.activities}/>}*/}
            {/*<ProjectionsCharts projections={excursion.projections}/>*/}
            {!!excursion.checkpoints?.length && <CheckpointDetails excursion={excursion}/>}

            <div>
                <Typography variant="h2" className="mt-10">Organizaciones y Destinos</Typography>
                <div className="flex justify-around gap-3 !overflow-x-scroll p-4 py-10 h-[400px]">
                    {[...excursion.organizations, ...excursion.destinations, excursion.transport.organization].map((entity, index) => (
                        <OrganizationCard
                            className={`w-[250px]`}
                            key={`organization-${index}`}
                            organization={entity}/>
                    ))}
                </div>
            </div>
            <ConfirmDialog/>
            {ownerOrganization?.sessionId && wsMessagingIsOpen &&
                <WhatsappExcursionMessageHandler
                    recipientType={wsRecipientType}
                    recipients={selectedClients}
                    excursion={excursion}
                    dialog={{
                        open: wsMessagingIsOpen,
                        handler: toggleWsMessaging,
                    }}/>
            }
            <ExcursionConfigurationHandler
                dialog={{
                    open: settingsIsOpen,
                    handler: toggleSettings,
                }}
                excursion={excursion}
                updateExcursion={handleSetActionToConfirm('update', EXCURSION_CONSTANTS.UPDATE_EXCURSION_TEXT)}
                initialConfig={excursion.configuration}
            />
        </div>
    );
};

