import {Routes, Route, Navigate} from 'react-router-dom';
import {Dashboard, Auth} from '@/layouts';
import {AuthProvider} from '@/context/authContext';
import React from "react";
import {AppLoadingProvider} from "./context/appLoadingContext";


const App = () => {
    return (
        <AppLoadingProvider>
            <AuthProvider>
                <Routes>
                    <Route path="/dashboard/*" element={<Dashboard/>}/>
                    <Route path="/auth/*" element={<Auth/>}/>
                    <Route path="*" element={<Navigate to="/dashboard/excursions" replace/>}/>
                </Routes>
            </AuthProvider>
        </AppLoadingProvider>
    );
};

export default App;

