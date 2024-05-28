import {IOrganization} from "../models/organizationModel";
import {IMedia, IMediaFile} from "../models/mediaModel";
import {useGCloudMediaHandler} from "./useGCloudMedediaHandler";
import React, {useState} from "react";
import {getCrudService} from "../api/services/CRUD.service";
import {OrganizationForm} from "../pages/dashboard/excursion/components/OrganizationForm";

export interface IOrganizationHandlerProps {
    onSelect?: (selected: IOrganization[]) => void;
    selected?: IOrganization[];
}

const organizationService = getCrudService('organizations');

export const useOrganizationHandler = ({onSelect, selected}: IOrganizationHandlerProps) => {
    const [addOrganization, {
        isLoading: isCreating,
        data: createdOrganization
    }] = organizationService.useAddOrganizations();

    const [deleteOrganization, {
        isLoading: isDeleting,
        data: deletedOrganization
    }] = organizationService.useDeleteOrganizations();
    const [updateOrganizationData, {
        isLoading: isUpdating,
        data: updatedOrganization
    }] = organizationService.useUpdateOrganizations();
    const {data: organizations, refetch: refetchOrganizations} = organizationService.useFetchAllOrganizations();

    const [isNewOrganizationOpen, setHandleOrganizationOpen] = useState(false);
    const toggleHandleOrganization = () => {
        setHandleOrganizationOpen(!isNewOrganizationOpen)
        setSelectedOrganization(undefined);
    };

    const {uploadMultipleMedias, uploadSingleMedia, deleteMedias} = useGCloudMediaHandler()

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
            onSelect && onSelect(selectedData);
            toggleHandleOrganization();
        } else {
            // Handle error
            console.log('Error creating organization');
        }

        return data;
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

                onSelect && onSelect(selectedData);
            } else {
                // Handle error
                console.log('Error creating organization');
            }
            return data;
        } else {
            console.error('Organization Id is missing');
        }

    }

    const onDeleteOrganization = async (organization: IOrganization) => {
        if (!organization._id) {
            // TODO: toast error
            console.error('Organization Id is missing');
            return;
        }
        const {data} = await deleteOrganization(organization._id as string);
        if (data) {
            const selectedData = (selected || []).filter((selectedOrganization) => selectedOrganization._id !== organization._id);
            onSelect && onSelect(selectedData);
        } else {
            // Handle error
            console.log('Error deleting organization');
        }
    }

    const onEditOrganization = (organization: IOrganization) => {
        setSelectedOrganization(organization);
        setHandleOrganizationOpen(true);
    }


    const organizationForm = (
        <OrganizationForm
            organizationData={selectedOrganization}
            dialog={{
                open: isNewOrganizationOpen,
                handler: toggleHandleOrganization
            }}
            onCreate={onCreateOrganization}
            onUpdate={onUpdateOrganization}
        />
    )

    return {
        organizationForm,
        toggleHandleOrganization,
        setSelectedOrganization,
        onCreateOrganization,
        onUpdateOrganization,
        setHandleOrganizationOpen,
        isCreating,
        isUpdating,
        updatedOrganization,
        createdOrganization,
        organizations,
        onEditOrganization,
        refetchOrganizations,
        onDeleteOrganization,
    }
}