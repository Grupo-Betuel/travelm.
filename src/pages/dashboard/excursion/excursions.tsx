import React from 'react';
import {Route, Routes} from 'react-router-dom';
import ExcursionsList from "./screens/ExcursionList";
import {ExcursionDetails} from "./screens/ExcursionDetails";
import ExcursionStepper from "./screens/ExcursionStepper";
import ProtectedRoute from "../../../components/ProtectedRoute";
import {UserRoleTypes, UserTypes} from "../../../models/interfaces/userModel";

function Excursions() {

    return (
        <div className="pt-5">
            <Routes>
                <Route index element={<ExcursionsList/>}/>
                <Route path="/:excursionId" element={<ExcursionDetails/>}/>

                <Route path="/handler" element={
                    <ProtectedRoute roles={[UserRoleTypes.ADMIN]} userTypes={[UserTypes.AGENCY]}>
                        <ExcursionStepper/>
                    </ProtectedRoute>
                }/>

                <Route path="/handler/:excursionId" element={
                    <ProtectedRoute roles={[UserRoleTypes.ADMIN]} userTypes={[UserTypes.AGENCY]}>
                        <ExcursionStepper/>
                    </ProtectedRoute>
                }/>
            </Routes>
        </div>
    );
}

export default Excursions;
