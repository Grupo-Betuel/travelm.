import React from 'react';
import 'react-quill/dist/quill.snow.css';
import ActivitiesHandler from "../ActivitiesHandler";
import {IExcursion} from "@/models/excursionModel";
import {IActivity} from "@/models/activitiesModel";


interface ActivitiesStepProps {
    excursionData: IExcursion;
    updateExcursion: (excursion: Partial<IExcursion>) => void;
}

const ActivitiesHandlerStep: React.FC<ActivitiesStepProps> = ({excursionData, updateExcursion}) => {
    const onUpdateActivities = (activities: IActivity[]) => {
        updateExcursion({activities});
    }

    return (
        <div>
            <ActivitiesHandler activities={excursionData.activities || []} updateActivities={onUpdateActivities}/>
        </div>
    );
};

export default ActivitiesHandlerStep;
