import React, {useEffect, useMemo} from 'react';
import 'react-quill/dist/quill.snow.css';
import {FinanceHandler} from "../FinanceHandler";
import {IExcursion} from "../../../../../models/excursionModel";
import {IFinance} from "../../../../../models/financeModel";
import {Typography} from "@material-tailwind/react";


interface FinancesStepProps {
    excursionData: IExcursion;
    updateExcursion: (excursion: Partial<IExcursion>) => void;
}

const FinancesHandlerStep: React.FC<FinancesStepProps> = ({excursionData, updateExcursion}) => {
    const onUpdateFinances = (finance: IFinance) => {
        updateExcursion({finance});
    }

    const foodPrice = useMemo(() => {
        return excursionData.foods?.reduce((acc, food) => acc + food.finance.price, 0) || 0;
    }, [excursionData.foods]);

    const activityPrice = useMemo(() => {
        return excursionData.activities?.reduce((acc, activity) => acc + (activity?.finance?.price || 0), 0) || 0;
    }, [excursionData.activities]);


    const destinationsPrice = useMemo(() => {
        return excursionData.destinations?.reduce((acc, destination) => acc + (destination?.entryFee?.price || 0), 0) || 0;
    }, [excursionData.destinations]);

    const transportPrice = useMemo(() => {
        const busesQuantity = excursionData.transport?.buses?.length || 0;
        const busesPrices = excursionData?.transport?.buses?.reduce((a,b) => ((b?.finance?.price || 0) / b.capacity) + a, 0);
        return Math.ceil(busesPrices / busesQuantity);

    }, [excursionData.transport]);

    const total = useMemo(() => {
        return foodPrice + activityPrice + destinationsPrice + transportPrice;
    }, [foodPrice, activityPrice, destinationsPrice, transportPrice]);

    useEffect(() => {
            updateExcursion({finance: {...excursionData.finance, cost: total}});
        }, [total])

    return (
        <div>
            <FinanceHandler
                enabledCost={true}
                finance={excursionData.finance}
                updateFinance={onUpdateFinances}
                type="excursion"/>
            <Typography variant="h5" color="blue" className="p-4 text-center">Transporte: RD${transportPrice.toLocaleString()}</Typography>
            <Typography variant="h5" color="blue" className="p-4 text-center">Precio de Destino: RD${destinationsPrice.toLocaleString()}</Typography>
            <Typography variant="h5" color="blue" className="p-4 text-center">Precio de Comida: RD${foodPrice.toLocaleString()}</Typography>
            <Typography variant="h5" color="blue" className="p-4 text-center">Precio por Actividad: RD${activityPrice.toLocaleString()}</Typography>
            <Typography variant="h5" color="blue" className="p-4 text-center">Beneficio: {(excursionData.finance?.price - total).toLocaleString()}</Typography>
        </div>
    );
};

export default FinancesHandlerStep;
