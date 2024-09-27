import {useGCloudMediaHandler} from "./useGCloudMedediaHandler";
import React, {useEffect, useState} from "react";
import {getCrudService} from "@/api/services/CRUD.service";
import {IClient} from "@/models/clientModel";
import ClientForm from "@/pages/dashboard/excursion/components/ClientForm";

export interface IClientHandlerProps {
    onSelect?: (selected: IClient[]) => void;
    selected?: IClient[];
}

const clientService = getCrudService('travelClients');

export const useClientHandler = ({onSelect, selected}: IClientHandlerProps) => {
    const [addClient, {
        isLoading: isCreating,
        data: createdClient
    }] = clientService.useAddTravelClients();

    const [deleteClient, {
        isLoading: isDeleting,
        data: deletedClient
    }] = clientService.useDeleteTravelClients();

    const [updateClientData, {
        isLoading: isUpdating,
        data: updatedClient
    }] = clientService.useUpdateTravelClients();

    const {
        data: clientsData,
        refetch: refetchClients
    } = clientService.useFetchAllTravelClients();

    const [clientList, setClients] = useState<IClient[]>(clientsData || []);

    const [isNewClientOpen, setHandleClientOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<IClient | undefined>(undefined);

    const toggleHandleClient = () => {
        setHandleClientOpen(!isNewClientOpen);
        setSelectedClient(undefined);
    };

    useEffect(() => {
        if (clientsData) {
            setClients(clientsData);
        }
    }, [clientsData]);

    // Verificar si el cliente ya existe y realizar update, de lo contrario, crear un nuevo cliente
    const onCreateOrUpdateClient = async (formData: IClient) => {
        if (formData._id) {
            // Si el cliente tiene un _id, significa que debe actualizarse
            return await onUpdateClient(formData);
        } else {
            // Si no tiene un _id, se crea un nuevo cliente
            return await createNewClient(formData);
        }
    };

    const createNewClient = async (formData: IClient) => {
        const {data} = await addClient({
            ...formData,
        });

        if (data) {
            const selectedData = [...(selected || []), data as IClient];
            onSelect && onSelect(selectedData);
            setClients([...clientList, data as IClient]);
            toggleHandleClient();
        } else {
            // Manejar el error
            console.error('Error creando cliente');
        }

        return data;
    };

    const onUpdateClient = async (formData: Partial<IClient>) => {
        if (formData._id) {
            const {data} = await updateClientData({
                _id: formData._id,
                ...formData,
            });

            if (data) {
                const updatedClients = clientList.map((client) => {
                    if (client._id === data._id) {
                        return data;
                    }
                    return client;
                });
                setClients(updatedClients);

                const selectedData = (selected || []).map((client) => {
                    if (client._id === data._id) {
                        return data;
                    }
                    return client;
                });

                onSelect && onSelect(selectedData);
                toggleHandleClient();
            } else {
                // Manejar el error
                console.error('Error actualizando cliente');
            }

            return data;
        } else {
            console.error('Falta el ID del cliente para la actualización');
        }
    };

    const onDeleteClient = async (client: IClient) => {
        if (!client._id) {
            console.error('Falta el ID del cliente para la eliminación');
            return;
        }

        try {
            const {data} = await deleteClient(client._id as string);
            if (data) {
                // Actualizar la lista de clientes seleccionados eliminando el cliente correspondiente
                const updatedSelected = (selected || []).filter((selectedClient) => selectedClient._id !== client._id);
                onSelect && onSelect(updatedSelected);

                // Actualizar la lista general de clientes eliminando el cliente
                const updatedClients = clientList.filter((c) => c._id !== client._id);
                setClients(updatedClients);
            } else {
                // Manejar el error si la respuesta del servidor no contiene datos
                console.error('Error eliminando cliente: La respuesta del servidor no contiene datos.');
            }
        } catch (error) {
            // Manejar errores en la petición de eliminación
            console.error('Error eliminando cliente:', error);
        }
    };

    const onEditClient = (client: IClient) => {
        setSelectedClient(client);
        setHandleClientOpen(true);
    };

    const clientForm = (
        <ClientForm
            initialClient={selectedClient}
            dialog={{
                open: isNewClientOpen,
                handler: toggleHandleClient,
            }}
            serviceData={undefined}
            onSubmit={onCreateOrUpdateClient}
        />
    );

    return {
        clientForm,
        toggleHandleClient,
        setSelectedClient,
        onCreateOrUpdateClient,
        setHandleClientOpen,
        isCreating,
        isUpdating,
        updatedClient,
        createdClient,
        clientList,
        onEditClient,
        refetchClients,
        onDeleteClient,
    };
};
