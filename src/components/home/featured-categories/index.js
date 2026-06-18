import React, { useEffect, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import {
  CustomBoxFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import { styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useGetFeaturedCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { setFeaturedCategories } from "redux/slices/storedData";
import { CustomButtonPrimary } from "styled-components/CustomButtons.style";
import FoodCategoryCard from "../../cards/FoodCategoryCard";
import PharmacyCategoryCard from "../../cards/PharmacyCategoryCard";
import ShopCategoryCard from "../../cards/ShopCategoryCard";
import { HomeComponentsWrapper } from "../HomePageComponents";
import FeaturedItemCard from "./card";
import { moduleWiseNext, moduleWisePrev } from "./sliderSettings";
import { getLanguage } from "../../../helper-functions/getLanguage";

const Slider = dynamic(() => import("react-slick"), {
  ssr: false,
});

export const ButtonLeft = styled(CustomButtonPrimary)(
  ({ theme, language_direction }) => ({
    minWidth: "20px",
    width: "10px",
    height: "30px",
    borderRadius: "50%",
    transform: language_direction === "rtl" && "rotate(180deg)",
  })
);
export const ButtonRight = styled(CustomButtonPrimary)(({ theme }) => ({
  minWidth: "20px",
  width: "10px",
  height: "30px",
  borderRadius: "50%",
  color: "black",
  background: theme.palette.neutral[200],
  "&:hover": {
    background: theme.palette.neutral[400],
  },
}));

const FeaturedCategories = () => {
  const dispatch = useDispatch();
  const { featuredCategories } = useSelector((state) => state.storedData);
  const { data, isFetched, refetch, isLoading } = useGetFeaturedCategories();
  const isRtl = getLanguage() === "rtl";
  const sliderContainerSx = {
    direction: isRtl ? "rtl" : "ltr",
    width: "100%",
    position: "relative",
  };

  const moduleWiseCard = () => {
    switch (getCurrentModuleType()) {
      case ModuleTypes.GROCERY:
        return (
          <CustomBoxFullWidth sx={sliderContainerSx}>
            <Slider {...settings}>
              {data?.data.map((item, index) => {
                return (
                  <FeaturedItemCard
                    key={index}
                    image={item?.image_full_url}
                    title={item?.name}
                    id={item?.id}
                    slug={item?.slug}
                  />
                );
              })}
            </Slider>
          </CustomBoxFullWidth>
        );
      case ModuleTypes.PHARMACY:
        return (
          <CustomBoxFullWidth sx={sliderContainerSx}>
            <Slider {...settings}>
              {data?.data.map((item, index) => {
                return (
                  <PharmacyCategoryCard
                    key={index}
                    image={item?.image_full_url}
                    title={item?.name}
                    slug={item?.slug}
                    id={item?.id}
                  />
                );
              })}
            </Slider>
          </CustomBoxFullWidth>
        );
      case ModuleTypes.ECOMMERCE:
        return (
          <CustomBoxFullWidth sx={sliderContainerSx}>
            <Slider {...shopCategorySliderSettings}>
              {data?.data.map((item, index) => {
                return (
                  <ShopCategoryCard
                    key={index}
                    imageUrl={item?.image_full_url}
                    item={item}
                  />
                );
              })}
            </Slider>
          </CustomBoxFullWidth>
        );
      case ModuleTypes.FOOD:
        return (
          <CustomBoxFullWidth sx={sliderContainerSx}>
            <Slider {...foodCategorySliderSettings}>
              {data?.data.map((item, index) => {
                return (
                  <FoodCategoryCard
                    key={item?.id}
                    id={item?.id}
                    categoryImage={item?.image}
                    name={item?.name}
                    slug={item?.slug}
                    categoryImageUrl={item?.image_full_url}
                    height="40px"
                  />
                );
              })}
            </Slider>
          </CustomBoxFullWidth>
        );
    }
  };

  const moduleWiseCardShimmer = () => {
    switch (getCurrentModuleType()) {
      case ModuleTypes.GROCERY:
        return (
          <Slider {...settings}>
            {[...Array(10)]?.map((item, index) => {
              return <FeaturedItemCard key={index} onlyshimmer />;
            })}
          </Slider>
        );
      case ModuleTypes.PHARMACY:
        return (
          <Slider {...settings}>
            {[...Array(10)]?.map((_, index) => {
              return <PharmacyCategoryCard key={index} onlyshimmer />;
            })}
          </Slider>
        );
      case ModuleTypes.ECOMMERCE:
        return (
          <Slider {...shopCategorySliderSettings}>
            {[...Array(6)].reverse()?.map((_, index) => {
              return <ShopCategoryCard key={index} onlyshimmer />;
            })}
          </Slider>
        );
      case ModuleTypes.FOOD:
        return (
          <Slider {...foodCategorySliderSettings}>
            {[...Array(8)].reverse()?.map((item, index) => {
              return <FoodCategoryCard key={index} onlyshimmer />;
            })}
          </Slider>
        );
    }
  };

  const shopCategorySliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: moduleWiseNext(),
    prevArrow: moduleWisePrev(),
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1210,
        settings: {
          slidesToShow: 4.5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 980,
        settings: {
          slidesToShow: 3.8,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 840,
        settings: {
          slidesToShow: 3.2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 785,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 730,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 630,
        settings: {
          slidesToShow: 2.3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 570,
        settings: {
          slidesToShow: 2.1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1.8,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 460,
        settings: {
          slidesToShow: 1.6,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 374,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 280,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 8.5,
    nextArrow: moduleWiseNext(),
    prevArrow: moduleWisePrev(),
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1650,
        settings: {
          slidesToShow: 8,
        },
      },
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 7,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6.5,
        },
      },
      {
        breakpoint: 840,
        settings: {
          slidesToShow: 6.5,
        },
      },
      {
        breakpoint: 790,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4.2,
        },
      },
      {
        breakpoint: 475,
        settings: {
          slidesToShow: 3.9,
        },
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 3.7,
        },
      },
      {
        breakpoint: 420,
        settings: {
          slidesToShow: 3.3,
        },
      },
      {
        breakpoint: 375,
        settings: {
          slidesToShow: 2.7,
        },
      },
    ],
  };

  const foodCategorySliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 3,
    nextArrow: moduleWiseNext(),
    prevArrow: moduleWisePrev(),
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 8,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 790,
        settings: {
          slidesToShow: 4.5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 7,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
        },
      },
    ],
  };

  return (
    <CustomBoxFullWidth sx={{ mt: "20px" }}>
      {isLoading ? (
        <HomeComponentsWrapper>
          <SliderCustom
            float="left"
            sx={{
              "& .slick-slider": {
                "& .slick-slide": {
                  padding: { xs: "0px", md: "6px" },
                  paddingBottom: {
                    xs: "5px",
                    sm: "10px",
                    md: "20px !important",
                  },
                },
              },
            }}
          >
            {moduleWiseCardShimmer()}
          </SliderCustom>
        </HomeComponentsWrapper>
      ) : (
        data?.data &&
        data?.data.length > 0 && (
          <HomeComponentsWrapper>
            {data?.data && data?.data.length > 0 && (
              <SliderCustom
                float="left"
                sx={{
                  "& .slick-slider": {
                    "& .slick-slide": {
                      padding: { xs: "0px", md: "6px" },
                      paddingBottom: {
                        xs: "5px",
                        sm: "10px",
                        md: "20px !important",
                      },
                    },
                  },
                }}
              >
                {moduleWiseCard()}
              </SliderCustom>
            )}
          </HomeComponentsWrapper>
        )
      )}
    </CustomBoxFullWidth>
  );
};

export default FeaturedCategories;
