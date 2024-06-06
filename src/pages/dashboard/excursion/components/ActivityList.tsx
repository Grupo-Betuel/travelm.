import React, {useEffect, useState} from 'react';
import {
    Card,
    CardBody,
    Tabs,
    TabsHeader,
    Tab,
    TabsBody,
    TabPanel,
    Button,
    CardHeader,
    Typography
} from "@material-tailwind/react";
import {IActivity} from "../../../../models/activitiesModel";

interface ActivitiesProps {
    activities: IActivity[];
}

export const ActivityDetails: React.FC<ActivitiesProps> = ({activities}) => {
    const [activeTab, setActiveTab] = useState<string>(activities[0].title);

    useEffect(() => {
        setActiveTab(activities[0].title);
    }, [activities]);

    return (
        <Card className="mt-10">
            <CardHeader color="blue" className="p-5">
                <Typography variant="h4" color="white">Actividades</Typography>
            </CardHeader>
            <CardBody>
                <Tabs value={activeTab}>
                    <TabsHeader>
                        {activities.map((activity, index) => (
                            <Tab key={`activity-${index}`} value={activity.title}
                                 onClick={() => setActiveTab(activity.title)}>
                                {activity.title}
                            </Tab>
                        ))}
                    </TabsHeader>
                    <TabsBody>
                        {activities.map((activity, index) => (
                            <TabPanel key={`panel-${index}`} value={activity.title}>
                                <div className="p-4">
                                    <h5 className="text-lg">{activity.title}</h5>
                                    <div dangerouslySetInnerHTML={{__html: activity.description}}/>
                                    <Button color="blue" className="mt-2">Edit Activity</Button>
                                </div>
                            </TabPanel>
                        ))}
                    </TabsBody>
                </Tabs>
            </CardBody>
        </Card>
    );
};
