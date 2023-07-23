import { isExpired } from 'react-jwt';
import { ClientEntity } from '@shared/entities/ClientEntity';
import { BaseService } from '@services/BaseService';
import { ClientService } from '@services/clientService';

const clientService = new ClientService();

export const resetAuthData = () => {
  localStorage.removeItem(clientService.localStorageKey.add);
};

export const appLogOut = () => {
  resetAuthData();
  location.reload();
};

// @ts-ignore
export const getAuthData = (
  type: keyof ClientEntity | 'all' = 'token',
): string | ClientEntity => {
  try {
    if (typeof window !== 'undefined') {
      const authString = localStorage && localStorage.getItem(clientService.localStorageKey.add);
      const authData = JSON.parse(authString || '{}') as ClientEntity;
      const tokenIsExpired = authData.token && isExpired(authData.token);

      if (!authString || tokenIsExpired) {
        resetAuthData();
        return '';
      }

      return (type === 'all' ? authData : authData[type]) as any;
    }
    return '';
  } catch (err: any) {
    console.log('errrrorrr', err.message);
    return '';
  }
};
