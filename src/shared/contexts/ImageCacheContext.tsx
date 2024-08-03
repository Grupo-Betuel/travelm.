import React, {
  createContext, useContext, useState,
} from 'react';

interface ImageCacheContextProps {
  cacheImage: (url: string) => void;
  isImageCached: (url: string) => boolean;
}

const ImageCacheContext = createContext<ImageCacheContextProps | undefined>(
  undefined,
);

export const ImageCacheProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cachedImages, setCachedImages] = useState<Set<string>>(new Set());

  const cacheImage = (url: string) => {
    // if (isImageCached(url)) return;
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setCachedImages((prev) => new Set(prev).add(url));
    };
  };

  const isImageCached = (url: string) => cachedImages.has(url);

  return (
    <ImageCacheContext.Provider value={{ cacheImage, isImageCached }}>
      {children}
    </ImageCacheContext.Provider>
  );
};

export const useImageCache = (): ImageCacheContextProps => {
  const context = useContext(ImageCacheContext);
  if (!context) {
    throw new Error('useImageCache must be used within an ImageCacheProvider');
  }
  return context;
};
