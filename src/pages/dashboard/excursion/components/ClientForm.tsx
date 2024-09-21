import React, {useEffect, useState} from 'react';
import {Input, Button, Dialog, DialogHeader, DialogBody, DialogFooter, Typography} from "@material-tailwind/react";
import {IClient} from "@/models/clientModel";
import InputMask from "react-input-mask";
import {getCrudService} from "@/api/services/CRUD.service";
import {ICustomComponentDialog} from "@/models/common";

interface ClientFormProps {
    initialClient?: IClient;
    onSubmit: (client: IClient) => void;
    onDeletePayment?: (payment: any) => void;
    enableService?: boolean;
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
        onSubmit,
        dialog
    }) => {
    const [client, setClient] = useState<IClient>(initialClient || emptyClient);

    const {data: existingClients} = clientService.useFetchAllTravelClients({
        phone: client.phone
    }, {
        skip: client.phone.length < 11 || initialClient?.phone === client.phone
    });

    const handleChange = ({target: {value, name, type}}: React.ChangeEvent<HTMLInputElement>) => {
        // if(!value) return;
        if (type === 'tel') {
            value = value.replace(/[^0-9]/g, '');
            if (value == '1') return;
        }

        setClient({...client, [name]: value});
    };

    useEffect(() => {
        if (initialClient) {
            setClient(initialClient);
        }
    }, [initialClient]);

    useEffect(() => {
        if (initialClient && initialClient.phone === client.phone) return;

        if (existingClients?.length && client.phone.length === 11) {
            const foundClient = existingClients[0];
            if (foundClient) {
                setClient({...foundClient});
            }

        } else if (client.phone.length === 11) {
            setClient({...emptyClient, phone: client.phone});
        }
    }, [existingClients, client.phone, initialClient?.phone]);


    const handleSubmit = () => {
        onSubmit(client);
        setClient(structuredClone(emptyClient));
    };

    const form = (
        <div className="px-4 flex flex-col gap-3">
            <Typography variant="h6">Datos del Cliente</Typography>
            <InputMask
                mask="+1 (999) 999-9999"
                name="phone"
                type="tel"
                value={client.phone}
                onChange={handleChange}
                maskPlaceholder={null}
                alwaysShowMask={false}
            >
                {
                    ((inputProps: any) => (
                        <Input
                            {...(inputProps as any)}
                            type="tel"
                            label="Teléfono"
                            value={client.phone}
                        />
                    ) as any) as any}
            </InputMask>
            <div className="flex gap-3 items-center">
                <Input
                    crossOrigin={"true"}
                    label="Nombre"
                    name="firstName"
                    value={client.firstName}
                    onChange={handleChange}

                />
                <Input
                    crossOrigin={"true"}
                    label="Apellido"
                    name="lastName"
                    value={client.lastName}
                    onChange={handleChange}
                />
            </div>
            <Input
                crossOrigin={"true"}
                label="Correo"
                name="email"
                value={client.email}
                onChange={handleChange}
            />
            {!dialog && <Button
                color="blue"
                onClick={handleSubmit}
                className="mt-4"
            >
                {!!existingClients?.length ? 'Actualizar' : 'Agregar'}
            </Button>}
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
                        onClick={handleSubmit}
                    >
                        Enviar
                    </Button>
                </DialogFooter>
            </Dialog>
            : form
    );
};

export default ClientForm;
