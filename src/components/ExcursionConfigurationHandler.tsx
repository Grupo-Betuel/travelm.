import React from "react";
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel, Button, Dialog,
} from "@material-tailwind/react";
import {IExcursionConfiguration} from "@/models/ExcursionConfigurationModels";
import ExcursionMessagesHandler from "@/components/ExcursionMessagesHandler";
import {IExcursion} from "@/models/excursionModel";
import {UpdateExcursionHandlerType} from "@/pages/dashboard/excursion/screens/ExcursionDetails";
import ExcursionConfigActions from "@/components/ExcursionActionsHandler";
import TravelListHandler from "@/components/TravelListHandler";
import {ICustomComponentDialog} from "@/models/common";

export interface IExcursionConfigurationHandlerProps {
    initialConfig: IExcursionConfiguration;
    updateExcursion: UpdateExcursionHandlerType;
    excursion: IExcursion;
    dialog?: ICustomComponentDialog;
}

export function ExcursionConfigurationHandler(
    {
        initialConfig,
        updateExcursion,
        excursion,
        dialog
    }: IExcursionConfigurationHandlerProps) {
    const [config, setConfig] = React.useState<IExcursionConfiguration>(initialConfig);
    const [isValid, setIsValid] = React.useState(false);
    const onChangeConfig = (newConfig: Partial<IExcursionConfiguration>) => {
        const newConfigData = {
            ...config,
            ...newConfig,
        };

        setConfig(newConfigData);
    };


    const onSaveExcursion = () => {
        updateExcursion({configuration: config});
    }

    React.useEffect(() => {
        setConfig(initialConfig);
    }, [initialConfig]);

    const data = [
        {
            label: "Mensajes",
            value: "messages",
            component: <ExcursionMessagesHandler onChange={(messages) => {
                onChangeConfig({messages});
            }} initialMessages={config.messages}/>,
        },
        {
            label: "Acciones",
            value: "actions",
            component: <ExcursionConfigActions
                actions={config.actions}
                startDate={excursion.startDate}
                onActionsChange={(actions) => {
                    onChangeConfig({actions});
                }}
            />,
        },
        {
            label: "Reglas",
            value: "rules",
            component: <TravelListHandler setIsValid={setIsValid} initialList={config.rules} onUpdate={(rules) => {
                onChangeConfig({rules: {...rules, type: 'rules'}});
            }}/>,
        },
        {
            label: "Avisos",
            value: "advices",
            component: <TravelListHandler setIsValid={setIsValid} initialList={config.rules} onUpdate={(advices) => {
                onChangeConfig({advices: {...advices, type: 'advices'}});
            }}/>,
        },
    ];


    const content = (
        <div className="w-full max-h-[625px] h-[80dvh] flex ">
            <Tabs value="messages" orientation="vertical" className="w-full h-full">
                <TabsHeader className="w-40 h-full">
                    {data.map(({label, value}) => (
                        <Tab key={value} value={value}>
                            {label}
                        </Tab>
                    ))}
                </TabsHeader>
                <TabsBody className="overflow-auto h-full">
                    {data.map(({value, component}) => (
                        <TabPanel key={value} value={value} className="overflow-y-auto h-full p-10">
                            {component}
                        </TabPanel>
                    ))}
                    <div className="sticky bottom-0 p-4 flex justify-end bg-white z-50 justify-between">
                        {dialog && <Button onClick={dialog.handler} color="red" variant="outlined">Cancelar</Button>}
                        <Button disabled={!isValid} onClick={onSaveExcursion} color="green"
                                variant="outlined">Guardar</Button>
                    </div>
                </TabsBody>
            </Tabs>
        </div>
    );

    if (dialog) {
        return (
            <Dialog
                open={dialog.open}
                handler={dialog.handler}
                dismiss={{enabled: false}}
                size="xl"
            >
                {content}
            </Dialog>
        )
    }

    return content
}
