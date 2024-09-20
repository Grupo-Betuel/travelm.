import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {ClientsList} from "@/pages/dashboard/clients/components/ClientsList";

function Clients() {

    return (
        <div className="pt-5">
            <Routes>
                <Route index element={<ClientsList/>}/>
            </Routes>
        </div>
    );
}

export default Clients;
