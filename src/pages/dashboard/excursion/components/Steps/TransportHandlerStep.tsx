import React, {useEffect} from "react";
import OrganizationHandler from "../OrganizationHandler";
import {IExcursion} from "@/models/excursionModel";
import {IOrganization, OrganizationTypesEnum} from "@/models/organizationModel";
import TransportResourceHandler from "../TransportResourceHandler";
import {ITransportResource} from "@/models/transportResourcesModel";

export interface ITransportHandlerStepProps {
    excursionData: IExcursion;
    updateExcursion: (excursion: Partial<IExcursion>) => void;
    setIsValid: (isValid: boolean) => void;

}

export const TransportHandlerStep = (
    {
        excursionData,
        updateExcursion,
        setIsValid
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

    const TransportData = excursionData.transport?.transportResources;

    const validateTransportStep = () => {
        const hasTransportResources = Array.isArray(TransportData) && TransportData.length > 0;
        const hasSelectedOrganization = Boolean(excursionData.transport?.organization);
        return hasTransportResources && hasSelectedOrganization;
    };

    useEffect(() => {
        const isValid = validateTransportStep();
        setIsValid(isValid);
    }, [TransportData]);

    useEffect(() => {
        console.log("Datos", TransportData);
    }, [TransportData]);


    return (
        <div>
            <h1>Transport Organization</h1>
            <OrganizationHandler
                // setIsValid={setIsValid}
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
