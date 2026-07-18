import { useState, useRef, useEffect } from "react";
import { Button, Skeleton, Stack, Typography } from "@mui/material";
import Slider from "react-slick";
import { getLanguage } from "helper-functions/getLanguage";
import {
	CustomBoxFullWidth,
	CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { RTL } from "components/rtl";
import { HomeComponentsWrapper } from "../../../../HomePageComponents";
import { Box } from "@mui/system";
import CarCard from "components/home/module-wise-components/rental/components/global/CarCard";
import H2 from "components/typographies/H2";
import { useTranslation } from "react-i18next";
import {
	NextFood,
	PrevFood,
} from "components/home/best-reviewed-items/SliderSettings";
import { useGetTopRatedVehicleLists } from "../../rental-api-manage/hooks/top-rated/useGetTopRatedVehicleLists";
import { useRouter } from "next/router";

const FILTER_TABS = [
	{ key: "all", label: "All" },
	{ key: "car", label: "Cars" },
	{ key: "taxi", label: "Taxi" },
];

const TopRatedVehicles = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const { data: topRatedVehicles, isFetching, isLoading } = useGetTopRatedVehicleLists();
	const lanDirection = getLanguage() ? getLanguage() : "ltr";
	const [isHover, setIsHover] = useState(false);
	const [showLeftArrow, setShowLeftArrow] = useState(false);
	const [showRightArrow, setShowRightArrow] = useState(true);
	const [rentalFilter, setRentalFilter] = useState("all");
	const sliderRef = useRef(null);

	const filteredVehicles = topRatedVehicles?.vehicles?.filter(
		(v) => {
			if (rentalFilter === "all") return true;
			const vehicleType = v?.rental_type || "car";
			return vehicleType === rentalFilter;
		}
	) || [];

	useEffect(() => {
		if (sliderRef.current && filteredVehicles?.length > 0) {
			const timer = setTimeout(() => {
				sliderRef.current.slickGoTo(0, true);
			}, 50);
			return () => clearTimeout(timer);
		}
	}, [rentalFilter, lanDirection, filteredVehicles?.length]);

	// Update arrow visibility based on current slide
	const updateArrowVisibility = (currentSlide) => {
		const totalSlides = filteredVehicles?.length;
		const slidesToShow =
			window.innerWidth >= 992 ? 4 : window.innerWidth >= 576 ? 2 : 1;

		setShowLeftArrow(currentSlide > 0);
		setShowRightArrow(currentSlide < totalSlides - slidesToShow);
	};

	const handleSeemoreClick = () => {
		router.push({
			pathname: "/rental/vehicle-search",
			query: { top_rated: 1 },
		});
	};

	const settings = {
		dots: false,
		infinite: false,
		slidesToShow: 4.2,
		cssEase: "ease-in-out",
		autoplay: true,
		speed: 800,
		autoplaySpeed: 4000,
		variableHeight: true,
		swipeToSlide: true,
		rtl: lanDirection === "rtl",

		prevArrow: isHover && showLeftArrow && <PrevFood displayNoneOnMobile />,
		nextArrow: isHover && showRightArrow && (
			<NextFood displayNoneOnMobile />
		),
		responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 2,
					swipeToSlide: true,
				},
			},
			{
				breakpoint: 576,
				settings: {
					slidesToShow: 1,
					swipeToSlide: true,
				},
			},
		],
		afterChange: (current) => {
			updateArrowVisibility(current);
		},
	};

	return (
		<>
			{isLoading ? (
				<HomeComponentsWrapper
					sx={{
						cursor: "pointer",
						mb: "50px",
						".slick-slide": {
							padding: "10px",
							".MuiBox-root": {
								overflow: "visible",
							},
						},
						".slick-dots li button:before": {
							opacity: 1,
							color: (theme) => theme.palette.neutral[700],
						},
					}}
				>
					<CustomStackFullWidth
						alignItems="center"
						justifyContent="center"
						mb={3}
						spacing={1}
					>
						<CustomStackFullWidth
							alignItems="center"
							justifyContent="space-between"
							direction="row"
						>
							<Skeleton variant="text" width="110px" />
							<Skeleton width="100px" variant="80px" />
						</CustomStackFullWidth>

						<RTL direction={lanDirection}>
							<CustomBoxFullWidth>
								<Slider {...settings}>
									{[...Array(4)].map((item, index) => {
										return (
											<Skeleton
												key={index}
												variant="rounded"
												height={383}
												width={400}
											/>
										);
									})}
								</Slider>
							</CustomBoxFullWidth>
						</RTL>
					</CustomStackFullWidth>
				</HomeComponentsWrapper>
			) : (
				<HomeComponentsWrapper
					onMouseEnter={() => setIsHover(true)}
					onMouseLeave={() => setIsHover(false)}
					sx={{
						cursor: "pointer",
						mb: "50px",
						".slick-slide": {
							padding: "10px",
							".MuiBox-root": {
								overflow: "visible",
							},
						},
						".slick-dots li button:before": {
							opacity: 1,
							color: (theme) => theme.palette.neutral[700],
						},
					}}
				>
					<CustomStackFullWidth
						alignItems="center"
						justifyContent="center"
						mb={3}
						spacing={1}
						onMouseEnter={() => setIsHover(true)}
						onMouseLeave={() => setIsHover(false)}
					>
						<CustomStackFullWidth
							alignItems="center"
							justifyContent="space-between"
							direction="row"
						>
							<H2 text={t("Top Rated Vehicles")} component="h2" />
							<Button
								variant="text"
								onClick={handleSeemoreClick}
								sx={{
									transition: "all ease 0.5s",
									textTransform: "capitalize",
									"&:hover": {
										letterSpacing: "0.03em",
									},
								}}
							>
								{t("See all")}
							</Button>
						</CustomStackFullWidth>

						<Stack direction="row" spacing={1} sx={{ alignSelf: "flex-start", mb: 1 }}>
							{FILTER_TABS.map((tab) => (
								<Button
									key={tab.key}
									size="small"
									variant={rentalFilter === tab.key ? "contained" : "outlined"}
									onClick={() => setRentalFilter(tab.key)}
									sx={{ textTransform: "capitalize", minWidth: "auto", px: 2 }}
								>
									{t(tab.label)}
								</Button>
							))}
						</Stack>

						{filteredVehicles?.length > 0 ? (
						<CustomBoxFullWidth
							sx={{
								".slick-track ": {
									marginLeft: "0px",
									marginRight: "0px",
								},
							}}
						>
							<RTL direction={lanDirection}>
								<div dir={lanDirection}>
									<Slider ref={sliderRef} key={`${rentalFilter}-${lanDirection}`} {...settings}>
										{filteredVehicles?.map(
											(item, index) => (
												<Box
													key={index}
													sx={{
														img: {
															borderRadius: ".5rem",
														},
													}}
												>
													<CarCard data={item} />
												</Box>
											)
										)}
									</Slider>
								</div>
							</RTL>
						</CustomBoxFullWidth>
						) : (
							<Box sx={{ py: 4, textAlign: "center", width: "100%" }}>
								<Typography color="text.secondary">{t("No vehicles found")}</Typography>
							</Box>
						)}
					</CustomStackFullWidth>
				</HomeComponentsWrapper>
			)}
		</>
	);
};

export default TopRatedVehicles;
