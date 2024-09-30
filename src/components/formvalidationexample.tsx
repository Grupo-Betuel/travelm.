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
import { useForm, SubmitHandler, ValidationRule } from 'react-hook-form';
import getFormValidatorClassNames, {FormValidatorEntityType} from "@/utils/form-validator.utils";
import FormControl from "@/components/FormControl";


const LoginScreen = () => {

    const {
        control,
        handleSubmit,
    } = useForm<any>({ mode: 'onBlur' });

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
                                minLength: { value: 3, message: 'Minimum length is 3' },
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
