import React, {useMemo} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import {Cog6ToothIcon} from "@heroicons/react/24/solid";
import {IconButton} from "@material-tailwind/react";
import {
    Sidenav,
    DashboardNavbar,
    Configurator,
    Footer,
} from "@/widgets/layout";
import routes from "@/routes.jsx";
import {useMaterialTailwindController, setOpenConfigurator} from "@/context";
import ProtectedRoute from "@/components/ProtectedRoute";
import {useCheckUserAuthorization} from "@/hooks/useCheckUserAuthorization";

export function Dashboard() {
    const [controller, dispatch] = useMaterialTailwindController();
    const {sidenavType} = controller;
    const {user, checkAuthorization} = useCheckUserAuthorization({});

    const sidebarRoutes = useMemo(() => {
        return routes.filter(({layout}) => layout === 'dashboard').map(({pages, ...rest}) => ({
            ...rest,
            pages: pages.filter(({roles, userTypes}) => {
                    return checkAuthorization(roles, userTypes)
                }
            )
        }));
    }, [routes, user]);


    return (
        <div className="min-h-screen bg-blue-gray-50/50">
            <Sidenav
                routes={sidebarRoutes}
                brandImg={
                    sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
                }
            />
            <div className="p-4 xl:ml-80">
                <DashboardNavbar/>
                {/*<Configurator/>*/}
                {/*<IconButton*/}
                {/*    size="lg"*/}
                {/*    color="white"*/}
                {/*    className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"*/}
                {/*    ripple={false}*/}
                {/*    onClick={() => setOpenConfigurator(dispatch, true)}*/}
                {/*>*/}
                {/*    <Cog6ToothIcon className="h-5 w-5"/>*/}
                {/*</IconButton>*/}
                <Routes>
                    {routes.map(
                        ({layout, pages}) =>
                            layout === 'dashboard' &&
                            pages.map(({path, element, roles, userTypes}) => (
                                <Route
                                    key={path}
                                    path={path}
                                    element={
                                        <ProtectedRoute roles={roles} userTypes={userTypes}>
                                            {React.createElement(element)}
                                        </ProtectedRoute>
                                    }
                                />
                            ))
                    )}
                    <Route path="*" element={<Navigate to="/dashboard/excursions/" replace/>}/>
                </Routes>
                <div className="text-blue-gray-600">
                    <Footer />
                </div>
            </div>
        </div>
    );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
