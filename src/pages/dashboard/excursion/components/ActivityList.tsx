import React, { useState } from 'react';
import { Card, CardBody, Tabs, TabsHeader, Tab, TabsBody, TabPanel, Button } from "@material-tailwind/react";
import {IActivity} from "../../../../models/activitiesModel";
interface ActivitiesProps {
    activities: IActivity[];
}

export const ActivityDetails: React.FC<ActivitiesProps> = ({ activities }) => {
    const [activeTab, setActiveTab] = useState<string>(activities[0].title);

    return (
        <Card>
            <CardBody>
                <Tabs value={activeTab} onChange={(newValue: string) => setActiveTab(newValue)}>
                    <TabsHeader>
                        {activities.map((activity, index) => (
                            <Tab key={index} value={activity.title}>
                                {activity.title}
                            </Tab>
                        ))}
                        <Tab value="Add New Activity">Add New Activity</Tab>
                    </TabsHeader>
                    <TabsBody>
                        {activities.map((activity, index) => (
                            <TabPanel key={index} value={activity.title}>
                                <div className="p-4">
                                    <h5 className="text-lg">{activity.title}</h5>
                                    <div dangerouslySetInnerHTML={{__html: activity.description}} />
                                    <Button color="blue" className="mt-2">Edit Activity</Button>
                                </div>
                            </TabPanel>
                        ))}
                        <TabPanel value="Add New Activity">
                            <div className="p-4">
                                <h5 className="text-lg">Add New Activity</h5>
                                {/* Form for adding new activity */}
                                <Button color="green" className="mt-2">Add Activity</Button>
                            </div>
                        </TabPanel>
                    </TabsBody>
                </Tabs>
            </CardBody>
        </Card>
    );
};
