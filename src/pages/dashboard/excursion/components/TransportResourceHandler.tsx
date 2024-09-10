import React, {useState, useEffect, useMemo} from 'react';
import {
    Button,
    Input,
    Card,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    Typography, CardFooter, MenuItem, Chip
} from '@material-tailwind/react';
import InputMask from "react-input-mask";
import _ from 'lodash';
import {getCrudService} from "../../../../api/services/CRUD.service";
import {CommonConfirmActions, CommonConfirmActionsDataTypes} from "../../../../models/common";
import {useConfirmAction} from "../../../../hooks/useConfirmActionHook";
import {busList, ITransportResource} from "../../../../models/transportResourcesModel";
import {IFinance} from "../../../../models/financeModel";
import {IBus} from "../../../../models/busesModel";
import {FinanceHandler} from "./FinanceHandler";
import IUser, {UserTypes} from "../../../../models/interfaces/userModel";
import BusHandler from "./BusesHandler";
import SearchableSelect, {IOption} from "../../../../components/SearchableSelect";
import {serviceStatusList} from "@/models/serviceModel";
import {BASIC_CONSTANTS} from "@/constants/basic.constants";
import {AlertWithContent} from "@/components/AlertWithContent";

interface TransportResourceHandlerProps {
    transportResources: ITransportResource[];
    updateTransportResources: (transportResources: ITransportResource[]) => void;
}

export const emptyTransportResource: ITransportResource = {
    driver: {} as IUser,
    finance: {} as IFinance,
    bus: {} as IBus,
};

