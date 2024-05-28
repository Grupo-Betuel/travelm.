import React from "react";
import {Routes, Route} from "react-router-dom";
import routes from "@/routes.jsx";
import PublicOnly from "@/components/PublicOnlyRoutes";

export function Auth() {

    // <Route
    //     key={path}
    //     path={path}
    //     element={
    //         <ProtectedRoute roles={roles}>
    //             {React.createElement(element)}
    //         </ProtectedRoute>
    //     }
    // />
    return (
        <div className="relative min-h-screen w-full">
            <Routes>
                {routes.map(
                    ({layout, pages}) =>
                        layout === "auth" &&
                        pages.map(({path, element}) => (
                            <Route key={path} path={path} element={
                                <PublicOnly>
                                    {React.createElement(element)}
                                </PublicOnly>
                            }
                            />
                        ))
                )}
            </Routes>
        </div>
    );
}

Auth.displayName = "/src/layout/Auth.jsx";

export default Auth;
