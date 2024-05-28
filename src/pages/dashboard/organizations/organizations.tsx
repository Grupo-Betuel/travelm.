import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {OrganizationList} from "./screens/OrganizationList";

function Organizations() {

    return (
        <div className="pt-5">
            <Routes>
                <Route index element={<OrganizationList/>}/>
                {/*<Route path="/:excursionId" element={<ExcursionDetails/>}/>*/}
                {/*<Route path="/handler" element={<ExcursionStepper/>}/>*/}
                {/*<Route path="/handler/:excursionId" element={<ExcursionStepper/>}/>*/}
                {/*<Route path="organization/:organizationId" element={<OrganizationDetail />} />*/}
            </Routes>
        </div>
    );
}

export default Organizations;