const transportResourcesService = getCrudService('transportResources');
const busesService = getCrudService('buses');
const userService = getCrudService('travelUsers');
const TransportResourceHandler: React.FC<TransportResourceHandlerProps> = ({
                                                                               transportResources,
                                                                               updateTransportResources
                                                                           }) => {
    const [newTransportResource, setNewTransportResource] = useState<ITransportResource>(emptyTransportResource);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isBusDialogOpen, setIsBusDialogOpen] = useState(false);
    const [buses, setBuses] = useState<IBus[]>([]);
    const [updateTransportResource, {isLoading: isUpdating}] = transportResourcesService.useUpdateTransportResources();
    const [deleteTransportResourceById, {isLoading: isDeleting}] = transportResourcesService.useDeleteTransportResources();
    const {data: busesData, isLoading: isLoadingBuses} = busesService.useFetchAllBuses();

    const {data: existingDriver} = userService.useFetchAllTravelUsers({phone: newTransportResource.driver?.phone}, {skip: (newTransportResource.driver?.phone?.length || 0) < 11});
    const [inValid, setInValid] = React.useState(false);

    useEffect(() => {
        if (busesData) {
            setBuses(busesData);
        }
    }, [busesData]);

    const onConfirmAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<ITransportResource>) => {
        switch (type) {
            case 'delete':
                handleDeleteTransportResource(data as ITransportResource);
                break;
        }
    };

    const onDeniedAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<ITransportResource>) => {
    };

    const {
        handleSetActionToConfirm,
        resetActionToConfirm,
        ConfirmDialog
    } = useConfirmAction<CommonConfirmActions, CommonConfirmActionsDataTypes<ITransportResource>>(onConfirmAction, onDeniedAction);

    const handleInputChange = ({target: {value, name, type}}: any) => {
        if (type === 'tel') {
            value = value.replace(/[^0-9]/g, '');
            if (value == '1') return;
        }


        if (type === 'number') value = parseInt(value);

        const newInfo = _.set(structuredClone(newTransportResource), name, value);
        setNewTransportResource({
            ...newInfo,
            driver: {
                ...newInfo.driver,
                type: UserTypes.DRIVER,
            } as IUser,
        });
    };

    useEffect(() => {
        if (existingDriver?.length) {
            const foundDriver = existingDriver[0];
            foundDriver && setNewTransportResource({
                ...newTransportResource,
                driver: foundDriver
            });
        } else {
            setNewTransportResource({
                ...newTransportResource,
                driver: {
                    _id: undefined,
                    firstName: newTransportResource.driver?.firstName,
                    phone: newTransportResource.driver?.phone,
                    organization: newTransportResource.driver?.organization as string,
                    type: UserTypes.DRIVER,
                } as IUser,
            });
        }
    }, [existingDriver]);

    const handleFinanceChange = (finance: IFinance) => {
        setNewTransportResource({
            ...newTransportResource,
            finance
        });
    };

    const addOrEditTransportResource = () => {
        // Verificar si el recurso de transporte nuevo tiene datos válidos
        if (Object.keys(newTransportResource.bus).length === 0) {
            // Si 'bus' está vacío, muestra una alerta y retorna
            setInValid(true)
            return;
        }

        // Verificar si ya existe un conductor con el mismo número de teléfono
        const driverPhone = newTransportResource.driver?.phone;
        const isDuplicatePhone = transportResources.some(resource => resource.driver?.phone === driverPhone);

        if (isDuplicatePhone) {
            setInValid(true)
            return;
        }

        const updatedTransportResources = [...transportResources];

        if (editingIndex !== null) {
            updatedTransportResources[editingIndex] = newTransportResource;
        } else {
            updatedTransportResources.push(newTransportResource);
        }

        updateTransportResources(updatedTransportResources);
        setNewTransportResource(emptyTransportResource);
        setEditingIndex(null);
    };

    const handleDeleteTransportResource = (bus: ITransportResource) => {
        const updatedTransportResources = transportResources.filter(b => {
            if (bus._id) {
                return b._id !== bus._id;
            }

            return JSON.stringify(b) !== JSON.stringify(bus);
        });

        updateTransportResources(updatedTransportResources);
        bus._id && deleteTransportResourceById(bus._id);
    };

    const startEditing = (index: number) => {
        setNewTransportResource(transportResources[index]);
        setEditingIndex(index);
    };

    const handleBusSelection = (selectedBusesOptions: IOption[]) => {
        const selectedBus = buses.find(bus => bus._id === selectedBusesOptions[0]?.value);
        if (selectedBus) {
            setNewTransportResource({
                ...newTransportResource,
                bus: selectedBus
            });
        }
    };

    const updateBuses = (updatedBuses: IBus[]) => {
        setBuses(updatedBuses);
    };

    const busesOptions: IOption[] = useMemo(() => {
        return buses.map(bus => ({
            value: bus._id,
            label: `${bus.model} de ${bus.capacity} pasajeros ${bus.color ? `(${bus.color})` : ''}`
        }) as IOption);
    }, [buses])

    return (
        <div className="flex flex-col gap-3">
            <AlertWithContent open={inValid} setOpen={setInValid} content={"Telefono ya registrado o datos incompletos"} type="warning"/>
            <h2>{editingIndex !== null ? 'Edit Transport Resource' : 'Add New Transport Resource'}</h2>
            <div className="flex flex-col flex-wrap gap-4">
                <Typography variant="h6">Guagua: </Typography>
                <div className="flex items-center gap-3">
                    <SearchableSelect<IOption>
                        options={busesOptions}
                        label="Selecciona guagua"
                        onSelect={handleBusSelection}
                    />
                    <Button color="green" onClick={() => setIsBusDialogOpen(true)}>Manejar buses</Button>
                </div>
                <Typography variant="h6">Conductor: </Typography>
                <div className="flex items-center gap-5">
                    <InputMask
                        mask="+1 (999) 999-9999"
                        type="tel"
                        value={newTransportResource.driver?.phone || ''}
                        name="driver.phone"
                        onChange={handleInputChange}
                        maskPlaceholder={null}
                        alwaysShowMask={false}
                    >
                        {((inputProps: any) => (
                            <Input
                                {...(inputProps as any)}
                                type="tel"
                                label="Telefono del conductor"
                            />
                        )) as any}
                    </InputMask>
                    <Input type="text"
                           label="Driver Name"
                           value={newTransportResource.driver?.firstName || ''}
                           name="driver.firstName"
                           onChange={handleInputChange}/>

                </div>

            </div>
            <Typography variant="h6">Finanzas: </Typography>
            <FinanceHandler enabledCost={true} finance={newTransportResource.finance} type="transport"
                            updateFinance={handleFinanceChange}/>
            <Button color="blue"
                    onClick={addOrEditTransportResource}>{editingIndex !== null ? `${BASIC_CONSTANTS.SAVE_TEXT}` : 'Add Transport Resource'}</Button>
            <div className="grid grid-cols-3 gap-4">
                {transportResources.map((bus, index) => (
                    <Card key={index} className="p-4 my-2 flex flex-col justify-between">
                        <Typography variant='h6'>Conductor: {bus.driver?.firstName}</Typography>
                        {busList.map((busItem) => (
                            <Typography variant='paragraph' key={busItem.value}>
                                {busItem.label}: {bus.bus[busItem.value]}
                            </Typography>
                        ))}
                        {bus.finance?.cost ? <Typography variant='h6'>Cost: {bus.finance.cost}</Typography> : null}
                        <Typography variant='h6'>Price: RD${bus.finance?.price?.toLocaleString()}</Typography>

                        <CardFooter className="p-2">
                            <div className="flex mt-4 gap-2">
                                <Button variant='outlined' color="green" onClick={() => startEditing(index)}>{BASIC_CONSTANTS.EDIT_TEXT}</Button>
                                <Button variant="outlined" color="red" onClick={() => handleSetActionToConfirm('delete', 'Delete Transport Resource')(bus)}>{BASIC_CONSTANTS.DELETE_TEXT}</Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <ConfirmDialog/>

            <Dialog size="md" open={isBusDialogOpen} handler={setIsBusDialogOpen}>
                <DialogHeader>
                    Add/Edit Bus
                </DialogHeader>
                <DialogBody>
                    <BusHandler buses={buses || []} updateBuses={updateBuses}/>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={() => setIsBusDialogOpen(false)}>{BASIC_CONSTANTS.CANCEL_TEXT}</Button>
                    <Button variant="text" color="green" onClick={() => setIsBusDialogOpen(false)}>{BASIC_CONSTANTS.SAVE_TEXT}</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default TransportResourceHandler;
