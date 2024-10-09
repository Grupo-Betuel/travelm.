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
import {SubmitHandler, useForm, useWatch} from "react-hook-form";
import FormControl from "@/components/FormControl";
import {extractNumbersFromText} from "@/utils/text.utils";

interface TransportResourceHandlerProps {
    transportResources: ITransportResource[];
    updateTransportResources: (transportResources: ITransportResource[]) => void;
}

export const emptyTransportResource: ITransportResource = {
    driver: {} as IUser,
    finance: {
        type: "transport"
    } as IFinance,
    bus: {} as IBus,
};

const transportResourcesService = getCrudService('transportResources');
const busesService = getCrudService('buses');
const userService = getCrudService('travelUsers');

const TransportResourceHandler: React.FC<TransportResourceHandlerProps> = ({
                                                                               transportResources,
                                                                               updateTransportResources
                                                                           }) => {
    const [transportResourceForm, setTransportResourceForm] = useState<ITransportResource>(emptyTransportResource);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isBusDialogOpen, setIsBusDialogOpen] = useState(false);
    const [buses, setBuses] = useState<IBus[]>([]);
    const [updateTransportResource, {isLoading: isUpdating}] = transportResourcesService.useUpdateTransportResources();
    const [deleteTransportResourceById, {isLoading: isDeleting}] = transportResourcesService.useDeleteTransportResources();
    const {data: busesData} = busesService.useFetchAllBuses();

    const driverPhone = extractNumbersFromText(transportResourceForm.driver?.phone || '');
    // const {data: existingDriver} = userService.useFetchAllTravelUsers({phone: transportResourceForm.driver?.phone}, {skip: (transportResourceForm.driver?.phone?.length || 0) < 11});
    const [inValid, setInValid] = React.useState(false);
    // const {data: existingDriver} = userService.useFetchAllTravelUsers({ phone: driverPhone }, { skip: driverPhone < 10 });



    useEffect(() => {
        if (busesData) {
            setBuses(busesData);
        }
    }, [busesData]);


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

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState: {errors, isValid},
    } = useForm<ITransportResource>({mode: 'all', defaultValues: emptyTransportResource});

    const newTransportResource = useWatch({ control });
    const driver = newTransportResource.driver;

// Extract the phone number without the mask for database search
    const newPhone = useMemo(() => extractNumbersFromText(driver?.phone || ''), [driver?.phone]);

    const { data: existingDrivers } = userService.useFetchAllTravelUsers(
        {
            phone: newPhone,
        },
        {
            skip: newPhone < 11,
        }
    );

    useEffect(() => {
        const phone = newTransportResource?.driver?.phone;
        const cleanedPhone = extractNumbersFromText(phone || '');

        if (cleanedPhone && cleanedPhone > 10) {
            console.log('Valid phone number:', phone);

            console.log('Extracted numbers:', cleanedPhone);

            if (existingDrivers && existingDrivers.length > 0) {
                const foundDriver = existingDrivers[0];

                setValue('driver.firstName', foundDriver.firstName || '');
            }
        }
    }, [newTransportResource.driver?.phone, existingDrivers]);


    const handleBusSelection = (selectedBusesOptions: IOption[]) => {
        const selectedBus = buses.find((bus) => bus._id === selectedBusesOptions[0]?.value);
        if (selectedBus) {
            setValue('bus', selectedBus);
        }
    };

    const handleSave: SubmitHandler<ITransportResource> = (formData) => {
        const driverPhone = formData.driver?.phone;

        const isDuplicatePhone = transportResources.some(
            (resource) => resource.driver?.phone === driverPhone && resource !== formData
        );

        if (isDuplicatePhone) {
            alert('Ya existe un conductor con este número de teléfono');
            return;
        }

        const updatedTransportResources = [...transportResources];

        if (editingIndex !== null) {
            updatedTransportResources[editingIndex] = formData;
        } else {
            updatedTransportResources.push(formData);
        }

        updateTransportResources(updatedTransportResources);
        reset(emptyTransportResource);
        setEditingIndex(null);
    };

    const busesOptions: IOption[] = useMemo(
        () =>
            buses.map((bus) => ({
                value: bus._id,
                label: `${bus.model} de ${bus.capacity} pasajeros ${
                    bus.color ? `(${bus.color})` : ''
                }`,
            })),
        [buses]
    );


    const handleFinanceChange = (finance: Omit<IFinance, 'type'>) => {
        const updatedFinance: IFinance = {
            ...finance,
            type: 'transport',
        };

        setValue('finance', updatedFinance);
    };


    const startEditing = (index: number) => {
        reset(transportResources[index]);
        setEditingIndex(index);
    };

    const updateBuses = (updatedBuses: IBus[]) => {
        setBuses(updatedBuses);
    };

    const isTransportValid = useMemo(() => {
        const driver = newTransportResource.driver || {};
        const hasValidPhone = driver.phone && driver.phone.length > 0;
        const hasValidFirstName = driver.firstName && driver.firstName.length > 0;

        return isValid && hasValidPhone && hasValidFirstName;
    }, [isValid, newTransportResource.driver]);

    return (
        <div className="flex flex-col gap-3">
            <AlertWithContent open={inValid} setOpen={setInValid} content={"Telefono ya registrado o datos incompletos"}
                              type="warning"/>
            <form onSubmit={handleSubmit(handleSave)}>
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
                        <FormControl
                            name="driver.phone"
                            control={control}
                            label="Teléfono del Conductor"
                            type="tel"
                            mask="+1 (999) 999-9999"
                            maskProps={{
                                maskPlaceholder: null,
                                alwaysShowMask: false,
                            }}
                            className={"w-full"}
                        />
                        <FormControl
                            name="driver.firstName"
                            control={control}
                            label="Nombre del Conductor"
                            className="w-full"
                        />

                    </div>

                </div>
                <Typography variant="h6">Finanzas: </Typography>
                <FinanceHandler enabledCost={true} finance={transportResourceForm.finance} type="transport"
                                updateFinance={handleFinanceChange}/>
                <Button color="blue" disabled={!isTransportValid}
                        type={"submit"}>{editingIndex !== null ? `${BASIC_CONSTANTS.SAVE_TEXT}` : 'Add Transport Resource'}</Button>
            </form>
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
                                <Button variant='outlined' color="green"
                                        onClick={() => startEditing(index)}>{BASIC_CONSTANTS.EDIT_TEXT}</Button>
                                <Button variant="outlined" color="red"
                                        onClick={() => handleSetActionToConfirm('delete', 'Delete Transport Resource')(bus)}>{BASIC_CONSTANTS.DELETE_TEXT}</Button>
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
                    <Button variant="text" color="red"
                            onClick={() => setIsBusDialogOpen(false)}>{BASIC_CONSTANTS.CANCEL_TEXT}</Button>
                    <Button variant="text" color="green"
                            onClick={() => setIsBusDialogOpen(false)}>{BASIC_CONSTANTS.SAVE_TEXT}</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default TransportResourceHandler;
