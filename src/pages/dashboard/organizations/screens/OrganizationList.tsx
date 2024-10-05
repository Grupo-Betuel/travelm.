import {Avatar, Button, Card, CardBody, CardHeader, Tab, Typography} from "@material-tailwind/react";
import React, {useMemo} from "react";
import { useOrganizationHandler } from "@/hooks/useOrganizationHandler";
import {IOrganization, OrganizationTypesEnum} from "@/models/organizationModel";
import { IoReload } from "react-icons/io5";
import ProtectedElement from "../../../../components/ProtectedElement";
import {UserRoleTypes, UserTypes} from "@/models/interfaces/userModel";
import { useConfirmAction } from "@/hooks/useConfirmActionHook";
import { CommonConfirmActions, CommonConfirmActionsDataTypes } from "@/models/common";
import {DataTable, IDataTableColumn, IFilterOption} from "@/components/DataTable";
import {useAuth} from "@/context/authContext";

export const OrganizationList: React.FC = () => {
    const { user } = useAuth()
    const {
        organizationForm,
        toggleHandleOrganization,
        organizations,
        refetchOrganizations,
        onEditOrganization,
        onDeleteOrganization
    } = useOrganizationHandler({ query: {owner: user?.organization?._id} })

    const onConfirmAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IOrganization>) => {
        switch (type) {
            case 'delete':
                onDeleteOrganization(data as IOrganization);
                break;
        }
    };

    const onDeniedAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IOrganization>) => {

    };

    const {
        handleSetActionToConfirm,
        ConfirmDialog
    } = useConfirmAction<CommonConfirmActions, CommonConfirmActionsDataTypes<IOrganization>>(onConfirmAction, onDeniedAction);

    const filterOptions: IFilterOption<IOrganization>[] = useMemo(() => [
        {
            key: 'type',
            label: 'Filtrar por Tipo',
            type: 'select',
            options: Object.values(OrganizationTypesEnum).map(type => ({
                label: type,
                value: type
            }))
        },
        {
            key: 'name',
            label: 'Filtrar por Nombre',
            type: 'select',
            options: Array.from(new Set(organizations.map(org => org.name))).map(name => ({
                label: name,
                value: name
            }))
        },
        // {
        //     key: 'contact',
        //     label: 'Filtrar por Email',
        //     type: 'select',
        //     options: Array.from(new Set(organizations.map(org => org.contact.email))).map(email => ({
        //         label: email,
        //         value: email
        //     }))
        // },
    ], [organizations]);

    const columns: IDataTableColumn<IOrganization>[] = [
        { key: 'logo', label: 'Logo' },
        { key: 'name', label: 'Nombre' },
        { key: 'contact.email', label: 'Email' },
        { key: 'type', label: 'Tipo' },
        { key: 'actions', label: 'Acciones' }
    ];

    const renderRow = (organization: IOrganization) => {
        const { logo, name, contact, type } = organization;
        return (
            <tr key={organization._id}>
                <td className="py-3 px-5">
                    <div className="flex items-center gap-4">
                        <Avatar src={logo?.content} alt={name} size="sm" variant="rounded" />
                    </div>
                </td>
                <td className="py-3 px-5">
                    <Typography variant="small" color="blue-gray" className="font-semibold">
                        {name}
                    </Typography>
                </td>
                <td className="py-3 px-5">
                    <Typography className="text-xs font-normal text-blue-gray-500">
                        {contact?.email}
                    </Typography>
                </td>
                <td className="py-3 px-5">
                    <Typography className="text-xs font-semibold text-blue-gray-600">
                        {type}
                    </Typography>
                </td>
                <td className="py-3 px-5">
                    <div className="flex items-center gap-2">
                        <Button color="blue" size="sm" onClick={() => onEditOrganization(organization)}>
                            Editar
                        </Button>
                        <Button
                            color="red"
                            size="sm"
                            onClick={() => handleSetActionToConfirm('delete')(organization)}
                        >
                            Eliminar
                        </Button>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div>
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between">
                    <div className="flex items-center">
                        <Typography variant="h4" color="white">
                            Organizaciones
                        </Typography>
                        <Button variant="text" color="white" onClick={refetchOrganizations}>
                            <IoReload className="w-[18px] h-[18px] cursor-pointer"/>
                        </Button>
                    </div>
                    <ProtectedElement roles={[UserRoleTypes.ADMIN]}>
                        <Button color="blue" onClick={toggleHandleOrganization}>Crear Organización</Button>
                    </ProtectedElement>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-2 pt-4 pb-2">
                    <DataTable
                        data={organizations}
                        columns={columns}
                        filterOptions={filterOptions}
                        renderRow={renderRow}
                    />
                </CardBody>
            </Card>
            {organizationForm}
            <ConfirmDialog />
        </div>
    );
};
