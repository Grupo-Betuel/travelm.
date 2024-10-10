import React, {useEffect, useMemo, useState} from "react";
import {
    Button,
} from "@material-tailwind/react";

import {IOrganization, OrganizationTypesEnum} from "../../../../models/organizationModel";
import SearchableSelect from "../../../../components/SearchableSelect";
import {OrganizationCard} from "./OrganizationCard";
import {useOrganizationHandler} from "../../../../hooks/useOrganizationHandler";

export interface IOrganizationSelectorProps {
    onSelect: (selected: IOrganization[]) => void;
    selected?: IOrganization[];
    isMultiple?: boolean;
    organizationType?: OrganizationTypesEnum;
    setIsValid?: (isValid: boolean) => void;
}

const OrganizationHandler: React.FC<IOrganizationSelectorProps> = (
    {
        onSelect,
        isMultiple,
        selected,
        organizationType,
        setIsValid,
    }) => {

    const {
        organizationForm,
        toggleHandleOrganization,
        setSelectedOrganization,
        organizations,
        setHandleOrganizationOpen,
        onEditOrganization,
    } = useOrganizationHandler({
        onSelect, selected, query: organizationType ? {type: organizationType} : {},
    });

    const handleOnSelectOrganization = (selectedValues: IOrganization[]) => {
        // Handle organization selection
        // const selectedOrganization = (organizations || []).filter((organization) => selectedValues.includes(organization._id || ''));
        onSelect(selectedValues);
    }

    useEffect(() => {
        if (setIsValid) {
            setIsValid(!!selected?.length);
        }
    }, [selected]);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 w-100">
                <SearchableSelect<IOrganization>
                    onSelect={handleOnSelectOrganization}
                    options={organizations || []}
                    label="Select Organization"
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
                <div className="flex space-x-2 gap-3 overflow-auto p-4 py-10 h-auto">
                    {selected?.map((entity, index) => (
                        <OrganizationCard
                            onEdit={onEditOrganization}
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
