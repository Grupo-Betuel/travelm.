import { useEffect, useState } from 'react';
import { ClientEntity } from '@shared/entities/ClientEntity';
import { getAuthData } from '../../utils/auth.utils';

export const useAuthClientHook = () => {
  const authClient = getAuthData('all') as ClientEntity;
  const [client, setClient] = useState<ClientEntity>();
  useEffect(() => {
    if (authClient && !client) setClient(authClient);
  }, [authClient]);
  return {
    client,
  };
};
