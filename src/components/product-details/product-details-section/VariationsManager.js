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
  if (!selectedOptions) return -1;
  let index = -1;
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
  
  const translationByValue = productData.translations.find(
    (t) => t.locale === currentLanguage && 
           t.value && 
           t.value.toString().toLowerCase().trim() === defaultNameLower
  );
  if (translationByValue) return translationByValue.value;
  
  const translationByKey = productData.translations.find(
    (t) => t.locale === currentLanguage && 
           t.key && 
           t.key.toString().toLowerCase().trim() === defaultNameLower
  );
  if (translationByKey) return translationByKey.value;
  
  const matchingBaseTranslation = productData.translations.find(
    (t) => (t.locale === "ar" || t.locale === "en") && 
           t.value && 
           t.value.toString().toLowerCase().trim() === defaultNameLower
  );
  
  if (matchingBaseTranslation) {
    const currentLangTranslation = productData.translations.find(
      (t) => t.locale === currentLanguage && 
             t.key === matchingBaseTranslation.key
    );
    if (currentLangTranslation) return currentLangTranslation.value;
  }
  
  const translationContaining = productData.translations.find(
    (t) => t.locale === currentLanguage && 
           t.value && 
           t.value.toString().toLowerCase().includes(defaultNameLower)
  );
  if (translationContaining) return translationContaining.value;
  
  const anyLocaleMatch = productData.translations.find(
    (t) => t.value && t.value.toString().toLowerCase().trim() === defaultNameLower
  );
  if (anyLocaleMatch) {
    const currentLangTranslation = productData.translations.find(
      (t) => t.locale === currentLanguage && t.key === anyLocaleMatch.key
    );
    if (currentLangTranslation) return currentLangTranslation.value;
  }
  
  return defaultName;
};

const getTranslatedOption = (choice, optionValue, index) => {
  const currentLanguage = i18n.language || "ar";
  if (choice?.translations?.length > 0) {
    const translation = choice.translations.find(
      (t) => t.locale === currentLanguage && t.key === `option_${index}`
    );
    if (translation?.value) return translation.value;
  }
  return optionValue;
};

const getAttrTranslatedOption = (attr, optionValue, index) => {
  const currentLanguage = i18n.language || "ar";
  if (attr?.translations?.length > 0) {
    const translation = attr.translations.find(
      (t) => t.locale === currentLanguage && t.key === `option_${index}`
    );
    if (translation?.value) return translation.value;
  }
  return optionValue;
};

const isNewSystem = (data) => {
  return data?.product_attributes?.length > 0 || data?.product_variants?.length > 0;
};

const VariationsManager = ({ productDetailsData, handleChoices, isUnitWeightSelected, setIsUnitWeightSelected }) => {
  const theme = useTheme();
  const borderColor = theme.palette.primary.main;
  const newSystem = isNewSystem(productDetailsData);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [attrValues, setAttrValues] = useState({});

  // Old system state
  const [choice, setChoice] = useState(null);
  const [value, setValue] = useState(
    productDetailsData?.choice_options?.map((i) => {
      const idx = getSelectedIndex(i?.options, productDetailsData?.selectedOption?.[0]);
      return {
        type: i?.title,
        value: idx >= 0 ? i?.options[idx] : "",
      };
    })
  );

  useEffect(() => {
    if (isUnitWeightSelected) {
      if (newSystem) {
        setSelectedVariantId(null);
        setAttrValues({});
      } else {
        setValue((prev) =>
          prev.map((item) => ({ ...item, value: "" }))
        );
        setSelectedVariantId(null);
      }
    }
  }, [isUnitWeightSelected, newSystem]);

  const handleClick = (values, index, choice) => {
    setValue((prev) => {
      const newVal = prev.map((item, i) => ({ ...item }));
      newVal[index].value = values;
      return newVal;
    });
    setChoice(choice);
  };
  useEffect(() => {
    if (!newSystem) {
      handleChoice(value);
    }
  }, [value, newSystem]);
  const handleChoice = (value) => {
    let finalVariation = "";
    value.forEach((item) => {
      if (item.value) finalVariation += item.value;
    });
    const matched = productDetailsData?.variations?.find(
      (item) =>
        item.type.replaceAll("-", "").replaceAll(" ", "") ===
        finalVariation.replaceAll("-", "").replaceAll(" ", "")
    );

    if (isUnitWeightSelected) {
      if (matched && (matched.price > 0 || matched.weight > 0)) {
        setIsUnitWeightSelected(false);
        if (choice) handleChoices(matched, choice);
      }
      return;
    }

    if (matched && choice) {
      handleChoices(matched, choice);
    }
  };

  const handleAttrClick = (attrId, optionValue) => {
    setAttrValues((prev) => ({ ...prev, [attrId]: optionValue }));
  };

  const handleVariantClick = (variant) => {
    if (isUnitWeightSelected && setIsUnitWeightSelected) {
      setIsUnitWeightSelected(false);
    }
    setSelectedVariantId(variant.id);
    if (handleChoices) {
      handleChoices(variant, { name: variant.variant_name });
    }
  };

  return (
    <CustomStackFullWidth spacing={1.4}>
      {/* NEW SYSTEM: Product Attributes (descriptive) */}
      {newSystem && productDetailsData?.product_attributes?.map((attr) => (
        <CustomStackFullWidth key={attr.id}>
          <Typography fontWeight="600" paddingBottom="3px">
            {attr.attribute_name}
          </Typography>
          <CustomStackFullWidth direction="row" spacing={2}>
            {attr.attribute_values?.map((item, index) => (
              <CustomSizeBox
                key={index}
                onClick={() => handleAttrClick(attr.id, item)}
                size={item}
                productsize={attrValues[attr.id]}
              >
                <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                  {getAttrTranslatedOption(attr, item, index)}
                </Typography>
              </CustomSizeBox>
            ))}
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      ))}

      {/* NEW SYSTEM: Product Variants (real) */}
      {newSystem && productDetailsData?.product_variants?.map((variant) => (
        <CustomStackFullWidth key={variant.id}>
          <Typography fontWeight="600" paddingBottom="3px">
            {variant.variant_name}
          </Typography>
          <CustomStackFullWidth direction="row" spacing={2}>
            <CustomSizeBox
              onClick={() => handleVariantClick(variant)}
              size={variant.variant_name}
              productsize={selectedVariantId === variant.id ? variant.variant_name : ""}
            >
              <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                {variant.variant_name} - {variant.price} {t("DZD")}
              </Typography>
            </CustomSizeBox>
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      ))}

      {/* OLD SYSTEM: choice_options fallback */}
      {!newSystem && productDetailsData?.choice_options?.map((choice, choiceIndex) => (
        <CustomStackFullWidth key={choiceIndex}>
          <Typography fontWeight="600" paddingBottom="3px">
            {choice?.title ?? choice?.name ?? ''}
          </Typography>
          <CustomStackFullWidth direction="row" spacing={2}>
            {choice?.options?.map((item, index) => (
              <CustomSizeBox
                key={index}
                onClick={() => handleClick(item, choiceIndex, choice)}
                size={item}
                productsize={value[choiceIndex]?.value}
              >
                <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                  {getTranslatedOption(choice, item, index)}
                </Typography>
              </CustomSizeBox>
            ))}
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      ))}
      {!newSystem && productDetailsData?.selectedOption?.length > 0 &&
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
