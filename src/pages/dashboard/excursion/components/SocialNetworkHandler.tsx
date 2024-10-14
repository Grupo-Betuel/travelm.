// SocialNetworkHandler.tsx
import React, { useState } from 'react';
import { Input, Button, Select, Option } from '@material-tailwind/react';
import {SocialNetworkModels} from "../../../../models/SocialNetworkModels";

interface SocialNetworkHandlerProps {
    socialNetworks: SocialNetworkModels[];
    onUpdateSocialNetworks: (socialNetworks: SocialNetworkModels[]) => void;
}

const SocialNetworkHandler: React.FC<SocialNetworkHandlerProps> = ({ socialNetworks, onUpdateSocialNetworks }) => {
    const [newSocialNetwork, setNewSocialNetwork] = useState<SocialNetworkModels>({
        type: 'instagram',
        username: '',
        url: '',
        company: '',
    });

    const handleChange = (field: keyof SocialNetworkModels, value: string) => {
        setNewSocialNetwork({ ...newSocialNetwork, [field]: value });
    };

    const addSocialNetwork = () => {
        onUpdateSocialNetworks([...socialNetworks, newSocialNetwork]);
        setNewSocialNetwork({ type: 'instagram', username: '', url: '', company: '' });
    };

    return (
        <div className="flex flex-col gap-4">
            <Select
                label="Network Type"
                value={newSocialNetwork.type}
                onChange={(e) => handleChange('type', e)}
            >
                {['facebook', 'instagram', 'twitter'].map(type => (
                    <Option key={type} value={type}>{type}</Option>
                ))}
            </Select>
            <Input
                label="Username"
                value={newSocialNetwork.username}
                onChange={(e) => handleChange('username', e.target.value)}
            />
            <Input
                label="URL"
                value={newSocialNetwork.url}
                onChange={(e) => handleChange('url', e.target.value)}
            />
            <Input
                label="Company"
                value={newSocialNetwork.company}
                onChange={(e) => handleChange('company', e.target.value)}
            />
            <Button onClick={addSocialNetwork} color="blue">
                Add Network
            </Button>
        </div>
    );
};

export default SocialNetworkHandler;
