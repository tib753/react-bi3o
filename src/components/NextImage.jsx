"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import placeholder from "../../public/static/no-image-found.png";

const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#e5e4e4" offset="20%" />
      <stop stop-color="#ddd" offset="50%" />
      <stop stop-color="#e5e4e4" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#e5e4e4" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

const NextImage = ({
   src,
   altSrc = placeholder,
   alt = "Image",
   width,
   height,
   objectFit,
   borderRadius,
   aspectRatio,
   ...props
 }) => {
  const sanitizeSrc = (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === "object") return value;

    const s = String(value).trim();
    if (!s) return null;
    if (s === "null" || s === "undefined") return null;
    if (s.includes("/null") || s.includes("/undefined")) return null;
    if (s.endsWith("/null") || s.endsWith("/undefined")) return null;
    return s;
  };

  const [currentSrc, setCurrentSrc] = useState(
    sanitizeSrc(src) || sanitizeSrc(altSrc) || placeholder
  );

  useEffect(() => {
    setCurrentSrc(sanitizeSrc(src) || sanitizeSrc(altSrc) || placeholder);
  }, [src, altSrc]);

  const handleError = () => {
    if (altSrc && currentSrc !== altSrc) {
      setCurrentSrc(altSrc);
    }
  };

  const shimmerWidth = typeof width === "number" && width > 0 ? width : 1;
  const shimmerHeight = typeof height === "number" && height > 0 ? height : 1;

  // Conditionally create style object
  const style = {
    objectFit,
    borderRadius,
    aspectRatio,
    ...props.style, // allow passing additional styles
  };

  return (
    <Image
      src={currentSrc}
      width={width}
      height={height}
      alt={alt}
      onError={handleError}
      placeholder={`data:image/svg+xml;base64,${toBase64(
        shimmer(shimmerWidth, shimmerHeight)
      )}`}
      style={style}

      {...props}
    />
  );
};

export default NextImage;