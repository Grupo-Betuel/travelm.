import React, { useState } from "react";
import {
    Button,
    Input,
    Typography,
    Select,
    Option,
} from "@material-tailwind/react";
import { ISocialNetwork } from "@/models/ISocialNetwork";

interface SocialNetworkFormProps {
    socialNetworks: ISocialNetwork[];
    updateSocialNetworks: (socialNetworks: ISocialNetwork[]) => void;
}

const emptySocialNetwork: ISocialNetwork = {
    type: "instagram",
    username: "",
    url: "",
    company: "",
};

const SocialNetworkForm: React.FC<SocialNetworkFormProps> = ({
                                                                 socialNetworks,
                                                                 updateSocialNetworks,
                                                             }) => {
    const [socialNetworkForm, setSocialNetworkForm] =
        useState<ISocialNetwork>(emptySocialNetwork);
    const [editSocialNetworkIndex, setEditSocialNetworkIndex] =
        useState<number | null>(null);

    // Función para limpiar el formulario
    const cleanSocialNetworkHandler = () => {
        setSocialNetworkForm(emptySocialNetwork);
        setEditSocialNetworkIndex(null);
    };

    // Agregar o actualizar redes sociales
    const handleAddOrUpdateSocialNetworks = () => {
        if (editSocialNetworkIndex !== null) {
            // Editar red social existente
            const updatedSocialNetworks = socialNetworks.map((sn, idx) =>
                idx === editSocialNetworkIndex ? socialNetworkForm : sn
            );
            updateSocialNetworks(updatedSocialNetworks);
        } else {
            // Añadir nueva red social
            updateSocialNetworks([...socialNetworks, socialNetworkForm]);
        }
        cleanSocialNetworkHandler();
    };

    // Cambiar los valores de la red social
    const handleOnChangeNetworks = ({
                                        target: { name, value },
                                    }: React.ChangeEvent<HTMLInputElement>) => {
        setSocialNetworkForm({ ...socialNetworkForm, [name]: value });
    };

    // Cambiar la red social para edición
    const editSocialNetworksMode = (index: number) => {
        setSocialNetworkForm(socialNetworks[index]);
        setEditSocialNetworkIndex(index);
    };

    // Agregar una nueva red social al estado
    const handleAddSocialNetwork = () => {
        // Verifica si hay datos en los campos
        if (!socialNetworkForm.username || !socialNetworkForm.url) {
            alert("Por favor, completa los campos antes de agregar.");
            return;
        }

        // Añadir la nueva red social a la lista
        updateSocialNetworks([...socialNetworks, socialNetworkForm]);

        // Limpiar el formulario después de añadir
        cleanSocialNetworkHandler();
    };

    // Manejar la cancelación del formulario
    const handleCancel = () => {
        cleanSocialNetworkHandler();
    };

    // Manejar la eliminación de una red social
    const handleDeleteSocialNetwork = (index: number) => {
        const updatedSocialNetworks = socialNetworks.filter(
            (_, idx) => idx !== index
        );
        updateSocialNetworks(updatedSocialNetworks);
    };

    return (
        <div className="space-y-4">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    value={socialNetworkForm.type}
                    onChange={(value) =>
                        handleOnChangeNetworks({ target: { name: "type", value } } as any)
                    }
                    label="Select Network"
                    className="col-span-2 md:col-span-1" // Full width on small screens, half on medium and larger screens
                >
                    {["instagram", "facebook", "twitter"].map((type) => (
                        <Option key={type} value={type}>
                            {type}
                        </Option>
                    ))}
                </Select>
                <Input
                    label="Username"
                    name="username"
                    value={socialNetworkForm.username}
                    onChange={handleOnChangeNetworks}
                    className="col-span-2 md:col-span-1" // Full width on small screens, half on medium and larger screens
                />
                <Input
                    label="URL"
                    name="url"
                    value={socialNetworkForm.url}
                    onChange={handleOnChangeNetworks}
                    className="col-span-2 md:col-span-1" // Full width on small screens, half on medium and larger screens
                />
                <Input
                    label="Company"
                    name="company"
                    value={socialNetworkForm.company}
                    onChange={handleOnChangeNetworks}
                    className="col-span-2 md:col-span-1" // Full width on small screens, half on medium and larger screens
                />
                <Button
                    color="blue"
                    onClick={handleAddSocialNetwork}
                    disabled={!socialNetworkForm.username || !socialNetworkForm.url}
                    className="col-span-2 md:col-span-1 " // Full width on small screens, right-aligned on medium and larger screens
                >
                    {editSocialNetworkIndex !== null ? "Update" : "Add Social Network"}
                </Button>
                <Button
                    color="red"
                    onClick={handleCancel}
                    disabled={!socialNetworkForm.username && !socialNetworkForm.url}
                    className="col-span-2 md:col-span-1 md:col-start-2" // Full width on small screens, right-aligned on medium and larger screens
                >
                    Cancel
                </Button>
            </div>

            <div className="grid gap-y-6 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
                {socialNetworks.map((socialNetwork, index) => (
                    <div key={index} className="mt-2 bg-gray-100 rounded-xl p-4">
                        <Typography variant="h6">{socialNetwork.type}</Typography>
                        <Typography variant="h6">{socialNetwork.username}</Typography>
                        <Typography variant="h6" className="truncate">
                            {socialNetwork.url}
                        </Typography>
                        <Typography variant="h6">{socialNetwork.company}</Typography>
                        <div className="flex space-x-4 mt-2">
                            <Button
                                color="red"
                                onClick={() => handleDeleteSocialNetwork(index)}
                            >
                                Delete
                            </Button>
                            <Button
                                color="blue"
                                onClick={() => editSocialNetworksMode(index)}
                            >
                                Edit
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SocialNetworkForm;
