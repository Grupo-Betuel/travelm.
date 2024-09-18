import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {ClientsList} from "@/pages/dashboard/clients/components/ClientsList";

function Clients() {

    return (
        <div className="pt-5">
            <Routes>
                <Route index element={<ClientsList/>}/>
                {/*<Route path="/:excursionId" element={<ExcursionDetails/>}/>*/}
                {/*<Route path="/handler" element={<ExcursionStepper/>}/>*/}
                {/*<Route path="/handler/:excursionId" element={<ExcursionStepper/>}/>*/}
                {/*<Route path="organization/:organizationId" element={<OrganizationDetail />} />*/}
            </Routes>
        </div>
    );
}

export default Clients;
