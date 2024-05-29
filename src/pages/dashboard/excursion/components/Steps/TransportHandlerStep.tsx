import React from "react";
import OrganizationHandler from "../OrganizationHandler";
import {IExcursion} from "../../../../../models/excursionModel";
import {OrganizationCard} from "../OrganizationCard";
import {IOrganization} from "../../../../../models/organizationModel";
import {FinanceHandler} from "../FinanceHandler";
import {IFinance} from "../../../../../models/financeModel";
import BusHandler from "../BusesHandler";
import {IBus} from "../../../../../models/busesModel";

export interface ITransportHandlerStepProps {
    excursionData: IExcursion;
    updateExcursion: (excursion: Partial<IExcursion>) => void;
}

export const TransportHandlerStep = ({
                                         excursionData,
                                         updateExcursion,
                                     }: ITransportHandlerStepProps) => {
    const [selectedOrganizations, setSelectedOrganizations] = React.useState<IOrganization[]>([]);
    const onSelectOrganization = (organizations: IOrganization[]) => {
        setSelectedOrganizations(organizations);
        updateExcursion({
            transport: {
                ...excursionData.transport,
                organization: organizations[0]
            }
        });
    }

    // const handleTransportFinance = (finance: IFinance) => {
    //     updateExcursion({
    //         transport: {
    //             ...excursionData?.transport,
    //             finance
    //         }
    //     });
    // }

    const handleUpdateBuses = (buses: IBus[]) => updateExcursion({ transport: { ...excursionData.transport, buses }})

    return (
        <div>
            <h1>Transport Organization</h1>
            <OrganizationHandler onSelect={onSelectOrganization}/>
            {
                excursionData?.transport?.organization &&
                <div className="flex justify-around gap-3 !overflow-x-scroll p-4 py-10 h-[400px]">
                    <OrganizationCard
                        className={`min-w-[450px]`}
                        organization={excursionData.transport.organization}
                    />
                </div>
            }
            <BusHandler
                buses={excursionData.transport?.buses || []}
                updateBuses={handleUpdateBuses}
            />
        </div>
    );
}

// <h2>Transport Finance</h2>
// <FinanceHandler finance={excursionData?.transport?.finance} updateFinance={handleTransportFinance}/>