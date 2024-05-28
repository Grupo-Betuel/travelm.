import {
    Input,
    Checkbox,
    Button,
    Typography,
} from "@material-tailwind/react";
import {Link} from "react-router-dom";
import React, {useMemo} from "react";
import {getCrudService} from "../../api/services/CRUD.service";
import IUser from "../../models/interfaces/user";
import {IOrganization} from "../../models/organizationModel";
import {useLogin} from "../../context/useLogin";

const userService = getCrudService('travelUsers');
const organizationService = getCrudService('organizations');

export function SignUp() {
    const [user, setUser] = React.useState<IUser>({} as IUser);
    const [organization, setOrganization] = React.useState<any>({} as IOrganization);
    const [addUser] = userService.useAddTravelUsers();
    const [addOrganization] = organizationService.useAddOrganizations();
    const {login} = useLogin();
    const register = async () => {
        const {data: createdOrganization} = await addOrganization({
            ...organization, type: 'agency'
        });

        if (createdOrganization) {
            const {data: createdUser} = await addUser({
                ...user,
                organization: createdOrganization._id as string,
                type: 'agency',
                role: 'admin',
                path: 'register'
            });
            if (createdUser) {
                await login({email: user.email, password: user.password});
            } else {
                // TODO: Toast error
            }
        } else {
            // TODO: Toast error
            console.log('Error creating organization');
        }
    }


    const onChangeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setUser({...user, [name]: value});
    }

    const onChangeOrganization = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setOrganization({...organization, [name]: value});
    }

    const isValid = useMemo(() => {
        return user.email && user.password && organization.name;
    }, [user, organization]);

    return (
        <section className="m-8 flex">
            <div className="w-2/5 h-full hidden lg:block">
                <img
                    src="/img/pattern.png"
                    className="h-full w-full object-cover rounded-3xl"
                />
            </div>
            <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
                    <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email
                        and password to register.</Typography>
                </div>
                <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
                    <div className="mb-4 flex flex-col gap-6">
                        <Input
                            size="lg"
                            label="Nombre de la Agencia"
                            name="name"
                            onChange={onChangeOrganization}
                        />
                        <Input
                            size="lg"
                            label="Tu Nombre"
                            name="firstName"
                            onChange={onChangeUser}
                        />
                        <Input
                            type="text"
                            size="lg"
                            label="Tu Apellido"
                            name="lastName"
                            onChange={onChangeUser}
                        />

                        <Input
                            size="lg"
                            label="Email"
                            name="email"
                            type="email"
                            onChange={onChangeUser}
                        />
                        <Input
                            size="lg"
                            label="Password"
                            name="password"
                            type="password"
                            onChange={onChangeUser}
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
                    <Button className="mt-6" disabled={!isValid} onClick={register} fullWidth>
                        Register Now
                    </Button>
                    <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
                        Already have an account?
                        <Link to="/auth/sign-in" className="text-gray-900 ml-1">Sign in</Link>
                    </Typography>
                </form>
            </div>
        </section>
    );
}

export default SignUp;
