import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import React from "react";
import { ButtonLeft, ButtonRight } from "./index";
import { alpha, styled, useMediaQuery, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import PrevIcon from "../../icons/PrevIcon";
import NextIcon from "../../icons/NextIcon";
import { getCurrentModuleType } from "../../../helper-functions/getCurrentModuleType";
import Slider from "react-slick";
import FeaturedItemCard from "./card";
import PharmacyCategoryCard from "../../cards/PharmacyCategoryCard";
import { WhiteNext, WhitePrev } from "../visit-again/SliderSettings";
import { ModuleTypes } from "../../../helper-functions/moduleTypes";

const ButtonContainer = styled(Box)(({ theme, right, isdisabled }) => ({
  top: 0,
  height: "100%",
  width: "auto",
  background: "transparent",
  zIndex: 10,
  /* rtl:ignore */
  right: right === "true" && 0,
  /* rtl:ignore */
  left: right !== "true" && 0,
  position: "absolute",
  alignItems: "center",
  justifyContent: "center",
  display: isdisabled ? "none" : "flex",
  padding: 0,
  margin: 0,
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));
const PrevWrapper = styled(Box)(({ theme, isdisabled }) => ({
  zIndex: 1,
  top: "50%",
  left: 0,
  display: isdisabled && "none",
  background: (theme) =>
    `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.main} 54.03%, ${theme.palette.primary.main} 100%)`,
}));
const NextWrapper = styled(Box)(({ theme, isdisabled }) => ({
  top: "50%",
  zIndex: 1,
  right: 8,
  display: isdisabled && "none",
  background: `linear-gradient(180deg, ${alpha(
    theme.palette.primary.main,
    0.1
  )} 0%, ${alpha(theme.palette.primary.main, 0.2)} 54.03%, ${alpha(
    theme.palette.primary.main,
    0.3
  )} 100%)`,
  borderRadius: "50%",
}));
const Next = ({ onClick, className, displayNoneOnMobile }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const displayNone = isSmall ? (displayNoneOnMobile ? true : false) : false;
  return (
    <ButtonContainer
      isdisabled={displayNone || className?.includes("slick-disabled")}
      right="true"
    >
      <NextWrapper
        className={`client-nav client-next ${className}`}
        onClick={onClick}
        isdisabled={className?.includes("slick-disabled")}
      >
        <NextIcon />
      </NextWrapper>
    </ButtonContainer>
  );
};
const Prev = ({ onClick, className, displayNoneOnMobile }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const displayNone = isSmall ? (displayNoneOnMobile ? true : false) : false;
  return (
    <ButtonContainer
      isdisabled={displayNone || className?.includes("slick-disabled")}
    >
      <PrevWrapper
        className={`client-nav client-prev ${className}`}
        onClick={onClick}
        isdisabled={className?.includes("slick-disabled")}
      >
        <PrevIcon />
      </PrevWrapper>
    </ButtonContainer>
  );
};

export const moduleWiseNext = () => {
  switch (getCurrentModuleType()) {
    case ModuleTypes.GROCERY:
      return <Next displayNoneOnMobile />;
    case ModuleTypes.PHARMACY:
      return <WhiteNext noboxshadow displayNoneOnMobile />;
    case ModuleTypes.ECOMMERCE:
      return <Next displayNoneOnMobile />;
    case ModuleTypes.FOOD:
      return <WhiteNext noboxshadow displayNoneOnMobile />;
  }
};
export const moduleWisePrev = () => {
  switch (getCurrentModuleType()) {
    case ModuleTypes.GROCERY:
      return <Prev displayNoneOnMobile />;
    case ModuleTypes.PHARMACY:
      return <WhitePrev noboxshadow />;
    case ModuleTypes.ECOMMERCE:
      return <Prev displayNoneOnMobile />;
    case ModuleTypes.FOOD:
      return <WhitePrev displayNoneOnMobile noboxshadow />;
  }
};

