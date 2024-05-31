import React, {useEffect, useState} from 'react';
import {Input, Button, Dialog, DialogHeader, DialogBody, DialogFooter, Select, Option} from "@material-tailwind/react";
import InputMask from "react-input-mask";
import {getCrudService} from "../../../../api/services/CRUD.service";
import {ICustomComponentDialog} from "../../../../models/common";
import IUser, {UserRoleTypes} from "../../../../models/interfaces/userModel";

interface UserFormProps {
    initialUser?: IUser;
    onSubmit: (user: IUser) => void;
    role?: UserRoleTypes;
    dialog?: ICustomComponentDialog;
}

const emptyUser: IUser = {
    firstName: '',
    lastName: '',
    phone: '',
    role: 'employee',
    organization: '',
    type: 'organization'
};

const userService = getCrudService('travelUsers');

const UserForm: React.FC<UserFormProps> = ({initialUser, role, onSubmit, dialog}) => {
    const initialUserData = (initialUser || emptyUser);
    const [user, setUser] = useState<IUser>({
        ...initialUserData,
        role: role || (initialUserData?.role || 'employee'),
    });

    const {data: existingUsers} = userService.useFetchAllTravelUsers({phone: user?.phone}, {skip: (user?.phone?.length || 0) < 11});

    const handleChange = ({target: {value, name, type}}: React.ChangeEvent<HTMLInputElement>) => {
        if (type === 'tel') {
            value = value.replace(/[^0-9]/g, '');
            if (value === '1') return;
        }

        setUser({...user, [name]: value});
    };

    useEffect(() => {
        if (initialUser) {
            const data = initialUser || emptyUser
            setUser({
                ...data,
                role: role || data.role,
            });
        }
    }, [initialUser]);

    useEffect(() => {
        if (existingUsers?.length && user.phone?.length === 11) {
            const foundUser = existingUsers[0];
            foundUser && setUser(foundUser);
        } else if (user.phone?.length === 11) {
            setUser({...emptyUser, _id: undefined, phone: user.phone});
        }
    }, [existingUsers, user.phone]);

    const form = (
        <div className="p-4 flex flex-col gap-3">
            <InputMask
                mask="+1 (999) 999-9999"
                name="phone"
                type="tel"
                value={user.phone}
                onChange={handleChange}
                maskPlaceholder={null}
                alwaysShowMask={false}
            >
                {
                    ((inputProps: any) => (
                        <Input
                            {...(inputProps as any)}
                            type="tel"
                            label="Teléfono"
                        />
                    ) as any) as any}
            </InputMask>
            <Input
                label="Nombre"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
            />
            <Input
                label="Apellido"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
            />
            <Input
                label="Email"
                name="email"
                type="email"
                value={user.email}
                onChange={handleChange}
            />
            <Input
                label={`${user._id ? 'Cambiar' : ''} Contraseña`}
                name="password"
                type="password"
                value={user.password}
                onChange={handleChange}
            />

            <div className="flex gap-3">
                {!role && <Select
                    label="Rol"
                    name="role"
                    value={user.role}
                    onChange={(v) => handleChange({target: {value: v as string, name: 'role'}} as any)}
                >
                    {['admin', 'employee'].map((role) => (
                        <Option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </Option>
                    ))}
                </Select>}
                {/*<Select*/}
                {/*    label="Tipo"*/}
                {/*    name="type"*/}
                {/*    value={user.type}*/}
                {/*    onChange={(v) => handleChange({target: {value: v as string, name: 'type'}} as any)}*/}
                {/*>*/}
                {/*    {['organization', 'agency'].map((type) => (*/}
                {/*        <Option key={type} value={type}>*/}
                {/*            {type.charAt(0).toUpperCase() + type.slice(1)}*/}
                {/*        </Option>*/}
                {/*    ))}*/}
                {/*</Select>*/}
            </div>
            {!dialog && <Button
                color="blue"
                onClick={() => onSubmit(user)}
                className="mt-4"
            >
                {!!existingUsers?.length ? 'Actualizar' : 'Agregar'}
            </Button>}
        </div>
    );

    const dialogHandler = () => {
        dialog?.handler && dialog.handler();
        setUser(emptyUser);
    };

    return (
        dialog ?
            <Dialog open={dialog.open} handler={dialogHandler}>
                <DialogHeader className="justify-between">
                    {user._id ? 'Editar Usuario' : 'Agregar Usuario'}
                </DialogHeader>
                <DialogBody className="overflow-y-scroll max-h-[80dvh]">
                    {form}
                </DialogBody>
                <DialogFooter className="flex items-center justify-between">
                    <Button
                        variant="text"
                        size="lg"
                        color="red"
                        onClick={dialogHandler}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="text"
                        size="lg"
                        color="blue"
                        onClick={() => onSubmit(user)}
                    >
                        {!!existingUsers?.length ? 'Actualizar' : 'Agregar'}
                    </Button>
                </DialogFooter>
            </Dialog>
            : form
    );
};

export default UserForm;
