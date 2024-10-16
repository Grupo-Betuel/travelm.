import React, {useEffect} from "react";
import OrganizationHandler from "../OrganizationHandler";
import {IExcursion} from "../../../../../models/excursionModel";
import {OrganizationCard} from "../OrganizationCard";
import {IOrganization} from "../../../../../models/organizationModel";
import {Typography} from "@material-tailwind/react";
import {useForm} from "react-hook-form";

export interface IOrganizationsDestinationsStepProps {
    excursionData: IExcursion;
    updateExcursion: (excursion: Partial<IExcursion>) => void;
    type?: 'destinations' | 'organizations';
    setIsValid: (isValid: boolean) => void;
}

export const OrganizationsDestinationsStep = (
    {
        excursionData,
        updateExcursion,
        type,
        setIsValid,
    }: IOrganizationsDestinationsStepProps = {type: 'organizations'} as IOrganizationsDestinationsStepProps) => {
    const [selectedOrganizations, setSelectedOrganizations] = React.useState<IOrganization[]>([]);
    const onSelectOrganization = (organizations: IOrganization[]) => {
        setSelectedOrganizations(organizations);
        updateExcursion({[type || 'organizations']: organizations});
    }

    useEffect(() => {
        setSelectedOrganizations(excursionData[type || 'organizations'] || []);
    }, [excursionData, type])

    return (
        <div>
            <Typography
                className="ml-1 mb-2"
                variant="h6"
                color="blue-gray"
            >
                {type === 'destinations' ? 'Destinations' : 'Organizations'}
            </Typography>
            <OrganizationHandler
                setIsValid={setIsValid}
                isMultiple={true}
                onSelect={onSelectOrganization}
                selected={selectedOrganizations}
            />
        </div>
    );
}
