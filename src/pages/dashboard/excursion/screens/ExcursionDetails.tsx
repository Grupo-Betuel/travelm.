import React, {useEffect, useMemo, useState} from 'react';
import {Button, Card, CardBody, CardHeader, Typography} from "@material-tailwind/react";
import {Link, useParams} from 'react-router-dom';
import {StarIcon} from "@heroicons/react/24/solid";
import {Swiper, SwiperSlide} from 'swiper/react';
import {mockExcursion} from "@/data/excursions-mock-data";
import {ExcursionDetailActions, ExcursionDetailActionsDataTypes, IExcursion} from "@/models/excursionModel";
import {EffectCoverflow, Navigation, Pagination} from "swiper/modules";
import {ClientsExcursionTable} from "../components/ClientsExcursionTable";
import {FinanceDetails} from "../components/FinanceDetail";
import {ActivityDetails} from "../components/ActivityList";
import {ProjectionsCharts} from "../components/ProjectionCharts";
import {OrganizationCard} from "../components/OrganizationCard";
import {useRenderMedia} from "@/hooks/useRenderMedia";
import AudioPlayer from "../components/AudioCard";
import {CheckpointForm} from "../components/CheckpointForm";
import {ICheckpoint} from "@/models/checkpointModel";
import {TravelMap} from "@/components/TravelMap";
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
import {IoReload} from "react-icons/io5";
import {FaWhatsapp} from "react-icons/fa";
import {useAppLoading} from "@/context/appLoadingContext";
import ExcursionDetailsSkeleton from "../../../../components/ExcursionDetailsSkeleton";

