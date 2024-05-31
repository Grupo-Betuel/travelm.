import {
    Input,
    Checkbox,
    Button,
    Typography,
} from "@material-tailwind/react";
import {Link} from "react-router-dom";
import React, {useState} from "react";
import IUser from "../../models/interfaces/userModel";
import {useLogin} from "../../context/useLogin";

export function SignIn() {
    const [auth, setAuth] = useState<Pick<IUser, 'email' | 'password'>>({email: '', password: ''});
    const {login} = useLogin();
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(auth);
        // const {data} = await addUser({...auth, path: 'login'} as any);
        // const token = (data as any).token;

        // if (token) {
        //     Cookies.set('token', token);
        //     navigate('/dashboard/home');
        // } else {
        //     console.log('Error logging in');
        // }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setAuth({...auth, [name]: value});
    }

    return (
        <section className="m-8 flex gap-4">
            <div className="w-full lg:w-3/5 mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
                    <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email
                        and password to Sign In.</Typography>
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
                            label="Password"
                            name="password"
                            type="password"
                            onChange={onChange}
                        />
                    </div>
                    <Checkbox
                        label={
                            <Typography
                                variant="small"
                                color="gray"
                                className="flex items-center justify-start font-medium"
                            >
                                I agree the&nbsp;
                                <a
                                    href="#"
                                    className="font-normal text-black transition-colors hover:text-gray-900 underline"
                                >
                                    Terms and Conditions
                                </a>
                            </Typography>
                        }
                        containerProps={{className: "-ml-2.5"}}
                    />
                    <Button className="mt-6" type="submit" fullWidth>
                        Sign In
                    </Button>
                    <div className="flex items-center justify-between gap-2 mt-6">
                        <Checkbox
                            label={
                                <Typography
                                    variant="small"
                                    color="gray"
                                    className="flex items-center justify-start font-medium"
                                >
                                    Subscribe me to newsletter
                                </Typography>
                            }
                            containerProps={{className: "-ml-2.5"}}
                        />
                        <Typography variant="small" className="font-medium text-gray-900">
                            <a href="#">
                                Forgot Password
                            </a>
                        </Typography>
                    </div>
                    <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
                        Not registered?
                        <Link to="/auth/sign-up" className="text-gray-900 ml-1">Create account</Link>
                    </Typography>
                </form>
            </div>
            <div className="w-2/5 h-full hidden lg:block">
                <img
                    src="/img/pattern.png"
                    className="h-full w-full object-cover rounded-3xl"
                />
            </div>
        </section>
    );
}

export default SignIn;
