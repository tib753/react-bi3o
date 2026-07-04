import React, { useEffect, useState } from "react";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import { Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import i18n from "i18next";
import { CustomSizeBox } from "../ProductDetails.style";

const getTranslatedName = (productData, defaultName) => {
  const currentLanguage = i18n.language || "ar";
  if (!defaultName) return defaultName;
  const lower = defaultName.toString().toLowerCase().trim();

  // Look in product_attributes own translations first
  const attr = productData?.product_attributes?.find(
    (a) => a.attribute_name?.toString().toLowerCase().trim() === lower
  );
  if (attr?.translations?.length > 0) {
    const fromAttr = attr.translations.find(
      (t) => t.locale === currentLanguage && t.key === lower
    );
    if (fromAttr) return fromAttr.value;
  }

  // Fallback to productData.translations
  if (productData?.translations?.length) {
    const byValue = productData.translations.find(
      (tr) => tr.locale === currentLanguage && tr.value?.toString().toLowerCase().trim() === lower
    );
    if (byValue) return byValue.value;
    const byKey = productData.translations.find(
      (tr) => tr.locale === currentLanguage && tr.key?.toString().toLowerCase().trim() === lower
    );
    if (byKey) return byKey.value;
    const anyLocale = productData.translations.find(
      (tr) => tr.value?.toString().toLowerCase().trim() === lower
    );
    if (anyLocale) {
      const currentLang = productData.translations.find(
        (tr) => tr.locale === currentLanguage && tr.key === anyLocale.key
      );
      if (currentLang) return currentLang.value;
    }
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

const groupDescriptiveAttributes = (attrs) => {
  if (!attrs?.length) return [];
  const currentLanguage = i18n.language || "ar";
  const map = {};
  attrs.forEach((attr) => {
    const name = attr.attribute_name;
    if (!map[name]) map[name] = { translations: attr.translations, values: [] };
    const vals = Array.isArray(attr.attribute_values)
      ? attr.attribute_values.flatMap((v) =>
          String(v).split(",").map((s) => s.trim()).filter(Boolean)
        )
      : String(attr.attribute_values || "").split(",").map((s) => s.trim()).filter(Boolean);
    const translatedVals = vals.map((v, idx) => {
      if (attr.translations?.length > 0) {
        const tr = attr.translations.find(
          (t) => t.locale === currentLanguage && t.key === `option_${idx}`
        );
        if (tr?.value) return tr.value;
      }
      return v;
    });
    map[name].values.push(...translatedVals);
  });
  return Object.entries(map).map(([name, data], idx) => ({
    groupId: idx,
    attribute_name: name,
    attribute_values: [...new Set(data.values)],
  }));
};

const groupPriceVariants = (variants) => {
  if (!variants?.length) return [];
  const map = {};
  variants.forEach((v) => {
    const name = v.variant_name;
    if (!map[name]) map[name] = [];
    map[name].push(v);
  });
  return Object.entries(map).map(([name, items], idx) => ({
    groupId: idx,
    variant_name: name,
    items,
  }));
};

const VariationsManager = ({
  productDetailsData,
  handleChoices,
  isUnitWeightSelected,
  setIsUnitWeightSelected,
}) => {
  const theme = useTheme();
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [attrValues, setAttrValues] = useState({});

  const [choice, setChoice] = useState(null);
  const [value, setValue] = useState(
    productDetailsData?.choice_options?.map((i) => {
      const idx = (() => {
        if (!productDetailsData?.selectedOption?.[0]) return -1;
        return i?.options?.findIndex((opt) =>
          productDetailsData.selectedOption[0]?.type?.split("-")?.includes(opt.trim())
        ) ?? -1;
      })();
      return {
        type: i?.title,
        value: idx >= 0 ? i?.options[idx] : "",
      };
    }) ?? []
  );

  const attrGroups = groupDescriptiveAttributes(productDetailsData?.product_attributes);
  const priceGroups = groupPriceVariants(productDetailsData?.product_variants);

  useEffect(() => {
    if (isUnitWeightSelected) {
      setSelectedVariantId(null);
      setAttrValues({});
      setValue((prev) => prev?.map((item) => ({ ...item, value: "" })) || []);
    }
  }, [isUnitWeightSelected]);

  const handleClick = (values, index, ch) => {
    setValue((prev) => {
      const newVal = prev.map((item, i) => ({ ...item }));
      newVal[index].value = values;
      return newVal;
    });
    setChoice(ch);
    setSelectedVariantId(null);
  };

  useEffect(() => {
    handleChoice(value);
  }, [value]);

  const handleChoice = (val) => {
    let finalVariation = "";
    val?.forEach((item) => {
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

  const handleAttrClick = (groupId, optionValue) => {
    setAttrValues((prev) => ({ ...prev, [groupId]: optionValue }));
  };

  const handleVariantClick = (variant) => {
    if (isUnitWeightSelected && setIsUnitWeightSelected) {
      setIsUnitWeightSelected(false);
    }
    setSelectedVariantId(variant.id);
    setValue((prev) => prev?.map((item) => ({ ...item, value: "" })) || []);
    if (handleChoices) {
      handleChoices(variant, { name: variant.variant_name });
    }
  };

  const hasChoiceOptions = productDetailsData?.choice_options?.length > 0;
  const hasVariations = productDetailsData?.variations?.length > 0;

  return (
    <CustomStackFullWidth spacing={1.4}>
      {attrGroups.map((group) => (
        <CustomStackFullWidth key={`attr-${group.groupId}`}>
          <Typography fontWeight="600" paddingBottom="3px">
            {getTranslatedName(productDetailsData, group.attribute_name)}
          </Typography>
          <CustomStackFullWidth direction="row" spacing={2} flexWrap="wrap">
            {group.attribute_values?.map((item, index) => (
              <CustomSizeBox
                key={index}
                onClick={() => handleAttrClick(group.groupId, item)}
                size={item}
                productsize={attrValues[group.groupId]}
              >
                <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                  {item}
                </Typography>
              </CustomSizeBox>
            ))}
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      ))}

      {priceGroups.map((group) => (
        <CustomStackFullWidth key={`price-${group.groupId}`}>
          <Typography fontWeight="600" paddingBottom="3px">
            {getTranslatedName(productDetailsData, group.variant_name)}
          </Typography>
          <CustomStackFullWidth direction="row" spacing={2} flexWrap="wrap">
            {group.items.map((variant) => (
              <CustomSizeBox
                key={variant.id}
                onClick={() => handleVariantClick(variant)}
                size={variant.weight_kg ? String(variant.weight_kg) : variant.variant_name}
                productsize={
                  selectedVariantId === variant.id
                    ? variant.weight_kg ? String(variant.weight_kg) : variant.variant_name
                    : ""
                }
              >
                <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                  {variant.weight_kg ? `${variant.weight_kg} ${t("kg")}` : variant.variant_name}
                </Typography>
              </CustomSizeBox>
            ))}
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      ))}

      {hasChoiceOptions &&
        productDetailsData?.choice_options?.map((ch, choiceIndex) => {
          const attrName = ch?.name || ch?.attribute_name || "";
          const choiceTitle = ch?.title || "";
          return (
          <CustomStackFullWidth key={`old-${choiceIndex}`}>
            <Typography fontWeight="600" paddingBottom="3px">
              {getTranslatedName(productDetailsData, attrName) || attrName}
            </Typography>
            {choiceTitle && (
              <Typography variant="subtitle2" color="text.secondary" paddingBottom="3px">
                {getTranslatedName(productDetailsData, choiceTitle) || choiceTitle}
              </Typography>
            )}
            <CustomStackFullWidth direction="row" spacing={2} flexWrap="wrap">
              {ch?.options?.map((item, index) => (
                <CustomSizeBox
                  key={index}
                  onClick={() => handleClick(item, choiceIndex, ch)}
                  size={item}
                  productsize={value[choiceIndex]?.value}
                >
                  <Typography fontSize={{ xs: "12px", sm: "14px" }}>
                    {getTranslatedOption(ch, item, index)}
                  </Typography>
                </CustomSizeBox>
              ))}
            </CustomStackFullWidth>
            </CustomStackFullWidth>
          );
        })}

      {hasVariations &&
        productDetailsData?.selectedOption?.length > 0 &&
        productDetailsData?.selectedOption?.[0]?.stock == 0 && (
          <Typography color="red">*{t("This variation is out of stock")}</Typography>
        )}
    </CustomStackFullWidth>
  );
};

export default VariationsManager;
