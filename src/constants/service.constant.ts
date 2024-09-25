import {ServiceStatusTypes, ServiceTypes} from "../models/serviceModel";

export const SERVICE_CONSTANTS = {
    UPDATE_SERVICE_TEXT: 'Actualizar Servicio',
    ADD_SERVICE_TEXT: 'Agregar Servicio',
    TYPES: ['excursion', 'flight', 'resort', 'hotel'] as ServiceTypes[],
    STATUS_TYPES: ['paid', 'reserved', 'interested', "free", "canceled"] as ServiceStatusTypes[],
}