import React from 'react';
import 'react-quill/dist/quill.snow.css';
import FoodsHandler from "../FoodsHandler";
import {IExcursion} from "../../../../../models/excursionModel";
import {IFood} from "../../../../../models/foodModel";


interface FoodsStepProps {
    excursionData: IExcursion;
    updateExcursion: (excursion: Partial<IExcursion>) => void;
}

const FoodsHandlerStep: React.FC<FoodsStepProps> = ({excursionData, updateExcursion}) => {
    const onUpdateFoods = (foods: IFood[]) => {
        updateExcursion({foods});
    }

    return (
        <div>
            <FoodsHandler foods={excursionData.foods || []} updateFoods={onUpdateFoods}/>
        </div>
    );
};

export default FoodsHandlerStep;
