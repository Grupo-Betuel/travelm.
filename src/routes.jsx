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
import Excursions from "@/pages/dashboard/excursion/excursion";

const icon = {
    className: "w-5 h-5 text-inherit",
};

export const routes = [
    {
        layout: 'dashboard',
        pages: [
            {
                icon: <HomeIcon {...icon} />,
                name: 'dashboard',
                path: '/home',
                element: Home,
                roles: ['admin', 'user'], // Specify roles here
            },
            {
                icon: <HomeIcon {...icon} />,
                name: 'Excursiones',
                path: '/excursions/*',
                element: Excursions,
                roles: ['admin'], // Only accessible by admin
            },
            {
                icon: <UserCircleIcon {...icon} />,
                name: 'profile',
                path: '/profile',
                element: Profile,
                roles: ['user'], // Only accessible by user
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
