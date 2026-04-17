import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../layout/MainLayout";
import StoresWithFilter from "../home/stores-with-filter";
import SEO from "../seo";
import { getImageFullUrl } from "utils/CustomFunctions";

const AllStore = ({ configData }) => {
  return (
    <>
      <CssBaseline />
      <SEO
        title={configData ? `Store` : "Loading..."}
        image={getImageFullUrl(
          { value: configData?.logo_storage },
          "business_logo_url",
          configData,
          configData?.fav_icon,
          "/static/no-image-found.png"
        )}
        businessName={configData?.business_name}
      />

      <MainLayout configData={configData}>
        <StoresWithFilter />
      </MainLayout>
    </>
  );
};

export default AllStore;
