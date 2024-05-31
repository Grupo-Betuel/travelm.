import {IStep} from "../models/common";
import React from "react";
import {Step, Stepper, Typography} from "@material-tailwind/react";

export interface AppStepperProps<T> {
    steps: IStep<T>[];
    activeStep: number;
    onClickStep: (position: number, step: IStep<T>) => any;
}

export function AppStepper<T>({ steps, activeStep, onClickStep}: AppStepperProps<T> ) {
    if(steps.length === 0) return null;
    return (
        <>
            <Stepper activeStep={activeStep || 0} className="px-7 overflow-x-scroll mb-10 h-[110px] w-[100%]">
                {steps.map((step, index) => (
                    <Step key={index} onClick={() => onClickStep(index, step)} >
                        {step.icon}

                        <div className="absolute -bottom-[2.5rem] w-max text-center">
                            <Typography
                                className="min-w-[100px]"
                                variant="h6"
                                color={activeStep === index ? 'blue-gray' : 'gray'}
                            >
                                {step.label}
                            </Typography>
                        </div>
                    </Step>
                ))}
            </Stepper>
            <div className="app-stepper__content">
                {steps[activeStep || 0]?.component}
            </div>
        </>
    )
}