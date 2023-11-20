export const imageKitUrl = 'https://ik.imagekit.io/q8ymapdfm/';

export const gcloidUrl = 'https://storage.googleapis.com/betuel-tech-photos/';

export const parseGcloudUrlToImageKit = (url: string) => {
  const name = url.split(gcloidUrl).pop();
  return `${imageKitUrl}${name}`;
};
