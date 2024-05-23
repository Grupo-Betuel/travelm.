import {IFood} from "../../../../models/foodModel";
import React from "react";
import {Typography} from "@material-tailwind/react";
export interface IFoodDetailsProps { foods: IFood[] };
export const FoodDetails = ({foods}: IFoodDetailsProps) => (
    <div>
        <Typography variant="h5" className="mt-4 mb-2">Food Offerings</Typography>
        {foods.map((food, index) => (
            <div key={index} className="p-2 border rounded">
                <Typography variant="h6">{food.type}</Typography>
                <div>Menu: {food.menu}</div>
            </div>
        ))}
    </div>
);
