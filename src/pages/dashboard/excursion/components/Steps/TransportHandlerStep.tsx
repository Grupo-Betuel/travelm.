import React from "react";
import OrganizationHandler from "../OrganizationHandler";
import {IExcursion} from "@/models/excursionModel";
import {IOrganization, OrganizationTypesEnum} from "@/models/organizationModel";
import TransportResourceHandler from "../TransportResourceHandler";
import {ITransportResource} from "@/models/transportResourcesModel";

export interface ITransportHandlerStepProps {
    excursionData: IExcursion;
    updateExcursion: (excursion: Partial<IExcursion>) => void;
}

export const TransportHandlerStep = (
    {
        excursionData,
        updateExcursion,
    }: ITransportHandlerStepProps) => {
    const onSelectOrganization = (organizations: IOrganization[]) => {
        updateExcursion({
            transport: {
                ...excursionData.transport,
                organization: organizations[0]
            }
        });
    }

    const handleUpdateTransportResources = (transportResources: ITransportResource[]) => updateExcursion({
        transport: {
            ...excursionData.transport,
            transportResources
        }
    })

    return (
        <div>
            <h1>Transport Organization</h1>
            <OrganizationHandler
                isMultiple={false}
                organizationType={OrganizationTypesEnum.TRANSPORT}
                onSelect={onSelectOrganization}
                selected={excursionData.transport?.organization ? [excursionData.transport?.organization] : []}
            />
            <TransportResourceHandler transportResources={excursionData.transport?.transportResources || []}
                                      updateTransportResources={handleUpdateTransportResources}/>
        </div>
    );
}
