import React from "react";
import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useTranslation } from "react-i18next";
import { getSelectedAddOn } from "../../helper-functions/CardHelpers";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import VisibleVariations from "./FoodVariations";
import { OrderFoodSubtitle } from "../checkout/CheckOut.style";

const VariationContent = ({ cartItem }) => {
  const { t } = useTranslation();
  const handleProduct = () => {
    return (
      <Stack>
        {cartItem?.descriptive_attrs && Object.keys(cartItem.descriptive_attrs).length > 0 &&
          Object.entries(cartItem.descriptive_attrs).map(([key, value]) => (
            <Typography key={key} color="customColor.textGray" fontSize="12px">
              {key} : {value}
            </Typography>
          ))
        }
        {cartItem?.choice_options?.length > 0 && cartItem?.selectedOption?.[0]?.type &&
          cartItem?.choice_options?.map((item, index) => (
            <Stack key={index}>
              <Typography color="customColor.textGray" fontSize="12px">
                {item?.title} :{" "}
                {cartItem?.selectedOption?.[0]?.type.split("-")?.[index]}
              </Typography>
            </Stack>
          ))
        }
        {(!cartItem?.choice_options?.length || !cartItem?.selectedOption?.[0]?.type) &&
          cartItem?.selectedOption?.[0] && (
            <Typography color="customColor.textGray" fontSize="12px">
              {cartItem?.selectedOption?.[0]?.type}
              {cartItem?.selectedOption?.[0]?.weight_kg
                ? ` (${cartItem.selectedOption[0].weight_kg} ${t("kg")})`
                : ""}
            </Typography>
          )
        }
      </Stack>
    );
  };
  const handleFood = () => {
    return (
      <CustomStackFullWidth>
        <VisibleVariations variations={cartItem?.food_variations} t={t} />
        {cartItem?.selectedAddons?.length > 0 && (
          <Stack direction="row" alignItems="center" flexWrap="wrap" gap="5px">
            <OrderFoodSubtitle>{t("Addon")}</OrderFoodSubtitle>
            <OrderFoodSubtitle>:</OrderFoodSubtitle>
            <OrderFoodSubtitle>
              {getSelectedAddOn(cartItem?.selectedAddons)}
            </OrderFoodSubtitle>
          </Stack>
        )}
      </CustomStackFullWidth>
    );
  };

  return (
    <div>
      {cartItem?.module_type === "food" ? handleFood() : handleProduct()}
    </div>
  );
};

VariationContent.propTypes = {};

export default VariationContent;
