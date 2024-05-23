import React from 'react';
import { Button, Input } from '@material-tailwind/react';
import { IExcursionForm, IUpdateFormData } from './interfaces';

interface ClientsProps {
    formData: IExcursionForm;
    updateFormData: IUpdateFormData;
}

export const ClientHandler: React.FC<ClientsProps> = ({ formData, updateFormData }) => {
    const addClient = () => {
        const newClient = { name: 'New Client', email: 'client@example.com' }; // Simplified example
        const updatedClients = formData.clients ? [...formData.clients, newClient] : [newClient];
        updateFormData({ clients: updatedClients });
    };

    return (
        <div>
            <Button color="green" onClick={addClient}>Add Client</Button>
            <div>
                {formData.clients && formData.clients.map((client, index) => (
                    <p key={index}>{client.name} - {client.email}</p>
                ))}
            </div>
        </div>
    );
};

