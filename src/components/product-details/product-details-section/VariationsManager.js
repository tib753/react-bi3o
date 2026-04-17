import React, { useEffect, useReducer, useState } from "react";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import { Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import i18n from "i18next";
import { Stack } from "@mui/system";
import { CustomColorBox, CustomSizeBox } from "../ProductDetails.style";
import CheckIcon from "@mui/icons-material/Check";
import { ACTION, initialState, reducer } from "./states";

const getSelectedIndex = (options, selectedOptions) => {
  let index = 0;
  options?.forEach((option, indexNumber) => {
    if (selectedOptions?.type?.split("-")?.includes(option.trim())) {
      index = indexNumber;
    }
  });
  return index;
};

const getTranslatedName = (productData, defaultName, type = "title") => {
  const currentLanguage = i18n.language || "ar";
  if (productData?.translations?.length > 0) {
    const translation = productData.translations.find(
      (t) => t.locale === currentLanguage && t.key === type && t.value.toLowerCase().includes(defaultName.toLowerCase())
    );
    if (!translation && type === "title") {
       // try finding by key match only if title
       const translationByKey = productData.translations.find(t => t.locale === currentLanguage && t.key === defaultName);
       if (translationByKey) return translationByKey.value;
    }
    return translation ? translation.value : defaultName;
  }
  return defaultName;
};

const VariationsManager = ({ productDetailsData, handleChoices }) => {
  console.log("VariationsManager Data:", productDetailsData);
  const theme = useTheme();
  const borderColor = theme.palette.primary.main;
  const [choice, setChoice] = useState(null);
  const [value, setValue] = useState(
    productDetailsData?.choice_options?.map((i) => ({
      type: i?.title,
      value:
        i?.options[
          getSelectedIndex(i?.options, productDetailsData?.selectedOption?.[0])
        ],
    }))
  );
  const handleClick = (values, index, choice) => {
    setValue((prev) => {
      prev[index].value = values;
      return [...prev];
    });
    setChoice(choice);
  };
  useEffect(() => {
    handleChoice(value);
  }, [value]);
  const handleChoice = (value) => {
    let finalVariation = "";
    value.forEach((item) => (finalVariation += item.value));
    let option = productDetailsData?.variations?.filter(
      (item) =>
        item.type.replaceAll("-", "").replaceAll(" ", "") ===
        finalVariation.replaceAll("-", "").replaceAll(" ", "")
    );

    if (choice && option?.length > 0) {
      handleChoices(option[0], choice);
    }
  };
  return (
    <CustomStackFullWidth spacing={1.4}>
      {productDetailsData?.choice_options?.map((choice, choiceIndex) => (
        <CustomStackFullWidth key={choiceIndex}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography fontWeight="600" paddingBottom="3px">
              {getTranslatedName(productDetailsData, choice?.title)}
            </Typography>
            {/*<Typography fontWeight="600">:</Typography>*/}
            {/*<Typography fontWeight="400">{state.productColor}</Typography>*/}
          </Stack>
          <CustomStackFullWidth direction="row" spacing={2}>
            {choice?.options?.map((item, index) => (
              <CustomSizeBox
                key={index}
                onClick={() => handleClick(item, choiceIndex, choice)}
                size={item}
                productsize={value[choiceIndex]?.value}
              >
                <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                  {getTranslatedName(productDetailsData, item, "option")}
                </Typography>
              </CustomSizeBox>
            ))}
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      ))}
      {productDetailsData?.selectedOption?.length > 0 &&
      productDetailsData?.selectedOption?.[0]?.stock == 0 ? (
        <Typography color="red">
          *{t("This variation is out of stock")}
        </Typography>
      ) : (
        <Typography></Typography>
      )}
    </CustomStackFullWidth>
  );
};

export default VariationsManager;
