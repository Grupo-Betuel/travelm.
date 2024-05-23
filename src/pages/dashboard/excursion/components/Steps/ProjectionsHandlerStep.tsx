import React from "react";
import ProjectionsHandler from "../ProjectionsHandler";
import {IExcursion} from "../../../../../models/excursionModel";

interface ProjectHandlerStepProps {
    excursionData: IExcursion;
    updateExcursion: (excursion: Partial<IExcursion>) => void;
}

export const ProjectHandlerStep = ({
                                       excursionData,
                                       updateExcursion
                                   }: ProjectHandlerStepProps) => {

    const onUpdateProjections = (projections: any) => {
        updateExcursion({projections});
    }
    return (
        <div>
            <h1>Project Handler Step</h1>
            <ProjectionsHandler projections={excursionData.projections || []} updateProjections={onUpdateProjections}/>
        </div>
    );
}