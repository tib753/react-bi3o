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
  if (!defaultName || !productData?.translations?.length) return defaultName;
  
  const defaultNameLower = defaultName.toString().toLowerCase().trim();
  
  // Search 1: Look for translation where the VALUE matches the defaultName (e.g., key="Weight", value="وزن" or "Poids")
  // This handles cases where the backend sends translation with the Arabic text as value
  const translationByValue = productData.translations.find(
    (t) => t.locale === currentLanguage && 
           t.value && 
           t.value.toString().toLowerCase().trim() === defaultNameLower
  );
  if (translationByValue) return translationByValue.value;
  
  // Search 2: Look for translation where the KEY matches the defaultName exactly
  const translationByKey = productData.translations.find(
    (t) => t.locale === currentLanguage && 
           t.key && 
           t.key.toString().toLowerCase().trim() === defaultNameLower
  );
  if (translationByKey) return translationByKey.value;
  
  // Search 3: Look for translation where the KEY is "name" or "title" and the value in another language matches
  // This handles variations where title might be stored with key="title" and Arabic value
  const allTranslationKeys = productData.translations.filter(
    (t) => t.key === type || t.key === "name"
  );
  
  // Check if any Arabic/English translation value matches our defaultName
  const matchingBaseTranslation = productData.translations.find(
    (t) => (t.locale === "ar" || t.locale === "en") && 
           t.value && 
           t.value.toString().toLowerCase().trim() === defaultNameLower
  );
  
  if (matchingBaseTranslation) {
    // Found a base translation, now find the current language version
    const currentLangTranslation = productData.translations.find(
      (t) => t.locale === currentLanguage && 
             t.key === matchingBaseTranslation.key
    );
    if (currentLangTranslation) return currentLangTranslation.value;
  }
  
  // Search 4: Original search - check if translation value CONTAINS the default name
  const translationContaining = productData.translations.find(
    (t) => t.locale === currentLanguage && 
           t.value && 
           t.value.toString().toLowerCase().includes(defaultNameLower)
  );
  if (translationContaining) return translationContaining.value;
  
  // If no translation found, return original
  return defaultName;
};

const VariationsManager = ({ productDetailsData, handleChoices }) => {
  const theme = useTheme();
  // Debug logging for translations
  if (productDetailsData?.choice_options?.length > 0) {
    console.log("=== TRANSLATION DEBUG ===");
    console.log("Current Language:", i18n.language);
    console.log("Choice Options:", productDetailsData.choice_options);
    console.log("Translations Array:", productDetailsData.translations);
    productDetailsData.choice_options.forEach((choice, idx) => {
      const translated = getTranslatedName(productDetailsData, choice?.title);
      console.log(`Choice ${idx}: "${choice?.title}" -> Translated: "${translated}"`);
    });
    console.log("========================");
  }
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
