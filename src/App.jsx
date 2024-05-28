import {Routes, Route, Navigate} from 'react-router-dom';
import {Dashboard, Auth} from '@/layouts';
import Excursions from '@/pages/dashboard/excursion/excursions';
import {AuthProvider} from '@/context/authContext';
import ProtectedRoute from '@/components/ProtectedRoute';


const App = () => {
    return (
        <AuthProvider>
            <Routes>
                {/*<Route>*/}
                    <Route path="/dashboard/*" element={<Dashboard/>}/>
                    <Route path="/excursions/*" element={<Excursions/>}/>
                {/*</Route>*/}
                <Route path="/auth/*" element={<Auth/>}/>
                <Route path="*" element={<Navigate to="/dashboard/excursions" replace/>}/>
            </Routes>
        </AuthProvider>
    );
};

export default App;

