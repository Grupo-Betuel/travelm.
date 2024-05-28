import {Avatar, Button, Card, CardBody, CardHeader, Typography} from "@material-tailwind/react";
import React from "react";
import {useOrganizationHandler} from "../../../../hooks/useOrganizationHandler";
import {IOrganization} from "../../../../models/organizationModel";
import {IoReload} from "react-icons/io5";
import ProtectedElement from "../../../../components/ProtectedElement";
import {UserRoleTypes} from "../../../../models/interfaces/user";

export const OrganizationList: React.FC = () => {
    const {
        organizationForm,
        toggleHandleOrganization,
        setSelectedOrganization,
        organizations,
        refetchOrganizations,
        onEditOrganization,
        onDeleteOrganization
    } = useOrganizationHandler({});

    return (
        <div>
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between">
                    <div className="flex items-center ">
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
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                        <tr>
                            {["Logo", "Nombre", "Email", "Tipo", "Acciones"].map((el) => (
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
                        {organizations?.map(
                            (organization: IOrganization, key: number) => {
                                const className = `py-3 px-5 ${
                                    key === organizations.length - 1
                                        ? ""
                                        : "border-b border-blue-gray-50"
                                }`;
                                const {logo, name, email, type} = organization;

                                return (
                                    <tr key={`${name}-${key}`}>
                                        <td className={className}>
                                            <div className="flex items-center gap-4">
                                                <Avatar src={logo?.content} alt={name} size="sm" variant="rounded"/>
                                            </div>
                                        </td>
                                        <td className={className}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-semibold"
                                            >
                                                {name}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                {email}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {type}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <div className="flex items-center gap-2">
                                                <Button color="blue" size="sm"
                                                        onClick={() => onEditOrganization(organization)}>Editar</Button>
                                                <Button color="red" size="sm"
                                                        onClick={() => onDeleteOrganization(organization)}>Eliminar</Button>
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
            {organizationForm}
        </div>
    );
}
