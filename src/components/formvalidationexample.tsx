// LoginScreen.tsx

import React from 'react';
import {
    Button,
    Input,
    Typography,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
} from '@material-tailwind/react';
import {useForm, SubmitHandler, ValidationRule} from 'react-hook-form';
import getFormValidatorClassNames, {FormValidatorEntityType} from "@/utils/form-validator.utils";
import FormControl from "@/components/FormControl";
import SelectControl from "@/components/SelectControl";
import RadioControl from "@/components/RadioControl";
import DatePicker from "@/components/DatePicker";
import InputMask from "react-input-mask";
import {IMaskInput} from "@/models/interfaces/InputMask.interfaces";


const roles = [
    {label: 'Administrador', value: 'admin'},
    {label: 'Usuario', value: 'user'},
    {label: 'Invitado', value: 'guest'},
];
const genders = [
    {label: 'Masculino', value: 'male'},
    {label: 'Femenino', value: 'female'},
    {label: 'Otro', value: 'other'},
];

const LoginScreen = () => {

    const {
        control,
        handleSubmit,
    } = useForm<any>({mode: 'all'});

    const onSubmit: SubmitHandler<any> = (data) => {
        console.log(data);
        // login(data);
    };


    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader
                    color="blue"
                    className="flex items-center justify-center py-4"
                >
                    <Typography variant="h4" color="white">
                        Welcome
                    </Typography>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardBody>
                        <FormControl
                            name="username"
                            control={control}
                            label="Username"
                            rules={{
                                required: 'Username is required',
                                minLength: {value: 3, message: 'Minimum length is 3'},
                            }}
                        />
                        <FormControl
                            name="password"
                            control={control}
                            label="Password"
                            type="password"
                            rules={{
                                required: 'Password is required',
                            }}
                        />
                        <FormControl
                            name="text"
                            control={control}
                            label="Textarea"
                            type="textarea"
                            rules={{
                                required: 'Text long is required',
                            }}
                        />
                        <FormControl
                            name="phone"
                            control={control}
                            label="Celular"
                            type="tel"
                            maskProps={{
                                maskPlaceholder: null,
                                alwaysShowMask: false,
                            }}
                        />
                        <SelectControl
                            name="role"
                            control={control}
                            label="Rol"
                            options={roles}
                            rules={{required: 'El rol es requerido'}}
                        />
                        <RadioControl
                            name="gender"
                            control={control}
                            label="Género"
                            options={genders}
                            rules={{required: 'El género es requerido'}}
                        />
                        <DatePicker
                            control={control}
                            name="endDate"
                            rules={{required: 'Fecha de finalizacion es requerida'}}
                            label="Dia de Finalizacion"
                        />
                    </CardBody>
                    <CardFooter className="pt-0">
                        <Button
                            type="submit"
                            color="blue"
                            variant="filled"
                            size="lg"
                            fullWidth
                        >
                            login
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default React.memo(LoginScreen);
