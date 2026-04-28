import React, { memo, useEffect, useState } from "react";
import { CustomImageContainerStyled } from "styled-components/CustomStyles.style";
import placeholder from "../../public/static/no-image-found.png";
import { Box } from "@mui/system";

const CustomImageContainer = ({
  cursor,
  mdHeight,
  maxWidth,
  height,
  width,
  objectFit,
  objectfit,
  minwidth,
  src,
  alt,
  borderRadius,
  marginBottom,
  smHeight,
  smMb,
  smMaxWidth,
  smWidth,
  aspectRatio,
  padding,
  loading,
    bg,
                                borderBottomRightRadius,
  ...rest
}) => {
  const resolvedObjectFit = objectFit ?? objectfit;
  const [imageFile, setState] = useState(null);
  useEffect(() => {
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

    setState(sanitizeSrc(src) || placeholder?.src);
  }, [src]);

  return (
    <CustomImageContainerStyled
      height={height}
      width={width}
      objectfit={resolvedObjectFit}
      minwidth={minwidth}
      border_radius={borderRadius}
      margin_bottom={marginBottom}
      smheight={smHeight}
      sm_mb={smMb}
      max_width={maxWidth}
      sm_max_width={smMaxWidth}
      sm_width={smWidth}
      md_height={mdHeight}
      cursor={cursor}
      aspect_ratio={aspectRatio}
      padding={padding}
      bg={bg}
      {...rest}
    >
      {!imageFile ? (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            border: (theme) => `1px solid ${theme.palette.neutral[200]}`,
          }}
        />
      ) : (
        <img
          src={imageFile}
          alt={alt || "image"}
          onError={() => {
            setState(placeholder?.src);
          }}
          loading={loading || "lazy"}
        />
      )}
    </CustomImageContainerStyled>
  );
};
export default memo(CustomImageContainer);
