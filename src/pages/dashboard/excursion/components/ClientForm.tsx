import React, {useEffect, useState} from 'react';
import {Input, Button, Dialog, DialogHeader, DialogBody, DialogFooter, Typography} from "@material-tailwind/react";
import {IClient} from "@/models/clientModel";
import InputMask from "react-input-mask";
import ServiceHandler from "./ServiceHandler";
import {IService} from "@/models/serviceModel";
import {getCrudService} from "@/api/services/CRUD.service";
import {ICustomComponentDialog} from "@/models/common";
import {useForm, SubmitHandler, Control} from "react-hook-form";
import FormControl from "@/components/FormControl";

interface ClientFormProps {
    initialClient?: IClient;
    onSubmit: (client: IClient) => void;
    onDeletePayment?: (payment: any) => void;
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
    const [service, setService] = useState<IService | undefined>(structuredClone(serviceData));
    const [client, setClient] = useState<IClient>(initialClient || emptyClient);

    const {data: existingClients} = clientService.useFetchAllTravelClients({
        phone: client.phone
    }, {
        skip: client.phone.length < 11 || initialClient?.phone === client.phone
    });

    const {
        control,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm<any>({mode: 'all', values: client});


    const handleChange = ({target: {value, name, type}}: React.ChangeEvent<HTMLInputElement>) => {
        if (type === 'tel') {
            value = value.replace(/[^0-9]/g, '');
            if (value == '1') return;
        }

        setClient({...client, [name]: value});
    };

    const onUpdateServices = (services: IService[]) => {
        setClient({...client, services});
    }

    const onUpdateSingleService = (s: IService) => {
        setClient({...client, services: [s]});
    }
    useEffect(() => {
        if (initialClient?._id) {
            setClient(initialClient);
            setService(initialClient.currentService);
        }
    }, [initialClient]);

    useEffect(() => {
        if (initialClient && initialClient.phone === client.phone) return;

        if (existingClients?.length && client.phone.length === 11) {
            const foundClient = existingClients[0];
            if (foundClient) {
                const newServices = mergeClientServices(foundClient);
                setClient({...foundClient, services: newServices});
            }

        } else if (client.phone.length === 11) {
            setClient({...emptyClient, phone: client.phone});
        }
    }, [existingClients, client.phone, initialClient?.phone]);

    useEffect(() => {
        if (serviceData) {
            setService(structuredClone(serviceData));
        }
    }, [serviceData]);

    const mergeClientServices = (clientData: IClient = client): IService[] => {
        if (!service) return clientData.services || [];
        const exist = clientData.services?.find(s => s.excursionId === service?.excursionId);
        return clientData.services && exist ? clientData.services : [...(clientData.services || []), service];
    };

    useEffect(() => {
        if (!service) return;

        const newServices = mergeClientServices();
        setClient({
            ...client,
            services: newServices,
        });
    }, [service]);


    const handleOnSubmit: SubmitHandler<any> = () => {
        onSubmit({
                ...client,
                currentService: service
            }
        );
        setClient(structuredClone(emptyClient));
        setService(undefined);
    };

    const form = (
        <div className="px-4 flex flex-col gap-3">
            <Typography variant="h6">Datos del Cliente</Typography>
            {/*<form onSubmit={handleSubmit}>*/}
            <FormControl
                name="phone"
                control={control as Control}
                label="Teléfono"
                type="tel"
                rules={{required: 'El teléfono es requerido'}}
                mask="+1 (999) 999-9999"
                maskProps={{
                    maskPlaceholder: null,
                    alwaysShowMask: false,
                }}
            />
            <div className="flex gap-3 items-center">
                <FormControl
                    name="firstName"
                    control={control as Control}
                    label="Nombre"
                    rules={{required: 'El nombre es requerido'}}
                />
                <FormControl
                    name="lastName"
                    control={control as Control}
                    label="Apellido"
                    rules={{required: 'El apellido es requerido'}}
                />
            </div>
            <FormControl
                name="email"
                control={control as Control}
                label="Correo"
                type="email"
                rules={{
                    required: 'El correo es requerido',
                    pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Formato de correo inválido',
                    },
                }}
            />
            {enableService && (<ServiceHandler
                    service={service}
                    services={client.services}
                    onUpdateSingleService={onUpdateSingleService}
                    onUpdateServices={onUpdateServices}/>
            )}
            {!dialog && <Button
                color="blue"
                type={'submit'}
                className="mt-4"
            >
                {!!existingClients?.length ? 'Actualizar' : 'Agregar'}
            </Button>}
            {/*</form>*/}
        </div>
    )

    const dialogHandler = () => {
        dialog?.handler && dialog.handler();
        setClient(emptyClient);
    }

    return (
        dialog ?
            <Dialog open={dialog.open} handler={dialogHandler}>
                <DialogHeader className="justify-between">
                    {client._id ? 'Editar Cliente' : 'Agregar Cliente'}
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
            </Dialog>
            : form
    );
};

export default ClientForm;