const excursionService = getCrudService('excursions');
const clientService = getCrudService('travelClients');
export const ExcursionDetails: React.FC = () => {
    const [excursion, setExcursion] = useState<IExcursion>(mockExcursion);
    const {renderMedia} = useRenderMedia();
    const [updateClient, {isLoading: isUpdatingClient}] = clientService.useUpdateTravelClients();
    const params = useParams();
    const [updateExcursion, {isLoading: isUpdating, data: updatedExcursion}] = excursionService.useUpdateExcursions();
    const [wsMessagingIsOpen, setWsMessagingIsOpen] = useState(false);
    const ownerOrganization = useMemo(() => excursion.owner, [excursion.owner]);
    const toggleWsMessaging = () => setWsMessagingIsOpen(!wsMessagingIsOpen);
    const {setAppIsLoading} = useAppLoading();

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
                onAddClient(data as IClient)
                break;
            case 'update-client':
                onUpdateClient(data as IClient, ...extra);
                break;
            case 'remove-client':
                onUpdateExcursion(data as IExcursion);
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

    // Function to render media items correctly based on type

    const [checkpoints, setCheckpoints] = useState<ICheckpoint[]>([]);
    const [selectedCheckpoint, setSelectedCheckpoint] = useState<ICheckpoint | null>(null);

    const addCheckpoint = () => setSelectedCheckpoint({
        _id: '',
        location: {latitude: 0, longitude: 0, address: ''},
        description: '',
        buses: []
    });
    const editCheckpoint = (checkpoint: ICheckpoint) => setSelectedCheckpoint(checkpoint);
    const saveCheckpoint = (checkpoint: ICheckpoint) => {
        const updatedCheckpoints = checkpoints.filter(cp => cp.id !== checkpoint.id);
        setCheckpoints([...updatedCheckpoints, checkpoint]);
        setSelectedCheckpoint(null);
    };

    const onAddClient = (client: IClient) => {
        // HANDLING COMPANY RELATIONSHIP
        const updatedClients = [
            ...excursion.clients,
            {
                ...client,
            }
        ];

        const newExcursion: IExcursion = {...excursion, clients: updatedClients};
        setExcursion(newExcursion);
        updateExcursion({_id: excursion._id || '', clients: updatedClients});
    }

    const onUpdateClient = async (client: Partial<IClient> | Partial<IClient>[], isOptimistic?: boolean) => {
        setAppIsLoading(true);
        if (Array.isArray(client)) {
            setExcursion({
                ...excursion,
                clients: excursion.clients.map(c => {
                    const updatedClient = (client as Partial<IClient>[]).find(cl => cl._id === c._id);
                    return updatedClient ? {...c, ...updatedClient} : c;
                })
            });
            !isOptimistic && updateClient(client as any);
        } else {
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
        }
        setAppIsLoading(false);
    }

    const onUpdateExcursion = (e: Partial<IExcursion>, isOptimistic?: boolean) => {
        setExcursion({...excursion, ...e});
        !isOptimistic && updateExcursion({_id: excursion._id || '', ...e});
    }

    React.useEffect(() => {
        setCheckpoints(excursion.checkpoints);
    }, []);


    const excursionBedrooms: IBedroom[] = useMemo(() => {
        return excursion.destinations.reduce((acc, org) => {
            return [...acc, ...org.bedrooms];
        }, [] as IBedroom[]);
    }, [excursion.destinations]);

    console.log(ownerOrganization?.sessionId);

    if (
        !excursion._id
    ) return (
        <div className="container mx-auto relative flex flex-col gap-5">
            <ExcursionDetailsSkeleton/>
        </div>
    );

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
                    <Button color="green" className="flex items-center gap-2" onClick={toggleWsMessaging}>
                        Whatsapp <FaWhatsapp className="w-[18px] h-[18px] cursor-pointer"/>
                    </Button>
                </ProtectedElement>
                <Button color="blue" className="flex items-center gap-2" onClick={refetchExcursion}>
                    Recargar <IoReload className="w-[18px] h-[18px] cursor-pointer"/>
                </Button>
            </div>

            <ClientsExcursionTable
                bedrooms={excursionBedrooms}
                updateExcursion={handleSetActionToConfirm('update', EXCURSION_CONSTANTS.UPDATE_EXCURSION_TEXT)}
                onUpdateClient={handleSetActionToConfirm('update-client', CLIENTS_CONSTANTS.UPDATE_CLIENT_TEXT)}
                excursion={excursion}
                onAddClient={handleSetActionToConfirm('add-client', CLIENTS_CONSTANTS.ADD_CLIENT_TEXT)}
                clients={excursion.clients || []}
            />
            <FinanceDetails
                transport={excursion.transport}
                destinations={excursion.destinations}
                finance={excursion.finance}
                clients={excursion.clients || []}
                projections={excursion.projections} excursionId={excursion._id as string}
            />
            {!!excursionBedrooms?.length && <BedroomDetails excursion={excursion}/>}
            {/*{!!excursion.activities.length && <ActivityDetails activities={excursion.activities}/>}*/}
            {/*<ProjectionsCharts projections={excursion.projections}/>*/}
            {!!excursion.checkpoints?.length &&
                <div>

                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={10}
                        slidesPerView={1}
                        navigation
                        pagination={{clickable: true}}
                        className="relative h-[300px] w-full"
                    >
                        {excursion.checkpoints.map((checkpoint, index) => (
                            <SwiperSlide key={index}>
                                <Card>
                                    <CardHeader>
                                        <TravelMap location={checkpoint.location}/>
                                    </CardHeader>
                                    <CardBody>
                                        <Typography>{checkpoint.description}</Typography>
                                        <Button color="orange" onClick={() => editCheckpoint(checkpoint)}>Edit</Button>
                                    </CardBody>
                                </Card>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                </div>
            }

            {/* Organization, Destination, and TransportStep Information Cards */}
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
                <Messaging
                    sessionId={ownerOrganization?.sessionId}
                    dialog={{
                        open: wsMessagingIsOpen,
                        handler: toggleWsMessaging,
                    }}/>
            }
        </div>
    );
};

