import { RcFile } from 'antd/es/upload';

export const getBase64FromFile = (file: RcFile): Promise<string> => new Promise((resolve) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => resolve(reader.result as string));
  reader.readAsDataURL(file);
});
