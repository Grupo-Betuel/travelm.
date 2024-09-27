import React, {useEffect, useMemo} from 'react';
import 'react-quill/dist/quill.snow.css';
import {FinanceHandler} from "../FinanceHandler";
import {IExcursion} from "@/models/excursionModel";
import {IFinance} from "@/models/financeModel";
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
        const busesQuantity = excursionData.transport?.transportResources?.length || 0;
        const busesPrices = excursionData?.transport?.transportResources?.reduce((a, b) => ((b?.finance?.price || 0) / b.bus.capacity) + a, 0);
        return Math.ceil(busesPrices / busesQuantity);

    }, [excursionData.transport]);

    const total = useMemo(() => {
        return foodPrice + activityPrice + destinationsPrice + transportPrice;
    }, [foodPrice, activityPrice, destinationsPrice, transportPrice]);

    useEffect(() => {
        updateExcursion({finance: {...excursionData.finance, cost: total}});
    }, [total, excursionData.finance?.cost])

    console.log('total', total, excursionData.finance);
    return (
        <div>
            <FinanceHandler
                enabledCost={true}
                finance={excursionData.finance}
                updateFinance={onUpdateFinances}
                type="excursion"
                options={[]}
            />

            <div className="flex flex-wrap justify-center items-center bg-gray-50 py-6 rounded-lg shadow-md">
                <Typography
                    variant="h5"
                    color="blue"
                    className="flex-1 m-2 p-4 text-center bg-blue-500 text-white rounded-md shadow hover:shadow-lg transition-transform duration-200 transform hover:scale-105"
                >
                    Transporte: RD${transportPrice.toLocaleString()}
                </Typography>

                <Typography
                    variant="h5"
                    color="blue"
                    className="flex-1 m-2 p-4 text-center bg-blue-400 text-white rounded-md shadow hover:shadow-lg transition-transform duration-200 transform hover:scale-105"
                >
                    Precio de Destino: RD${destinationsPrice.toLocaleString()}
                </Typography>

                <Typography
                    variant="h5"
                    color="blue"
                    className="flex-1 m-2 p-4 text-center bg-blue-300 text-white rounded-md shadow hover:shadow-lg transition-transform duration-200 transform hover:scale-105"
                >
                    Precio de Comida: RD${foodPrice.toLocaleString()}
                </Typography>

                <Typography
                    variant="h5"
                    color="blue"
                    className="flex-1 m-2 p-4 text-center bg-blue-600 text-white rounded-md shadow hover:shadow-lg transition-transform duration-200 transform hover:scale-105"
                >
                    Precio por Actividad: RD${activityPrice.toLocaleString()}
                </Typography>

                <Typography
                    variant="h5"
                    color="blue"
                    className={`flex-1 m-2 p-4 text-center rounded-md shadow hover:shadow-lg transition-transform duration-200 transform hover:scale-105 ${
                        excursionData.finance?.price - total >= 0
                            ? 'bg-blue-700 text-white'
                            : 'bg-blue-200 text-black'
                    }`}
                >
                    Beneficio: RD${(excursionData.finance?.price - total).toLocaleString()}
                </Typography>
            </div>

            <>
                {/*<Typography variant="h5" color="blue" className="p-4 text-center">Transporte:*/}
                {/*    RD${transportPrice.toLocaleString()}</Typography>*/}
                {/*<Typography variant="h5" color="blue" className="p-4 text-center">Precio de Destino:*/}
                {/*    RD${destinationsPrice.toLocaleString()}</Typography>*/}
                {/*<Typography variant="h5" color="blue" className="p-4 text-center">Precio de Comida:*/}
                {/*    RD${foodPrice.toLocaleString()}</Typography>*/}
                {/*<Typography variant="h5" color="blue" className="p-4 text-center">Precio por Actividad:*/}
                {/*    RD${activityPrice.toLocaleString()}</Typography>*/}
                {/*<Typography variant="h5" color="blue"*/}
                {/*    className="p-4 text-center">Beneficio: {(excursionData.finance?.price - total).toLocaleString()}</Typography>*/}
            </>
        </div>
    );
};

export default FinancesHandlerStep;
