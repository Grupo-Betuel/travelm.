import React, { useCallback } from "react";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Typography } from "@material-tailwind/react";

export function useAlertAction() {
    const [alertMessage, setAlertMessage] = React.useState<string>('');
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    const showAlert = (message: string) => {
        setAlertMessage(message);
        setIsOpen(true);
    };

    const closeAlert = () => {
        setAlertMessage('');
        setIsOpen(false);
    };

    const AlertDialog = useCallback(() => {
        return (
            <Dialog open={isOpen} handler={closeAlert}>
                <DialogHeader className="text-center">
                    <Typography variant="h3" className="text-center">
                        Alerta
                    </Typography>
                </DialogHeader>
                <DialogBody>
                    <Typography variant="lead">
                        {alertMessage}
                    </Typography>
                </DialogBody>
                <DialogFooter>
                    <Button size="lg" color="green" variant="text" onClick={closeAlert}>Aceptar</Button>
                </DialogFooter>
            </Dialog>
        );
    }, [isOpen, alertMessage]);

    return {
        showAlert,
        closeAlert,
        AlertDialog,
    };
}
