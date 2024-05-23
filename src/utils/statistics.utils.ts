import {IExcursion} from "../models/excursionModel";

export function calculateExcursionsStatistics(excursions: IExcursion[]) {
    let totalClients = 0;
    let totalBenefit = 0;
    let totalDestinationsVisited = new Set<string>();
    let totalOrganizations = new Set<string>();
    let totalStars = 0;
    let reviewCount = 0;

    excursions.forEach(excursion => {
        // Total clients
        totalClients += excursion.clients.length;

        // Total benefit received from excursions
        if (excursion.finance) {
            totalBenefit += excursion.finance.price - (excursion?.finance?.cost || 0);
        }

        // Total destinations visited
        excursion.destinations.forEach(destination => destination?._id && totalDestinationsVisited.add(destination?._id));

        // Total organizations we have collaborated with
        excursion.organizations.forEach(org => org._id && totalOrganizations.add(org._id));
        if (excursion.transport) {
            excursion.transport?.organization?._id && totalOrganizations.add(excursion.transport.organization._id);
        }
        excursion.foods.forEach(food => food?.organization?._id && totalOrganizations.add(food.organization._id));

        // Average of satisfaction
        excursion.reviews.forEach(review => {
            totalStars += (review?.stars || 0);
            reviewCount++;
        });
    });

    const averageSatisfaction = reviewCount > 0 ? totalStars / reviewCount : 0;

    return {
        totalClients,
        totalBenefit,
        totalDestinationsVisited: totalDestinationsVisited.size,
        totalOrganizations: totalOrganizations.size,
        averageSatisfaction
    };
}
