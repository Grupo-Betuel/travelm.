import React, {ReactNode, useEffect, useMemo, useState} from 'react';
import {Input, Button, Dialog, DialogHeader, DialogBody, DialogFooter} from "@material-tailwind/react";
import {IClient} from "../../../../models/clientModel";
import InputMask from "react-input-mask";
import ServiceHandler from "./ServiceHandler";
import {IService} from "../../../../models/serviceModel";
import {getCrudService} from "../../../../api/services/CRUD.service";
import {ICustomComponentDialog} from "../../../../models/common";

interface ClientFormProps {
    initialClient?: IClient;
    onSubmit: (client: IClient) => void;
    onDeletePayment?: (payment: any) => void;
    enableService?: boolean;
    serviceData?: IService;
    dialog?: ICustomComponentDialog;
}

const emptyClient: IClient = {
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

    const {data: existingClients} = clientService.useFetchAllTravelClients({phone: client.phone}, {skip: client.phone.length < 11});

    const handleChange = ({target: {value, name, type}}: React.ChangeEvent<HTMLInputElement>) => {
        // if(!value) return;
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
        if (initialClient) {
            setClient(() => initialClient)
        }
    }, [initialClient]);

    useEffect(() => {
        if (existingClients?.length && client.phone.length === 11) {
            const foundClient = existingClients[0];
            const relatedService = foundClient.services.find(s => s.excursionId === service?.excursionId);
            if (relatedService) {
                setService(relatedService);
            }
            foundClient && setClient(foundClient);
            // TODO: TOAS EXISTING CLIENT
        } else if (client.phone.length === 11) {
            setClient({...emptyClient, phone: client.phone});
            setService(structuredClone(serviceData));
        }
    }, [existingClients, client.phone]);

    useEffect(() => {
        if (serviceData) {
            setService(structuredClone(serviceData));
        }
    }, [serviceData]);


    const form = (
        <div className="p-4 flex flex-col gap-3">
            <InputMask
                mask="+1 (999) 999-9999"
                name="phone"
                type="tel"
                value={client.phone}
                onChange={handleChange}
                maskPlaceholder={null} // This avoids showing underscores or other characters in unfocused state
                alwaysShowMask={false}
            >
                {
                    ((inputProps: any) => (
                        <Input
                            {...(inputProps as any)}
                            type="tel"
                            label="Teléfono"
                        />
                    ) as any) as any}
            </InputMask>
            <Input
                label="Nombre"
                name="firstName"
                value={client.firstName}
                onChange={handleChange}
            />
            <Input
                label="Apellido"
                name="lastName"
                value={client.lastName}
                onChange={handleChange}
            />
            {enableService && <ServiceHandler
                service={service}
                services={client.services}
                onUpdateSingleService={onUpdateSingleService}
                onUpdateServices={onUpdateServices}/>
            }
            {!dialog && <Button
                color="blue"
                onClick={() => onSubmit(client)}
                className="mt-4"
            >
                {!!existingClients?.length ? 'Actualizar' : 'Agregar'}
            </Button>}
        </div>
    )

    const dialogHandler = () => {
        dialog?.handler && dialog.handler();
        setClient(emptyClient);
        setService({
            ...(serviceData || {}),
            payments: [],
        } as IService);
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
                        onClick={() => onSubmit(client)}
                    >
                        {!!existingClients?.length ? 'Actualizar' : 'Agregar'}
                    </Button>
                </DialogFooter>
            </Dialog>
            : form
    );
};

export default ClientForm;
