import { BETUEL_GROUP_WHATSAPP_NUMBER } from './constants/company.constants';

export const contactUsByWhatsappLink = (text: string) => `https://wa.me/${BETUEL_GROUP_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
