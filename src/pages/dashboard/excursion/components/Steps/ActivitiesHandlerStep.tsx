import React, {useEffect} from 'react';
import 'react-quill/dist/quill.snow.css';
import ActivitiesHandler from "../ActivitiesHandler";
import {IExcursion} from "@/models/excursionModel";
import {IActivity} from "@/models/activitiesModel";


interface ActivitiesStepProps {
    excursionData: IExcursion;
    updateExcursion: (excursion: Partial<IExcursion>) => void;
    setIsValid: (isValid: boolean) => void;

}

const ActivitiesHandlerStep: React.FC<ActivitiesStepProps> = ({excursionData, updateExcursion, setIsValid}) => {
    const onUpdateActivities = (activities: IActivity[]) => {
        updateExcursion({activities});
    }

    useEffect(() => {
        setIsValid(!!excursionData.activities?.length); // Set valid if there are activities
    }, [excursionData.activities]);

    return (
        <div>
            <ActivitiesHandler activities={excursionData.activities || []} updateActivities={onUpdateActivities}/>
        </div>
    );
};

export default ActivitiesHandlerStep;
