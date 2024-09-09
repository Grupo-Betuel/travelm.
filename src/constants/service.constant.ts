import {ServiceStatusTypes, ServiceTypes} from "../models/serviceModel";

export const SERVICE_CONSTANTS = {
    TYPES: ['excursion', 'flight', 'resort', 'hotel'] as ServiceTypes[],
    STATUS_TYPES: ['paid', 'reserved', 'interested', "free", "canceled"] as ServiceStatusTypes[],
}