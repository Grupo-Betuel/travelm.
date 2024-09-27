import {
    HomeIcon,
    UserCircleIcon,
    TableCellsIcon,
    InformationCircleIcon,
    ServerStackIcon,
    RectangleStackIcon,
} from "@heroicons/react/24/solid";
import {Home, Profile, Tables, Notifications} from "@/pages/dashboard";
import {SignIn, SignUp} from "@/pages/auth";
import Excursions from "@/pages/dashboard/excursion/excursions";
import {CgOrganisation} from "react-icons/cg";
import Organizations from "@/pages/dashboard/organizations/organizations";
import Clients from "@/pages/dashboard/clients/clients";

const icon = {
    className: "w-5 h-5 text-inherit",
};

export const routes = [
    {
        layout: 'dashboard',
        pages: [
            {
                icon: <HomeIcon {...icon} />,
                name: 'Excursiones',
                path: '/excursions/*',
                element: Excursions,
                roles: ['admin', 'employee'],
            },
            {
                icon: <CgOrganisation {...icon} />,
                name: 'Organizaciones',
                path: '/organizations/*',
                element: Organizations,
                roles: ['admin'],
                userTypes: ['agency'],
            },
            {
                icon: <CgOrganisation {...icon} />,
                name: 'Clientes',
                path: '/clients/*',
                element: Clients,
                roles: ['admin'],
                userTypes: ['agency'],
            },
            {
                icon: <UserCircleIcon {...icon} />,
                name: 'profile',
                path: '/profile',
                element: Profile,
            },
            {
                icon: <TableCellsIcon {...icon} />,
                name: 'tables',
                path: '/tables',
                element: Tables,
                roles: ['admin', 'user'],
            },
            {
                icon: <InformationCircleIcon {...icon} />,
                name: 'notifications',
                path: '/notifications',
                element: Notifications,
                roles: ['admin', 'user'],
            },
        ],
    },
    {
        title: 'auth pages',
        layout: 'auth',
        pages: [
            {
                icon: <ServerStackIcon {...icon} />,
                name: 'sign in',
                path: '/sign-in',
                element: SignIn,
            },
            {
                icon: <RectangleStackIcon {...icon} />,
                name: 'sign up',
                path: '/sign-up',
                element: SignUp,
            },
        ],
    },
];

export default routes;
