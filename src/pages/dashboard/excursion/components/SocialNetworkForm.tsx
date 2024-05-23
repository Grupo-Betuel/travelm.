import React, { useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import {ISocialNetwork} from "../../../../models/ISocialNetwork";

interface SocialNetworkFormProps {
    onChange: (socialNetworks: ISocialNetwork[]) => void;
}

const SocialNetworkForm: React.FC<SocialNetworkFormProps> = ({ onChange }) => {
    const [socialNetworks, setSocialNetworks] = useState
    ([] as ISocialNetwork[]);

    const handleAddSocialNetwork = () => {
        setSocialNetworks((prevSocialNetworks) => [
            ...prevSocialNetworks,
            {
                type: 'instagram',
                username: '',
                url: '',
                company: '',
            },
        ]);
    };

    const handleChange = (index: number, field: string, value: string) => {
        setSocialNetworks((prevSocialNetworks) => {
            const updatedSocialNetworks = [...prevSocialNetworks];
            updatedSocialNetworks[index] = {
                ...updatedSocialNetworks[index],
                [field]: value,
            };
            return updatedSocialNetworks;
        });
    };

    const handleRemoveSocialNetwork = (index: number) => {
        setSocialNetworks((prevSocialNetworks) => {
            const updatedSocialNetworks = [...prevSocialNetworks];
            updatedSocialNetworks.splice(index, 1);
            return updatedSocialNetworks;
        });
    };

    const handleSubmit = () => {
        onChange(socialNetworks);
    };

    return (
        <div className="space-y-4">
            {socialNetworks.map((socialNetwork, index) => (
                <div key={index} className="flex items-center space-x-4">
                    <Input
                        placeholder="Username"
                        value={socialNetwork.username}
                        onChange={(e) => handleChange(index, 'username', e.target.value)}
                    />
                    <Input
                        placeholder="URL"
                        value={socialNetwork.url}
                        onChange={(e) => handleChange(index, 'url', e.target.value)}
                    />
                    <Input
                        placeholder="Company"
                        value={socialNetwork.company}
                        onChange={(e) => handleChange(index, 'company', e.target.value)}
                    />
                    <Button color="red" onClick={() => handleRemoveSocialNetwork(index)}>Remove</Button>
                </div>
            ))}
            <Button color="blue" onClick={handleAddSocialNetwork}>Add Social Network</Button>
            <Button color="blue" onClick={handleSubmit}>Save Social Networks</Button>
        </div>
    );
};

export default SocialNetworkForm;
