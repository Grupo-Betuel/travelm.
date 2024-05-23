import { ICheckpoint } from '../models/checkpointModel';
import { IMedia } from '../models/mediaModel';
import { IClient } from '../models/clientModel';
import { IActivity } from '../models/activitiesModel';
import { IFood } from '../models/foodModel';
import { IProjection } from '../models/projectionModel';
import { IExcursion } from '../models/excursionModel';

// Validation function for step 0: Informacion
const validateStep0 = (formData: IExcursion): string[] => {
    const errors: string[] = [];
    if (!formData.title) errors.push('Title is required.');
    if (!formData.description) errors.push('Description is required.');
    if (!formData.startDate) errors.push('Start date is required.');
    if (!formData.endDate) errors.push('End date is required.');
    return errors;
};

// Validation function for step 1: Checkpoints
const validateStep1 = (formData: IExcursion): string[] => {
    const errors: string[] = [];
    if (!formData.checkpoints || formData.checkpoints.length === 0) {
        errors.push('At least one checkpoint is required.');
    } else {
        formData.checkpoints.forEach((checkpoint: ICheckpoint, index: number) => {
            if (!checkpoint.location || !checkpoint.location.address) {
                errors.push(`Checkpoint ${index + 1}: Location address is required.`);
            }
            // Add more validation rules for checkpoint if needed
        });
    }
    return errors;
};

// Validation function for step 2: Media
const validateStep2 = (formData: IExcursion): string[] => {
    const errors: string[] = [];
    if (!formData.flyer) errors.push('Flyer is required.');
    // Add validation rules for media if needed
    return errors;
};

// Validation function for step 3: Clients
const validateStep3 = (formData: IExcursion): string[] => {
    const errors: string[] = [];
    if (!formData.clients || formData.clients.length === 0) {
        errors.push('At least one client is required.');
    } else {
        formData.clients.forEach((client: IClient, index: number) => {
            if (!client.firstName || !client.lastName) {
                errors.push(`Client ${index + 1}: First name and last name are required.`);
            }
            // Add more validation rules for client if needed
        });
    }
    return errors;
};

// Validation function for step 4: Activities
const validateStep4 = (formData: IExcursion): string[] => {
    const errors: string[] = [];
    if (!formData.activities || formData.activities.length === 0) {
        errors.push('At least one activity is required.');
    } else {
        formData.activities.forEach((activity: IActivity, index: number) => {
            if (!activity.title) {
                errors.push(`Activity ${index + 1}: Title is required.`);
            }
            // Add more validation rules for activity if needed
        });
    }
    return errors;
};

// Validation function for step 5: Foods
const validateStep5 = (formData: IExcursion): string[] => {
    const errors: string[] = [];
    if (!formData.foods || formData.foods.length === 0) {
        errors.push('At least one food item is required.');
    } else {
        formData.foods.forEach((food: IFood, index: number) => {
            if (!food.menu) {
                errors.push(`Food ${index + 1}: Menu is required.`);
            }
            // Add more validation rules for food if needed
        });
    }
    return errors;
};

// Validation function for step 6: Projections
const validateStep6 = (formData: IExcursion): string[] => {
    const errors: string[] = [];
    if (!formData.projections || formData.projections.length === 0) {
        errors.push('At least one projection is required.');
    } else {
        formData.projections.forEach((projection: IProjection, index: number) => {
            if (!projection.date) {
                errors.push(`Projection ${index + 1}: Date is required.`);
            }
            // Add more validation rules for projection if needed
        });
    }
    return errors;
};


const validateStep7 = (formData: IExcursion): string[] => {
    const errors: string[] = [];
    if (!formData.projections || formData.projections.length === 0) {
        errors.push('At least one projection is required.');
    } else {
        formData.projections.forEach((projection: IProjection, index: number) => {
            if (!projection.date) {
                errors.push(`Projection ${index + 1}: Date is required.`);
            }
            // Add more validation rules for projection if needed
        });
    }
    return errors;
};

// Define validation functions for other steps as needed...

export { validateStep0, validateStep1, validateStep2, validateStep3, validateStep4, validateStep5, validateStep6, validateStep7 };
