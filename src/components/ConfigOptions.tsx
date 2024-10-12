import React, { useState } from 'react';
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Switch,
    Select,
    Option
} from "@material-tailwind/react";

interface ICustomComponentDialog {
    open: boolean;
    handler: () => void;
}

interface IConfigPanel {
    dialog?: ICustomComponentDialog;
}

const menuItems = ["Mensajes", "Acciones", "Reglas", "Avisos"];

export default function ConfigPanel({ dialog }: IConfigPanel) {
    const [activeMenuItem, setActiveMenuItem] = useState(menuItems[0]);
    const [isPromocion, setIsPromocion] = useState(false);
    const [recurrencia, setRecurrencia] = useState("");

    const renderContent = () => {
        switch (activeMenuItem) {
            case "Mensajes":
                return <div className="p-4">Contenido de Mensajes</div>;
            case "Acciones":
                return (
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <Switch
                                    crossOrigin
                                    checked={isPromocion}
                                    onChange={() => setIsPromocion(!isPromocion)}
                                    label="Promocion"
                                />
                            </div>
                            <div className="w-48">
                                <Select
                                    label="Recurrencia"
                                    value={recurrencia}
                                    onChange={(value) => setRecurrencia(value || "")}
                                >
                                    <Option value="diaria">Diaria</Option>
                                    <Option value="semanal">Semanal</Option>
                                    <Option value="mensual">Mensual</Option>
                                </Select>
                            </div>
                        </div>
                        <div>Contenido adicional de Acciones</div>
                    </div>
                );
            case "Reglas":
                return <div className="p-4">Contenido de Reglas</div>;
            case "Avisos":
                return <div className="p-4">Contenido de Avisos</div>;
            default:
                return <div className="p-4">Seleccione una opción</div>;
        }
    };

    const content = (
        <div className="flex h-full">
            <div className="w-1/4 border-r p-4">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item} className="mb-2">
                            <Button
                                color={activeMenuItem === item ? "blue" : "gray"}
                                fullWidth
                                onClick={() => setActiveMenuItem(item)}
                            >
                                {item}
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-3/4">
                {renderContent()}
            </div>
        </div>
    );

    return (
        <>
            {dialog ? (
                <Dialog open={dialog.open} handler={dialog.handler} size="xxl">
                    <DialogHeader>Configuración</DialogHeader>
                    <DialogBody className="h-[calc(100vh-200px)] p-0">
                        {content}
                    </DialogBody>
                    <DialogFooter>
                        <Button onClick={dialog.handler} color="red">
                            Cerrar
                        </Button>
                    </DialogFooter>
                </Dialog>
            ) : (
                content
            )}
        </>
    );
}