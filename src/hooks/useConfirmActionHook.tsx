import React, {useCallback} from "react";
import {Button, Dialog, DialogBody, DialogFooter, DialogHeader, Typography} from "@material-tailwind/react";

export type IConfirmActionExtraParams = {
    avoidConfirm?: boolean,
} & any;

export function useConfirmAction<ActionsType, ActionDataType>(handleConfirmedAction: (type?: ActionsType, data?: ActionDataType, ...extra: any) => any, handleDeniedAction?: (type?: ActionsType, data?: ActionDataType) => any) {
    const [actionDataToConfirm, setActionDataToConfirm] = React.useState<ActionDataType>();
    const [actionExtraDataToConfirm, setActionExtraDataToConfirm] = React.useState<IConfirmActionExtraParams>();
    const [actionToConfirm, setActionToConfirm] = React.useState<ActionsType>();
    const [reason, setReason] = React.useState<string>('continuar')
    const resetActionToConfirm = () => {
        handleDeniedAction && handleDeniedAction(actionToConfirm, actionDataToConfirm)
        setActionDataToConfirm(undefined)
        setActionToConfirm(undefined)
    };

    const handleSetActionToConfirm = (type: ActionsType, reasonText?: string) => (data?: ActionDataType, extraParams?: IConfirmActionExtraParams) => {
        console.log('klk?', extraParams)
        if (extraParams?.avoidConfirm) {
            handleConfirmedAction(type, data, extraParams);
            return;
        }
        setReason(reasonText || reason);
        setActionDataToConfirm(data)
        setActionExtraDataToConfirm(extraParams)
        setActionToConfirm(type)

    }

    const handleConfirm = () => {
        handleConfirmedAction(actionToConfirm, actionDataToConfirm, actionExtraDataToConfirm);
        resetActionToConfirm();
    }

    const ConfirmDialog = useCallback(() => {
        return (
            <Dialog open={!!actionToConfirm} handler={resetActionToConfirm}>
                <DialogHeader className="text-center">
                    <Typography variant="h3" className="text-center">
                        Confirmación
                    </Typography>
                </DialogHeader>
                <DialogBody>
                    <Typography variant="lead">
                        ¿Estas seguro que deseas <b>{reason}</b>?
                    </Typography>
                </DialogBody>
                <DialogFooter>
                    <Button size="lg" color="red" variant="text" onClick={resetActionToConfirm}>Cancel</Button>
                    <Button size="lg" color="green" variant="text"
                            onClick={handleConfirm}>Confirmar</Button>{' '}
                </DialogFooter>
            </Dialog>
        )
    }, [actionDataToConfirm, actionToConfirm])

    return {
        handleSetActionToConfirm,
        resetActionToConfirm,
        ConfirmDialog,
    }
}