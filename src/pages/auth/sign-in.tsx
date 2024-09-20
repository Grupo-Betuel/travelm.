// import {
//     Input,
//     Checkbox,
//     Button,
//     Typography,
// } from "@material-tailwind/react";
// import {Link} from "react-router-dom";
// import React, {useState} from "react";
// import IUser from "../../models/interfaces/userModel";
// import {useLogin} from "../../hooks/useLogin";
// import {useAppLoading} from "../../context/appLoadingContext";
// import {AlertWithContent} from "../../components/AlertWithContent";
//
// export function SignIn() {
//     const [auth, setAuth] = useState<Pick<IUser, 'email' | 'password'>>({email: '', password: ''});
//     const {login} = useLogin();
//     const [inValid, setInValid] = React.useState(false);
//     const {setAppIsLoading} = useAppLoading()
//
//     const onSubmit = async (e: React.FormEvent) => {
//         try {
//                setAppIsLoading(true);
//             setInValid(false)
//             e.preventDefault();
//             await login(auth);
//             setAppIsLoading(false);
//         } catch (e) {
//             setInValid(true)
//             setAppIsLoading(false);
//             console.log('Error logging in', e);
//         }
//     }
//
//     const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const {name, value} = e.target;
//         setAuth({...auth, [name]: value});
//     }
//
//     return (
//         <section className="m-8 flex gap-4">
//             <AlertWithContent open={inValid} setOpen={setInValid} content={"Usuario o contraseña incorrectos"} type="warning"/>
//             <div className="w-full lg:w-3/5 mt-24">
//                 <div className="text-center">
//                     <Typography variant="h2" className="font-bold mb-4">Iniciar sesion</Typography>
//                     <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Introduce tu email
//                         y contraseña para iniciar sesion.</Typography>
//                 </div>
//                 <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={onSubmit}>
//                     <div className="mb-4 flex flex-col gap-6">
//                         <Input
//                             size="lg"
//                             label="Email o Usuario"
//                             name="email"
//                             onChange={onChange}
//                         />
//                         <Input
//                             size="lg"
//                             label="Contraseña"
//                             name="password"
//                             type="password"
//                             onChange={onChange}
//
//                         />
//                     </div>
//                     <Checkbox
//                         color="light-blue"
//                         label={
//                             <Typography
//                                 variant="small"
//                                 color="gray"
//                                 className="flex items-center justify-start font-medium"
//                             >
//                                 Acepto los&nbsp;
//                                 <a
//                                     href="#"
//                                     className="font-normal text-black transition-colors hover:text-gray-900 underline"
//                                 >
//                                     Terminos y Condiciones
//                                 </a>
//                             </Typography>
//                         }
//                         checked
//                         containerProps={{className: "-ml-2.5"}}
//                     />
//                     <Button color="blue" className="mt-6" type="submit" fullWidth>
//                         Iniciar Sesion
//                     </Button>
//                 </form>
//                 <div className="text-center mt-4">
//                     <Link to="/auth/sign-up" className="text-blue-600 hover:underline">¿No tienes cuenta?
//                         Registrate</Link>
//                 </div>
//             </div>
//             <div className="w-2/5 h-[93dvh] hidden lg:block">
//                 <img
//                     src="/img/login banner.webp"
//                     className="h-full w-full object-cover rounded-3xl"
//                 />
//             </div>
//         </section>
//     );
// }
//
// export default SignIn;


import {
    Input,
    Checkbox,
    Button,
    Typography,
    IconButton,
} from "@material-tailwind/react";
import {Link} from "react-router-dom";
import React, {useState} from "react";
import IUser from "../../models/interfaces/userModel";
import {useLogin} from "../../hooks/useLogin";
import {useAppLoading} from "../../context/appLoadingContext";
import {AlertWithContent} from "../../components/AlertWithContent";
import {EyeIcon, EyeSlashIcon} from "@heroicons/react/20/solid";

export function SignIn() {
    const [auth, setAuth] = useState<Pick<IUser, 'email' | 'password'>>({email: '', password: ''});
    const {login} = useLogin();
    const [inValid, setInValid] = useState(false);
    const {setAppIsLoading} = useAppLoading();

    // Nuevo estado para controlar la visibilidad de la contraseña
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        try {
            setAppIsLoading(true);
            setInValid(false);
            e.preventDefault();
            await login(auth);
            setAppIsLoading(false);
        } catch (e) {
            setInValid(true);
            setAppIsLoading(false);
            console.log('Error logging in', e);
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setAuth({...auth, [name]: value});
    };

    return (
        <section className="m-8 flex gap-4">
            <AlertWithContent open={inValid} setOpen={setInValid} content={"Usuario o contraseña incorrectos"} type="warning"/>
            <div className="w-full lg:w-3/5 mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">Iniciar sesión</Typography>
                    <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Introduce tu email
                        y contraseña para iniciar sesión.</Typography>
                </div>
                <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={onSubmit}>
                    <div className="mb-4 flex flex-col gap-6">
                        <Input
                            size="lg"
                            label="Email o Usuario"
                            name="email"
                            onChange={onChange}
                        />
                        <div className="relative">
                            <Input
                                size="lg"
                                label="Contraseña"
                                name="password"
                                type={showPassword ? "text" : "password"} // Cambia el tipo según el estado
                                onChange={onChange}
                            />
                            <IconButton
                                variant="text"
                                size="sm"
                                color="blue-gray"
                                className="!absolute right-2 top-2"
                                onClick={() => setShowPassword(!showPassword)} // Alternar visibilidad
                            >
                                {showPassword ? <EyeIcon className="w-6 h-6"/> : <EyeSlashIcon className="w-6 h-6"/>}
                            </IconButton>
                        </div>
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
                                    Términos y Condiciones
                                </a>
                            </Typography>
                        }
                        checked
                        containerProps={{className: "-ml-2.5"}}
                    />
                    <Button color="blue" className="mt-6" type="submit" fullWidth>
                        Iniciar Sesión
                    </Button>
                </form>
                <div className="text-center mt-4">
                    <Link to="/auth/sign-up" className="text-blue-600 hover:underline">¿No tienes cuenta? Regístrate</Link>
                </div>
            </div>
            <div className="w-2/5 h-[93dvh] hidden lg:block">
                <img
                    src="/img/login banner.webp"
                    className="h-full w-full object-cover rounded-3xl"
                />
            </div>
        </section>
    );
}

export default SignIn;
