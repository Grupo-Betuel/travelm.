import React, {useEffect, useMemo} from 'react';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Typography} from "@material-tailwind/react";
import {IClient} from "@/models/clientModel";
import ServiceHandler from "./ServiceHandler";
import {IService} from "@/models/serviceModel";
import {getCrudService} from "@/api/services/CRUD.service";
import {ICustomComponentDialog} from "@/models/common";
import {useForm, SubmitHandler, useWatch} from "react-hook-form";
import FormControl from "@/components/FormControl";
import {extractNumbersFromText} from "@/utils/text.utils";

interface ClientFormProps {
    initialClient?: IClient;
    onSubmit: (client: IClient) => void;
    enableService?: boolean;
    serviceData?: IService;
    dialog?: ICustomComponentDialog;
}

export const emptyClient: IClient = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    services: [],
    socialNetworks: []
};

const clientService = getCrudService('travelClients');
const ClientForm: React.FC<ClientFormProps> = (
    {
        initialClient,
        serviceData,
        enableService,
        onSubmit,
        dialog
    }) => {

    const {
        control,
        handleSubmit,
        formState: {errors},
        setValue,
        reset
    } = useForm<IClient>({
        mode: 'all',
        defaultValues: initialClient || emptyClient,
    });

    const newClient: IClient = useWatch({ control }) as IClient;

    const newPhone = useMemo(() => extractNumbersFromText(newClient.phone), [newClient.phone]);
    const {data: existingClients} = clientService.useFetchAllTravelClients({
        phone: newPhone
    }, {
        skip: newPhone < 11 || initialClient?.phone === newPhone.toString()
    });

    useEffect(() => {
        if (initialClient) {
            reset(initialClient);
        }
    }, [initialClient, reset]);


    useEffect(() => {
        if (existingClients?.length) {
            const foundClient = existingClients[0];
            if (foundClient) {
                reset(foundClient);
                if (foundClient.currentService) {
                    setValue('services', [foundClient.currentService]);
                }
            }
        }
    }, [existingClients]);

    const handleFormSubmit: SubmitHandler<IClient> = (client) => {
        const { _id, ...clientDataWithoutId } = client._id ? client : { ...client };
        const updatedClient = {
            ...clientDataWithoutId,
            phone: newPhone.toString(),
            services: client.services,
            currentService: client.services?.length ? client.services[0] : serviceData,
        };

        onSubmit(updatedClient);
        reset(emptyClient);
    };

    const onUpdateServices = (services: IService[]) => {
        console.log("services", services);
        setValue('services', services);
    };

    const form = (
        <div className="px-4 flex flex-col gap-3">
            <Typography variant="h6">Datos del Cliente</Typography>
            <FormControl
                name="phone"
                control={control}
                label="Teléfono"
                type="tel"
                mask="+1 (999) 999-9999"
                maskProps={{
                    maskPlaceholder: null,
                    alwaysShowMask: false,
                }}
            />
            <div className="flex gap-4">
                <FormControl
                    name="firstName"
                    control={control}
                    label="Nombre"
                    rules={{required: 'El nombre es requerido'}}
                    className={'w-full'}
                />
                <FormControl
                    name="lastName"
                    control={control}
                    label="Apellido"
                    rules={{required: 'El apellido es requerido'}}
                    className={'w-full'}
                    data-disabled-loading
                />
            </div>
            <FormControl
                name="email"
                control={control}
                label="Correo"
                type="email"
                rules={{
                    pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Formato de correo inválido',
                    },
                }}
            />
            {enableService && (<ServiceHandler
                    service={serviceData}
                    services={newClient.services}
                    onUpdateServices={onUpdateServices}
                />
            )}
            {!dialog && <Button
                color="blue"
                type={'submit'}
                className="mt-4"
            >
                {!!existingClients?.length ? 'Actualizar' : 'Agregar'}
            </Button>}

        </div>
    )

    const dialogHandler = () => {
        dialog?.handler && dialog.handler();
        reset(emptyClient);
    }

    return (
        dialog ?
            <Dialog open={dialog.open} handler={dialogHandler}>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <DialogHeader className="justify-between">
                        {newClient._id ? 'Editar Cliente' : 'Agregar Cliente'}
                    </DialogHeader>
                    <DialogBody className="overflow-y-scroll max-h-[80dvh]">
                        {form}
                    </DialogBody>
                    <DialogFooter className="flex items-center justify-between">
                        <Button
                            variant="text"
                            size="lg"
                            color="red" onClick={dialogHandler}>Cancelar</Button>
                        <Button
                            variant="text"
                            size="lg"
                            color="blue"
                            type={'submit'}
                        >
                            Enviar
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
            :
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                {form}
            </form>
    );
};

export default ClientForm;
