import {Button, Card, CardBody, CardHeader, Typography} from "@material-tailwind/react";
import React, {useMemo} from "react";
import {IClient} from "@/models/clientModel";
import {IoReload} from "react-icons/io5";
import ProtectedElement from "../../../../components/ProtectedElement";
import {UserRoleTypes} from "@/models/interfaces/userModel";
import {useClientHandler} from "@/hooks/useClientHandler";
import {BiUser} from "react-icons/bi";
import {CommonConfirmActions, CommonConfirmActionsDataTypes} from "@/models/common";
import {IOrganization, OrganizationTypesEnum} from "@/models/organizationModel";
import {useConfirmAction} from "@/hooks/useConfirmActionHook";
import {DataTable, IDataTableColumn, IFilterOption} from "@/components/DataTable";
import clients from "@/pages/dashboard/clients/clients";

export const ClientsList: React.FC = () => {
    const {
        clientForm,
        toggleHandleClient,
        setSelectedClient,
        clientList,
        refetchClients,
        onEditClient,
        onDeleteClient
    } = useClientHandler({});

    const onConfirmAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IClient>) => {
        switch (type) {
            case 'delete':
                onDeleteClient(data as IClient);
                break;
        }
    };

    const onDeniedAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IClient>) => {

    };

    const {
        handleSetActionToConfirm,
        ConfirmDialog
    } = useConfirmAction<CommonConfirmActions, CommonConfirmActionsDataTypes<IClient>>(onConfirmAction, onDeniedAction);

    const filterOptions: IFilterOption<IClient>[] = useMemo(() => [
        {
            key: 'firstName',
            label: 'Filtrar por Nombre',
            type: 'select',
            options: Array.from(new Set(clientList.map(client => client.firstName))).map(firstName => ({
                label: firstName,
                value: firstName
            }))
        },
        {
            key: 'lastName',
            label: 'Filtrar por Apellido',
            type: 'select',
            options: Array.from(new Set(clientList.map(client => client.lastName))).map(lastName => ({
                label: lastName,
                value: lastName
            }))
        },
        {
            key: 'phone',
            label: 'Filtrar por Teléfono',
            type: 'select',
            options: Array.from(new Set(clientList.map(client => client.phone))).map(phone => ({
                label: phone,
                value: phone
            }))
        },
        {
            key: 'email',
            label: 'Filtrar por Email',
            type: 'select',
            options: Array.from(new Set(clientList.map(client => client.email))).map(email => ({
                label: email,
                value: email
            }))
        },
    ], [clientList]);

    const columns: IDataTableColumn<IClient>[] = [
        { key: 'icon', label: '' },
        { key: 'phone', label: 'Telefono' },
        { key: 'firstName', label: 'Nombre' },
        { key: 'lastName', label: 'Apellido' },
        { key: 'email', label: 'Email' },
        { key: 'actions', label: 'Acciones' }
    ];

    const renderRow = (client: IClient, key: number) => {
        const { phone, firstName, lastName, email } = client;
        return (
            <tr key={`${firstName}-${key}`}>
                <td className="py-3 px-5">
                    <div className="flex items-center gap-4">
                        <BiUser className="w-6 h-6"/>
                    </div>
                </td>
                <td className="py-3 px-5">
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold w-28"
                    >
                        {phone}
                    </Typography>
                </td>
                <td className="py-3 px-5">
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold w-28"
                    >
                        {firstName}
                    </Typography>
                </td>
                <td className="py-3 px-5">
                    <Typography className="text-xs font-semibold text-blue-gray-600">
                        {lastName}
                    </Typography>
                </td>
                <td className="py-3 px-5">
                    <Typography className="text-xs font-normal text-blue-gray-500">
                        {email}
                    </Typography>
                </td>
                <td className="py-3 px-5">
                    <div className="flex items-center gap-2">
                        <Button color="blue" size="sm" onClick={() => onEditClient(client)}>
                            Editar
                        </Button>
                        <Button
                            color="red"
                            size="sm"
                            onClick={() => handleSetActionToConfirm('delete')(client)}
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
                    <div className="flex items-center ">
                        <Typography variant="h4" color="white">
                            Clientes
                        </Typography>
                        <Button variant="text" color="white" onClick={refetchClients}>
                            <IoReload className="w-[18px] h-[18px] cursor-pointer"/>
                        </Button>
                    </div>
                    <ProtectedElement roles={[UserRoleTypes.ADMIN]}>
                        <Button color="blue" onClick={toggleHandleClient}>Crear Cliente</Button>
                    </ProtectedElement>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-2 pt-2 pb-2">
                    <DataTable
                        data={clientList}
                        columns={columns}
                        filterOptions={filterOptions}
                        renderRow={renderRow}
                    />
                </CardBody>
            </Card>
            {clientForm}
            <ConfirmDialog/>
        </div>
    );
}
