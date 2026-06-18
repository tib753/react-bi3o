import React from "react";
import { alpha, useMediaQuery, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import PrevIcon from "../../icons/PrevIcon";
import NextIcon from "../../icons/NextIcon";
import { getCurrentModuleType } from "../../../helper-functions/getCurrentModuleType";
import { WhiteNext, WhitePrev } from "../visit-again/SliderSettings";
import { ModuleTypes } from "../../../helper-functions/moduleTypes";
const Next = ({ onClick, className, displayNoneOnMobile, sliderRef, isRtl: isRtlProp, currentSlide, totalSlides, slidesToShow }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const displayNone = isSmall ? (displayNoneOnMobile ? true : false) : false;
  const handleClick = isRtlProp && sliderRef ? () => sliderRef.current?.slickPrev?.() : onClick;
  const isAtStart = isRtlProp && (currentSlide || 0) <= 0;
  const visible = isRtlProp ? !(displayNone || isAtStart) : !(displayNone || className?.includes("slick-disabled"));
  return (
    <Box
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        left: "auto",
        height: "100%",
        width: "auto",
        background: "transparent",
        zIndex: 10,
        display: visible ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        margin: 0,
        opacity: 1,
        pointerEvents: "auto",
        ...(isSmall ? { display: "none" } : {}),
      }}
    >
      <Box
        className={`client-nav client-next ${className}`}
        onClick={handleClick}
        style={{
          top: "50%",
          zIndex: 1,
          right: 8,
          background: `linear-gradient(180deg, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, ${alpha(theme.palette.primary.main, 0.2)} 54.03%, ${alpha(
            theme.palette.primary.main,
            0.3
          )} 100%)`,
          borderRadius: "50%",
          cursor: "pointer",
        }}
      >
        <NextIcon />
      </Box>
    </Box>
  );
};
const Prev = ({ onClick, className, displayNoneOnMobile, sliderRef, isRtl: isRtlProp, currentSlide, totalSlides, slidesToShow }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const displayNone = isSmall ? (displayNoneOnMobile ? true : false) : false;
  const handleClick = isRtlProp && sliderRef ? () => sliderRef.current?.slickNext?.() : onClick;
  const maxIndex = Math.max(0, (totalSlides || 0) - Math.ceil(slidesToShow || 1));
  const isAtEnd = isRtlProp && (currentSlide || 0) >= maxIndex;
  const visible = isRtlProp ? !(displayNone || isAtEnd) : !(displayNone || className?.includes("slick-disabled"));
  return (
    <Box
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: "auto",
        height: "100%",
        width: "auto",
        background: "transparent",
        zIndex: 10,
        display: visible ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        margin: 0,
        opacity: 1,
        pointerEvents: "auto",
        ...(isSmall ? { display: "none" } : {}),
      }}
    >
      <Box
        className={`client-nav client-prev ${className}`}
        onClick={handleClick}
        style={{
          zIndex: 1,
          top: "50%",
          left: 0,
          background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.main} 54.03%, ${theme.palette.primary.main} 100%)`,
          cursor: "pointer",
        }}
      >
        <PrevIcon />
      </Box>
    </Box>
  );
};

export const moduleWiseNext = (extraProps) => {
  switch (getCurrentModuleType()) {
    case ModuleTypes.GROCERY:
      return <Next displayNoneOnMobile {...extraProps} />;
    case ModuleTypes.PHARMACY:
      return <WhiteNext noboxshadow displayNoneOnMobile {...extraProps} />;
    case ModuleTypes.ECOMMERCE:
      return <Next displayNoneOnMobile {...extraProps} />;
    case ModuleTypes.FOOD:
      return <WhiteNext noboxshadow displayNoneOnMobile {...extraProps} />;
  }
};
export const moduleWisePrev = (extraProps) => {
  switch (getCurrentModuleType()) {
    case ModuleTypes.GROCERY:
      return <Prev displayNoneOnMobile {...extraProps} />;
    case ModuleTypes.PHARMACY:
      return <WhitePrev noboxshadow {...extraProps} />;
    case ModuleTypes.ECOMMERCE:
      return <Prev displayNoneOnMobile {...extraProps} />;
    case ModuleTypes.FOOD:
      return <WhitePrev displayNoneOnMobile noboxshadow {...extraProps} />;
  }
};

