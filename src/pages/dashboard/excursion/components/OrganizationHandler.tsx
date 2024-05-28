import React, {useMemo, useState} from "react";
import {
    Button,
} from "@material-tailwind/react";

import {IOrganization} from "../../../../models/organizationModel";
import SearchableSelect from "../../../../components/SearchableSelect";
import {OrganizationCard} from "./OrganizationCard";
import {useOrganizationHandler} from "../../../../hooks/useOrganizationHandler";

export interface IOrganizationSelectorProps {
    onSelect: (selected: IOrganization[]) => void;
    selected?: IOrganization[];
    isMultiple?: boolean;
}

const OrganizationHandler: React.FC<IOrganizationSelectorProps> = (
    {
        onSelect,
        isMultiple,
        selected
    }) => {

    const {
        organizationForm,
        toggleHandleOrganization,
        setSelectedOrganization,
        organizations,
        setHandleOrganizationOpen,
        onEditOrganization,
    } = useOrganizationHandler({
        onSelect, selected
    });

    const organizationOptions = useMemo(() => (organizations || []).map((organization) => ({
        label: organization.name,
        value: organization._id || '',
    })), [organizations]);

    const handleOnSelectOrganization = (selectedValues: IOrganization[]) => {
        // Handle organization selection
        // const selectedOrganization = (organizations || []).filter((organization) => selectedValues.includes(organization._id || ''));
        onSelect(selectedValues);
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 w-100">
                <SearchableSelect<IOrganization>
                    onSelect={handleOnSelectOrganization}
                    options={organizations || []}
                    label="Select Organiazation"
                    multiple={isMultiple}
                    displayProperty={"name"}
                    selectedValues={selected}
                />
                <div className="flex items-center justify-between">
                    <Button color="blue" onClick={toggleHandleOrganization}>Create</Button>
                </div>
            </div>

            {organizationForm}


            {selected && !!selected.length &&
                <div className="flex justify-around gap-3 !overflow-x-scroll p-4 py-10 h-[400px]">
                    {selected?.map((entity, index) => (
                        <OrganizationCard
                            onClick={onEditOrganization}
                            className={`w-[250px]`}
                            key={`organization-${index}`}
                            organization={entity}
                        />
                    ))}
                </div>}

        </div>
    );
};

export default OrganizationHandler;
