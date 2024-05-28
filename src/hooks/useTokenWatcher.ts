import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import Cookies from 'js-cookie';
import {apiSlice} from "../api/apiSlice";

const useTokenWatcher = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = Cookies.get('token');

        const handleTokenChange = () => {
            const newToken = Cookies.get('token');
            if (newToken !== token) {
                dispatch(apiSlice('travelClients').util.invalidateTags(["LIST"]));
            }
        };

        const intervalId = setInterval(handleTokenChange, 1000);

        return () => clearInterval(intervalId);
    }, [dispatch]);
};

export default useTokenWatcher;
