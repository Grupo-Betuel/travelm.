import React, {useEffect} from "react";
import OrganizationHandler from "../OrganizationHandler";
import {IExcursion} from "../../../../../models/excursionModel";
import {OrganizationCard} from "../OrganizationCard";
import {IOrganization} from "../../../../../models/organizationModel";

export interface IOrganizationsDestinationsStepProps {
    excursionData: IExcursion;
    updateExcursion: (excursion: Partial<IExcursion>) => void;
    type?: 'destinations' | 'organizations';
}

export const OrganizationsDestinationsStep = (
    {
        excursionData,
        updateExcursion,
        type
    }: IOrganizationsDestinationsStepProps = {type: 'organizations'} as IOrganizationsDestinationsStepProps) => {
    const [selectedOrganizations, setSelectedOrganizations] = React.useState<IOrganization[]>([]);

    const onSelectOrganization = (organizations: IOrganization[]) => {
        setSelectedOrganizations(organizations);
        updateExcursion({[type || 'organizations']: organizations});
    }

    useEffect(() => {
        setSelectedOrganizations(excursionData[type || 'organizations'] || []);
    }, [excursionData])

    return (
        <div>
            <h1>Organizations</h1>
            <OrganizationHandler
                isMultiple={true}
                onSelect={onSelectOrganization}
                selected={selectedOrganizations}
            />
        </div>
    );
}