// LoadingContext.tsx
import React, {createContext, useState, useContext, useEffect} from 'react';
import {useSelector} from "react-redux";
import {selectIsAnyEntityLoading} from "../store/selectors/isLoading.selector";
import {LoadingBar} from "../components/TopLoadingBar";

interface LoadingContextProps {
    appIsLoading: boolean;
    setAppIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(undefined);

export const AppLoadingProvider: React.FC<{ children: any }> = ({children}) => {
    const [appIsLoading, setAppIsLoading] = useState(false);
    const isEntityLoading = useSelector(selectIsAnyEntityLoading);

    useEffect(() => {
        setAppIsLoading(isEntityLoading);
    }, [isEntityLoading]);

    const setLoading = (loading: boolean) => {
        setAppIsLoading(loading);
    };

    useEffect(() => {
        const query = 'button,input,select,textarea';
        document.querySelectorAll(query).forEach((el) => {
            if (!appIsLoading) {
                el.removeAttribute('disabled');
            } else {
                el.setAttribute('disabled', JSON.stringify(appIsLoading));
            }
        });
    }, [appIsLoading]);

    return (
        <LoadingContext.Provider value={{appIsLoading, setAppIsLoading}}>
            {appIsLoading && <LoadingBar/>}
            {children}
        </LoadingContext.Provider>
    );
};

export const useAppLoading = () => {

    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
