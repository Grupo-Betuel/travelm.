import {Avatar, Button, Card, CardBody, CardHeader, Typography} from "@material-tailwind/react";
import React from "react";
import {useOrganizationHandler} from "../../../../hooks/useOrganizationHandler";
import {IClient} from "@/models/clientModel";
import {IoReload} from "react-icons/io5";
import ProtectedElement from "../../../../components/ProtectedElement";
import {UserRoleTypes} from "../../../../models/interfaces/userModel";
import {useClientHandler} from "@/hooks/useClientHandler";
import {BiUser} from "react-icons/bi";

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

    console.log('client', clientList);
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
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                        <tr>
                            {["","Telefono", "Nombre","Apellido", "Email", "Acciones"].map((el) => (
                                <th
                                    key={el}
                                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                                >
                                    <Typography
                                        variant="small"
                                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                                    >
                                        {el}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {clientList?.map(
                            (client: IClient, key: number) => {
                                const className = "py-3 px-5";
                                const { phone, firstName,lastName, email} = client;

                                return (
                                    <tr key={`${firstName}-${key}`}>
                                        <td className={className}>
                                            <div className="flex items-center gap-4">
                                                <BiUser className="w-6 h-6"/>
                                            </div>
                                        </td>
                                        <td className={className}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-semibold w-28"
                                            >
                                                {phone}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-semibold w-28"
                                            >
                                                {firstName}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {lastName}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                {email}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <div className="flex items-center gap-2">
                                                <Button color="blue" size="sm"
                                                        onClick={() => onEditClient(client)}>Editar</Button>
                                                <Button color="red" size="sm"
                                                        onClick={() => onDeleteClient(client)}>Eliminar</Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                        </tbody>
                    </table>
                </CardBody>
            </Card>
            {clientForm}
        </div>
    );
}
