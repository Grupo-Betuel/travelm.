import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum';
import { useAppStore } from '@services/store';

export const handleLoginHook = () => {
  const clientEntity = useAppStore((state) => state.clients((statea) => statea));

  const login = async (clientData: { phone: string }) => {
    clientData.phone = clientData.phone.toString().replace(/[- ()]/g, '');
    return clientEntity.add(
      clientData,
      {
        endpoint: EndpointsAndEntityStateKeys.LOGIN,
      },
      true,
      1000 * 60 * 60 * 24 * 7,
    );
  };

  return {
    login,
  };
};
