import React from "react";
import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { getCurrentModuleType } from "../../helper-functions/getCurrentModuleType";

const getItemsOrFoodsText = (t) => {
  const moduleType = getCurrentModuleType();
  if (moduleType === "food") {
    return t("foods");
  } else if (moduleType === "rental") {
    return t("Vehicles");
  } else {
    return t("items");
  }
};

const getStoresOrRestaurantsText = (t) => {
  const moduleType = getCurrentModuleType();
  if (moduleType === "food") {
    return t("Restaurants");
  } else if (moduleType === "rental") {
    return t("Providers");
  } else {
    return t("Stores");
  }
};

export default function SearchResult({ searchValue, count, currentTab }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const itemsWord = getItemsOrFoodsText(t);
  const storesWord = getStoresOrRestaurantsText(t);
  const forYouText = t("for you !");
  const itemsText = `${itemsWord} ${forYouText}`;
  const storesText = `${storesWord} ${forYouText}`;
  return (
    <Grid item container md={12} lg={12} xs={12}>
      <Grid
        item
        md={12}
        lg={12}
        xs={12}
        sx={{
          padding: "10px 0px",
        }}
      >
        <Typography
          sx={{ textAlign: "center" }}
          color={theme.palette.text.customText1}
          fontSize="16px"
        >
          {t("Search result for")}{" "}
          <Typography
            component="span"
            color={theme.palette.primary.main}
            fontSize="16px"
            fontWeight="500"
            textTransform="capitalize"
          >
            {`"${searchValue ? searchValue : "search"}"`}{" "}
          </Typography>
          <Typography
            component="span"
            color={theme.palette.primary.main}
            fontWeight="500"
            fontSize="16px"
          >
            {count}{" "}
          </Typography>
          {currentTab === "items" ? itemsText : storesText}{" "}
        </Typography>
      </Grid>
    </Grid>
  );
}
