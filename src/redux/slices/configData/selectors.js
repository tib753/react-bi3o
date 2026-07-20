import { createSelector } from "@reduxjs/toolkit";

const selectConfigDataSlice = (state) => state.configData;

export const selectConfigData = createSelector(
  selectConfigDataSlice,
  (slice) => slice.configData
);

export const selectLanguage = createSelector(
  selectConfigDataSlice,
  (slice) => slice.language
);

export const selectCountryCode = createSelector(
  selectConfigDataSlice,
  (slice) => slice.countryCode
);

export const selectModules = createSelector(
  selectConfigDataSlice,
  (slice) => slice.modules
);

export const selectLandingPageData = createSelector(
  selectConfigDataSlice,
  (slice) => slice.landingPageData
);
