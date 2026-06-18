import React from "react";
import { alpha, useMediaQuery, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import PrevIcon from "../../icons/PrevIcon";
import NextIcon from "../../icons/NextIcon";
import { getCurrentModuleType } from "../../../helper-functions/getCurrentModuleType";
import { WhiteNext, WhitePrev } from "../visit-again/SliderSettings";
import { ModuleTypes } from "../../../helper-functions/moduleTypes";
const Next = ({ onClick, displayNoneOnMobile, className }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  if (isSmall && displayNoneOnMobile) return null;
  return (
    <Box
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        left: "auto",
        height: "100%",
        width: "auto",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        margin: 0,
      }}
    >
      <Box
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          background: `linear-gradient(180deg, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, ${alpha(theme.palette.primary.main, 0.2)} 54.03%, ${alpha(
            theme.palette.primary.main,
            0.3
          )} 100%)`,
          borderRadius: "50%",
          cursor: "pointer",
          width: 36,
          height: 36,
        }}
      >
        <NextIcon />
      </Box>
    </Box>
  );
};
const Prev = ({ onClick, displayNoneOnMobile, className }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  if (isSmall && displayNoneOnMobile) return null;
  return (
    <Box
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: "auto",
        height: "100%",
        width: "auto",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        margin: 0,
      }}
    >
      <Box
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.main} 54.03%, ${theme.palette.primary.main} 100%)`,
          cursor: "pointer",
          width: 36,
          height: 36,
          borderRadius: "50%",
        }}
      >
        <PrevIcon />
      </Box>
    </Box>
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

