import { LandingLayout } from "components/layout/LandingLayout";
import LandingPage from "../src/components/landing-page";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setConfigData, setLandingPageData } from "redux/slices/configData";
import Router from "next/router";
import SEO from "../src/components/seo";

const Root = (props) => {
	const { configData,landingPageData } = props;
	const dispatch = useDispatch();
	useEffect(() => {
		if (configData) {
			if (configData.length === 0) {
				Router.push("/404");
			} else if (configData?.maintenance_mode) {
				Router.push("/maintainance");
			} else {
				dispatch(setConfigData(configData));
			}
		}
		if (landingPageData) {
			dispatch(setLandingPageData(landingPageData));
		}
	}, []);

	return (
		<>
			<CssBaseline />
			{/* <DynamicFavicon configData={configData} /> */}
			<SEO
				image={landingPageData?.meta_image||configData?.fav_icon_full_url}
				businessName={configData?.business_name}
				configData={configData}
				title={landingPageData?.meta_title||configData?.business_name}
				description={landingPageData?.meta_description||configData?.meta_description}
			/>
			{landingPageData && (
				<LandingLayout configData={configData} landingPageData={landingPageData}>
					<LandingPage
						configData={configData}
						landingPageData={landingPageData}
					/>
				</LandingLayout>
			)}
		</>
	);
};
export default Root;
export const getServerSideProps = async (context) => {
	const { req, res } = context;
	const language = req.cookies.languageSetting || req.cookies["language-setting"] || "ar";

	console.time("Config API Call");
	const configRes = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/config`,
		{
			method: "GET",
			headers: {
				"X-software-id": 33571750,
				"X-server": "server",
				"X-localization": language,
				origin: process.env.NEXT_CLIENT_HOST_URL,
			},
		}
	);
	const config = await configRes.json();
	console.timeEnd("Config API Call");

	console.time("Landing Page API Call");
	const landingPageRes = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/react-landing-page`,
		{
			method: "GET",
			headers: {
				"X-software-id": 33571750,
				"X-server": "server",
				"X-localization": language,
				origin: process.env.NEXT_CLIENT_HOST_URL,
			},
		}
	);
	const landingPageData = await landingPageRes.json();
	console.timeEnd("Landing Page API Call");

	// Set cache control headers for 1 hour (3600 seconds)
	res.setHeader(
		"Cache-Control",
		"public, s-maxage=3600, stale-while-revalidate"
	);

	return {
		props: {
			configData: config,
			landingPageData: landingPageData,
		},
	};
};
