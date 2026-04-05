import React, { useEffect, useRef, useState } from "react";

import { ListItemIcon, MenuItem, Stack, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import eng from "../../../../public/landingpage/us.svg";
import arabicImg from "../../../../public/landingpage/arabic-flag-svg.svg";

import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import i18n, { t } from "i18next";
import { useTheme } from "@mui/material/styles";
import { StyledMenu, TopBarButton } from "../NavBar.style";
import { useSettings } from "contexts/use-settings";
import Image from "next/image";

const getValues = (settings) => ({
  direction: settings.direction,
  responsiveFontSizes: settings.responsiveFontSizes,
  theme: settings.theme,
});

const CustomLanguage = ({ formmobilemenu }) => {
  const { configData } = useSelector((state) => state.configData);
  const theme = useTheme();
  const [language, setLanguage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const { settings, saveSettings } = useSettings();
  const [values, setValues] = useState(getValues(settings));
  const anchorRef = useRef(null);
  //const { configData } = useSelector((state) => state.configDataSettings);
  useEffect(() => {
    if (typeof window !== "undefined") {
      let languageSetting = JSON.parse(
        localStorage.getItem("language-setting")
      );
      localStorage.setItem(
        "language-setting",
        JSON.stringify(languageSetting || i18n.language)
      );
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let languageSetting = JSON.parse(
        localStorage.getItem("language-setting")
      );
      if (languageSetting) {
        setLanguage(languageSetting);
        i18n.changeLanguage(languageSetting);
      }
    }
  }, [language]);

  const handleClick = (event) => {
    // i18n.changeLanguage(language)
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    settings && setValues(getValues(settings));
  }, [settings]);
  const open = Boolean(anchorEl);

  const handleChangeLanguage = async (lan) => {
    try {
      // تغيير اللغة
      await i18n.changeLanguage(lan);
      setLanguage(lan);
      localStorage.setItem("language-setting", JSON.stringify(lan));
      
      // تحديث إعدادات الاتجاه
      const newDirection = lan === "en" ? "ltr" : "rtl";
      const newSettings = {
        ...values,
        direction: newDirection,
      };
      
      // حفظ الإعدادات الجديدة
      await saveSettings(newSettings);
      
      // إظهار رسالة النجاح
      toast.success(t("Language changed"));
      
      // إغلاق القائمة المنسدلة
      setAnchorEl(null);
      
      // إعادة تحميل الصفحة بعد تغيير اللغة
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Error changing language:", error);
      toast.error(t("Failed to change language"));
    }
  };

  return (
    <>
      <TopBarButton
        formmobilemenu={formmobilemenu}
        // id="demo-customized-button"
        variant="text"
        size="small"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        disableElevation
        onClick={handleClick}
        startIcon={
          <Stack color={theme.palette.neutral[1000]}>
            <Image
              width={20}
              height={21}
              src={language === "en" ? eng.src : arabicImg.src}
              alt="Language Image"
              priority={true}
            />
          </Stack>
        }
        endIcon={
          <Stack color={theme.palette.neutral[1000]}>
            <KeyboardArrowDownIcon />
          </Stack>
        }
      >
        <Typography color={theme.palette.neutral[1000]}>
          {language === "en" ? "English" : "Arabic"}
        </Typography>
      </TopBarButton>
      <StyledMenu
        disableScrollLock={true}
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {configData?.language?.map((lan, index) => (
          <MenuItem
            onClick={() => handleChangeLanguage(lan.key)}
            disableRipple
            key={index}
            sx={{
              "&:hover": {
                backgroundColor: "primary.main",
              },
            }}
          >
            <ListItemIcon>
              <Image
                  width={20}
                  height={21}
                  src={language === "en" ? eng.src : arabicImg.src}
                  alt="Language Image"
                  priority={true}
              />
            </ListItemIcon>
            {lan.value}
          </MenuItem>
        ))}
      </StyledMenu>
    </>
  );
};

CustomLanguage.propTypes = {};

export default CustomLanguage;
