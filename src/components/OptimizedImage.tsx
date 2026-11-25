import React from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({ src, alt = '', ...rest }) => {
  const avif = src.endsWith('.webp') ? src.replace(/\.webp$/, '.avif') : null;
  const image = <img src={src} alt={alt} decoding="async" {...rest} />;
  if (!avif) return image;
  return (
    <picture>
      <source srcSet={avif} type="image/avif" />
      {image}
    </picture>
  );
};
