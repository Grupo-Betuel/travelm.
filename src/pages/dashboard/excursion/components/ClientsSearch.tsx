import React, {useMemo} from "react";
import SearchableSelect, {IOption} from "../../../../components/SearchableSelect";
import {Typography} from "@material-tailwind/react";
import {getCrudService} from "../../../../api/services/CRUD.service";

const clientService = getCrudService('travelClients');
export const ClientsSearch = () => {
    const {data: clients, isLoading: isLoadingClients,} = clientService.useFetchAllTravelClients();
    const handleOnSelectClient = (selected: any) => {

    }

    const clientOptions: IOption[] = useMemo(() => {
        return clients?.map((client) => ({
            label: `${client.firstName} ${client.lastName}`,
            value: client._id || ''
        })) || [];
    }, [clients]);

    return (
        <div>
            <SearchableSelect
                onSelect={handleOnSelectClient}
                options={clientOptions}
                label="Select Organiazation"
                multiple={true}

            />
        </div>
    )
}