import React, {useEffect, useMemo, useState} from 'react';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Typography
} from "@material-tailwind/react";
import {Link, useParams} from 'react-router-dom';
import {StarIcon} from "@heroicons/react/24/solid";
import {Swiper, SwiperSlide} from 'swiper/react';
import {mockExcursion} from "../../../../data/excursions-mock-data";
import {ExcursionDetailActions, ExcursionDetailActionsDataTypes, IExcursion} from "../../../../models/excursionModel";
import {Navigation, Pagination} from "swiper/modules";
import {ClientsExcursionTable} from "../components/ClientsExcursionTable";
import {FinanceDetails} from "../components/FinanceDetail";
import {ActivityDetails} from "../components/ActivityList";
import {ProjectionsCharts} from "../components/ProjectionCharts";
import {OrganizationCard} from "../components/OrganizationCard";
import {useRenderMedia} from "../../../../hooks/useRenderMedia";
import AudioPlayer from "../components/AudioCard";
import {CheckpointForm} from "../components/CheckpointForm";
import {ICheckpoint} from "../../../../models/checkpointModel";
import {TravelMap} from "../../../../components/TravelMap";
import {getCrudService} from "../../../../api/services/CRUD.service";
import {IClient} from "../../../../models/clientModel";
import {GLOBAL_CONSTANTS} from "../../../../constants/global.constant";
import {useConfirmAction} from "../../../../hooks/useConfirmActionHook";
import {EXCURSION_CONSTANTS} from "../../../../constants/excursion.constant";
import {CLIENTS_CONSTANTS} from "../../../../constants/clients.constant";
import {IBedroom} from "../../../../models/bedroomModel";
import {BedroomDetails} from "../components/BedroomsDetails";
import Messaging from "../../../../components/WhatsappMessageHandler";


const excursionService = getCrudService('excursions');
const clientService = getCrudService('travelClients');
export const ExcursionDetails: React.FC = () => {
    const [excursion, setExcursion] = useState<IExcursion>(mockExcursion);
    const {renderMedia} = useRenderMedia();
    const [updateClient, {isLoading: isUpdatingClient}] = clientService.useUpdateTravelClients();
    const params = useParams();
    const [updateExcursion, {isLoading: isUpdating, data: updatedExcursion}] = excursionService.useUpdateExcursions();
    const [wsMessagingIsOpen, setWsMessagingIsOpen] = useState(true);
    const toggleWsMessaging = () => setWsMessagingIsOpen(!wsMessagingIsOpen);

    const {
        data: excursionData,
        isLoading: isLoadingExcursion
    } = excursionService.useFetchByIdExcursions(params.excursionId);

    const onConfirmAction = (type?: ExcursionDetailActions, data?: ExcursionDetailActionsDataTypes, ...extra: any) => {
        switch (type) {
            case 'update':
                console.log('data', data, 'extra', extra);
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
        const relatedCompanies = (client.relatedCompanies || '').split(',');
        if (!relatedCompanies.includes(GLOBAL_CONSTANTS.BETUEL_TRAVEL)) {
            relatedCompanies.push(GLOBAL_CONSTANTS.BETUEL_TRAVEL);
        }

        const updatedClients = [
            ...excursion.clients,
            {
                ...client,
                relatedCompany: relatedCompanies.join(','),
            }
        ];

        const newExcursion: IExcursion = {...excursion, clients: updatedClients};
        setExcursion(newExcursion);
        updateExcursion({_id: excursion._id || '', clients: updatedClients});
    }

    const onUpdateClient = (client: Partial<IClient>, isOptimistic?: boolean) => {
        if (!client._id) {
            // TODO: error toast
            return;
        }
        setExcursion({
            ...excursion,
            clients: excursion.clients.map(c => c._id === client._id ? {...c, ...client} : c)
        });
        !isOptimistic && updateClient({_id: client._id, ...client});
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

    console.log(excursionBedrooms, excursion.destinations);

    return (
        <div className="container mx-auto p-4 relative flex flex-col gap-7 ">
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                slidesPerView={1}
                navigation
                pagination={{clickable: true}}
                className="relative h-[300px] w-full"
            >
                {mediaItems.map((media, index) => (
                    <SwiperSlide key={`slider-item-${index}`} className="!flex justify-center">
                        {renderMedia(media)}
                    </SwiperSlide>
                ))}
            </Swiper>
            {excursion.audios.map((audio, index) => (
                <AudioPlayer key={index} src={audio.content} title={`Audio Track ${index + 1}`}/>
            ))}
            {/* Star rating overlay */}
            <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded z-50">
                <StarIcon className="h-5 w-5 inline-block text-yellow-400"/>
                <span className="ml-2">{excursion.reviews[0]?.stars || 0} Stars</span>
            </div>

            {/* Excursion title */}
            <Typography variant="h1" className="mt-4 mb-2">
                {excursion.title}
            </Typography>

            {/* Organization, Destination, and TransportStep Information Cards */}
            <div className="flex justify-around gap-3 !overflow-x-scroll p-4 py-10 h-[400px]">
                {[...excursion.organizations, ...excursion.destinations, excursion.transport.organization].map((entity, index) => (
                    <OrganizationCard
                        className={`w-[250px]`}
                        key={`organization-${index}`}
                        organization={entity}/>
                ))}
            </div>
            {/* More sections like Clients Table, Finance Details, Activities Tabs, etc., can follow here */}
            <ClientsExcursionTable
                bedrooms={excursionBedrooms}
                updateExcursion={handleSetActionToConfirm('update', EXCURSION_CONSTANTS.UPDATE_EXCURSION_TEXT)}
                onUpdateClient={handleSetActionToConfirm('update-client', CLIENTS_CONSTANTS.UPDATE_CLIENT_TEXT)}
                excursion={excursion}
                onAddClient={handleSetActionToConfirm('add-client', CLIENTS_CONSTANTS.ADD_CLIENT_TEXT)}
                clients={excursion.clients || []}
            />
            <FinanceDetails finance={excursion.finance} clients={excursion.clients || []}
                            projections={excursion.projections} excursionId={excursion._id as string}
            />
            <BedroomDetails excursion={excursion}/>
            <ActivityDetails activities={excursion.activities}/>
            <ProjectionsCharts projections={excursion.projections}/>

            <div>
                <Button color="blue" onClick={addCheckpoint}>Add New Checkpoint</Button>
                {selectedCheckpoint && (
                    <CheckpointForm checkpoint={selectedCheckpoint} onSave={saveCheckpoint} onCancel={() => {
                    }}/>
                )}
                <Swiper
                    style={{width: '350px'}}
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
            <ConfirmDialog/>
            <Messaging dialog={{
                open: wsMessagingIsOpen,
                handler: toggleWsMessaging,
            }}/>
        </div>
    );
};

