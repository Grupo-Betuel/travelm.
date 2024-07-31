import {
    Input,
    Checkbox,
    Button,
    Typography,
} from "@material-tailwind/react";
import {Link} from "react-router-dom";
import React, {useState} from "react";
import IUser from "../../models/interfaces/userModel";
import {useLogin} from "../../hooks/useLogin";
import {useAppLoading} from "../../context/appLoadingContext";

export function SignIn() {
    const [auth, setAuth] = useState<Pick<IUser, 'email' | 'password'>>({email: '', password: ''});
    const {login} = useLogin();
    const { setAppIsLoading } = useAppLoading()

    const onSubmit = async (e: React.FormEvent) => {
        try {
            setAppIsLoading(true);
            e.preventDefault();
            await login(auth);
            setAppIsLoading(false);
        } catch (e) {
            setAppIsLoading(false);
            console.log('Error logging in', e);
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setAuth({...auth, [name]: value});
    }

    return (
        <section className="m-8 flex gap-4">
            <div className="w-full lg:w-3/5 mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">Iniciar sesion</Typography>
                    <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Introduce tu email
                        y contraseña para iniciar sesion.</Typography>
                </div>
                <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={onSubmit}>
                    <div className="mb-4 flex flex-col gap-6">
                        <Input
                            size="lg"
                            label="Email o Usuario"
                            name="email"
                            onChange={onChange}
                        />
                        <Input
                            size="lg"
                            label="Contraseña"
                            name="password"
                            type="password"
                            onChange={onChange}
                        />
                    </div>
                    <Checkbox
                        color="light-blue"
                        label={
                            <Typography
                                variant="small"
                                color="gray"
                                className="flex items-center justify-start font-medium"
                            >
                                Acepto los&nbsp;
                                <a
                                    href="#"
                                    className="font-normal text-black transition-colors hover:text-gray-900 underline"
                                >
                                    Terminos y Condiciones
                                </a>
                            </Typography>
                        }
                        checked
                        containerProps={{className: "-ml-2.5"}}
                    />
                    <Button color="blue" className="mt-6" type="submit" fullWidth>
                        Iniciar Sesion
                    </Button>
                </form>
            </div>
            <div className="w-2/5 h-[93dvh] hidden lg:block">
                {/*<img*/}
                {/*    src="/img/login banner.webp"*/}
                {/*    className="h-full w-full object-cover rounded-3xl"*/}
                {/*/>*/}
            </div>
        </section>
    );
}

export default SignIn;
