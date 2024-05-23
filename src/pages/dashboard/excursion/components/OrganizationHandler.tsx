import React, {useMemo, useState} from "react";
import {
    Button,
} from "@material-tailwind/react";

import {IOrganization} from "../../../../models/organizationModel";
import SearchableSelect from "../../../../components/SearchableSelect";

import {useGCloudMediaHandler} from "../../../../hooks/useGCloudMedediaHandler";
import {getCrudService} from "../../../../api/services/CRUD.service";
import {IMedia, IMediaFile} from "../../../../models/mediaModel";
import {OrganizationForm} from "./OrganizationForm";
import {OrganizationCard} from "./OrganizationCard";

export interface IOrganizationSelectorProps {
    onSelect: (selected: IOrganization[]) => void;
    selected?: IOrganization[];
    isMultiple?: boolean;
}

const organizationService = getCrudService('organizations');
const OrganizationHandler: React.FC<IOrganizationSelectorProps> = (
    {
        onSelect,
        isMultiple,
        selected
    }) => {
    const [addOrganization, {
        isLoading: isCreating,
        data: createdOrganization
    }] = organizationService.useAddOrganizations();
    const [updateOrganizationData, {
        isLoading: isUpdating,
        data: updatedOrganization
    }] = organizationService.useUpdateOrganizations();
    const {uploadMultipleMedias, uploadSingleMedia, deleteMedias} = useGCloudMediaHandler()
    const {data: organizations} = organizationService.useFetchAllOrganizations();
    const [selectedOrganization, setSelectedOrganization] = useState<IOrganization | undefined>(undefined);

    const onCreateOrganization = async (formData: IOrganization) => {
        const medias = await uploadMultipleMedias(formData.medias as IMediaFile[]);
        const logoData: IMediaFile = {
            ...formData.logo as IMediaFile,
            title: formData.name,
        }
        const logo = await uploadSingleMedia(logoData) as IMedia;
        const {data} = await addOrganization({
            ...formData,
            logo,
            medias,
        });

        if (data) {
            const selectedData = [...(selected || []), data as IOrganization];
            onSelect(selectedData);
            toggleHandleOrganization();
        } else {
            // Handle error
            console.log('Error creating organization');
        }

    }

    const onUpdateOrganization = async (formData: Partial<IOrganization>) => {
        // const mediasToDelete = formData.medias.filter(media => media.content.split('/').pop());
        // const deletedMedias = await deleteMedias(mediasToDelete);
        // console.log('Deleted Medias', deletedMedias);
        // TODO: check what are the new medias
        // const mediasToUpdate = []
        // const medias = await uploadMultipleMedias(mediasToUpdate);
        if (formData._id) {
            const {data} = await updateOrganizationData({
                _id: formData._id,
                ...formData,
                // medias,
            });

            if (data) {
                const selectedData = (selected || []).map((organization) => {
                    if (organization._id === data._id) {
                        return data;
                    }
                    return organization;
                });

                onSelect(selectedData);
            } else {
                // Handle error
                console.log('Error creating organization');
            }
        } else {
            console.error('Organization Id is missing');
        }
    }

    const options = [
        {label: "Option 1", value: "1"},
        {label: "Option 2", value: "2"},
        {label: "Option 3", value: "3"},
        // Add more options as needed
    ];

    const organizationOptions = useMemo(() => (organizations || []).map((organization) => ({
        label: organization.name,
        value: organization._id || '',
    })), [organizations]);

    const handleOnSelectOrganization = (selectedValues: string[]) => {
        // Handle organization selection
        const selectedOrganization = (organizations || []).filter((organization) => selectedValues.includes(organization._id || ''));

        onSelect(selectedOrganization);
    }

    const [isNewOrganizationOpen, setHandleOrganizationOpen] = useState(false);
    const toggleHandleOrganization = () => {
        setHandleOrganizationOpen(!isNewOrganizationOpen)
        setSelectedOrganization(undefined);
    };


    const onClickSelectedOrganization = (organization: IOrganization) => {
        setSelectedOrganization(organization);
        setHandleOrganizationOpen(true);
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 w-100">
                <SearchableSelect
                    onSelect={handleOnSelectOrganization}
                    options={organizationOptions}
                    label="Select Organiazation"
                    multiple={isMultiple}
                    selectedValues={selected?.map((organization) => organization._id || '') || []}
                />
                <div className="flex items-center justify-between">
                    <Button color="blue" onClick={toggleHandleOrganization}>Create</Button>
                </div>
            </div>

            <OrganizationForm
                organizationData={selectedOrganization}
                dialog={{
                    open: isNewOrganizationOpen,
                    handler: toggleHandleOrganization
                }}
                onCreate={onCreateOrganization}
                onUpdate={onUpdateOrganization}
            />

            {selected && selected.length &&
                <div className="flex justify-around gap-3 !overflow-x-scroll p-4 py-10 h-[400px]">
                    {selected?.map((entity, index) => (
                        <OrganizationCard
                            onClick={onClickSelectedOrganization}
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
