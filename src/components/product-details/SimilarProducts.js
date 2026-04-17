import React, { useEffect, useRef, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  CustomStackFullWidth,
  SliderCustom,
} from "../../styled-components/CustomStyles.style";
import { Grid, Typography } from "@mui/material";
import { t } from "i18next";
import { Stack } from "@mui/system";
import { Skeleton } from "@mui/material";
import { settings } from "../home/popular-items-nearby/SliderSettings";
import ProductCardShimmer from "../search/ProductCardShimmer";
const Shimmer = () => {
  return (
    <CardWrapper>
      <Skeleton variant="rectangle" height="100%" width="100%" />
    </CardWrapper>
  );
};
const SimilarProducts = ({ productId }) => {
  const { refetch, data, isFetching, isLoading, isRefetching } =
    useGetSimilarProduct(productId);
  useEffect(() => {
    refetch();
  }, [productId]);

  const SliderRef = useRef(null);
  return (
    <>
      {data?.length > 0 && (
        <CustomStackFullWidth>
          <Typography fontWeight="600" variant="h5">
            {t("Similar Products")}
          </Typography>
          <SliderCustom>
            <Slider ref={SliderRef} {...settings}>
              {data &&
                data?.length > 0 &&
                data?.map((item, index) => {
                  return (
                    <ProductCard
                      key={index}
                      item={item}
                      changed_bg="true"
                      horizontalcard="false"
                    />
                  );
                })}
            </Slider>
          </SliderCustom>
          {isFetching && (
            <Grid container>
              <ProductCardShimmer />
            </Grid>
          )}
        </CustomStackFullWidth>
      )}
    </>
  );
};

export default SimilarProducts;
