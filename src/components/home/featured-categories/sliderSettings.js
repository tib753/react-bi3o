import React from "react";
import { alpha, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import PrevIcon from "../../icons/PrevIcon";
import NextIcon from "../../icons/NextIcon";

const Prev = ({ onClick, className }) => {
  const theme = useTheme();
  return (
    <Box
      className={className}
      style={{
        position: "absolute",
        left: 0,
        right: "auto",
        zIndex: 10,
        top: 0,
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: `linear-gradient(180deg, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, ${alpha(theme.palette.primary.main, 0.2)} 54.03%, ${alpha(
            theme.palette.primary.main,
            0.3
          )} 100%)`,
          cursor: "pointer",
          zIndex: 1,
        }}
      >
        <PrevIcon />
      </Box>
    </Box>
  );
};

const Next = ({ onClick, className }) => {
  const theme = useTheme();
  return (
    <Box
      className={className}
      style={{
        position: "absolute",
        right: 0,
        left: "auto",
        zIndex: 10,
        top: 0,
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: theme.palette.primary.main,
          cursor: "pointer",
          zIndex: 1,
        }}
      >
        <NextIcon />
      </Box>
    </Box>
  );
};

export const moduleWiseNext = () => <Next />;
export const moduleWisePrev = () => <Prev />;
