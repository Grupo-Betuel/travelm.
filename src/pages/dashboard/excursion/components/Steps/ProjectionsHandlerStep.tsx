import React, {useEffect} from "react";
import ProjectionsHandler from "../ProjectionsHandler";
import {IExcursion} from "../../../../../models/excursionModel";

interface ProjectHandlerStepProps {
    excursionData: IExcursion;
    updateExcursion: (excursion: Partial<IExcursion>) => void;
    setIsValid: (isValid: boolean) => void;
}

export const ProjectHandlerStep = ({
                                       excursionData,
                                       updateExcursion,
                                       setIsValid,
                                   }: ProjectHandlerStepProps) => {

    const onUpdateProjections = (projections: any) => {
        updateExcursion({projections});
    }

    useEffect(() => {
        setIsValid(true);
    }, []);
    return (
        <div>
            <h1>Project Handler Step</h1>
            <ProjectionsHandler projections={excursionData.projections || []} updateProjections={onUpdateProjections}/>
        </div>
    );
}