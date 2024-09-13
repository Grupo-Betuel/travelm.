import {IStep} from "../models/common";
import React from "react";
import {Step, Stepper, Typography} from "@material-tailwind/react";

export interface AppStepperProps<T> {
    steps: IStep<T>[];
    activeStep: number;
    onClickStep: (position: number, step: IStep<T>) => any;
}

export function AppStepper<T>({steps, activeStep, onClickStep}: AppStepperProps<T>) {
    if (steps.length === 0) return null;
    return (
        <>
            <div className="w-full py-4 px-8">
                <div className='overflow-x-auto sm:overflow-x-visible'>
                    <Stepper activeStep={activeStep || 0} className="flex flex-nowrap px-8 mb-8  ">
                        {steps.map((step, index) => (
                            <Step key={index} onClick={() => onClickStep(index, step)}>
                                {step.icon}

                                <div className="lg:absolute sm:static object-center mt-20 w-max text-center">
                                    <Typography
                                        className="min-w-[100px] w-max"
                                        variant="h6"
                                        color={activeStep === index ? 'blue-gray' : 'gray'}
                                    >
                                        {step.label}
                                    </Typography>
                                </div>
                            </Step>
                        ))}
                    </Stepper>
                </div>
            </div>
            <div className="app-stepper__content">
                {steps[activeStep || 0]?.component}
            </div>
        </>
    )
}