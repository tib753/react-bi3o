import "../src/styles/globals.css";
import "../src/styles/nprogress.css";
import { CacheProvider } from "@emotion/react";
import { Provider as ReduxProvider } from "react-redux";
import createEmotionCache from "../src/utils/create-emotion-cache";
import { store } from "redux/store";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "theme";
import { rubik } from "../src/utils/fonts";

import CssBaseline from "@mui/material/CssBaseline";
import { RTL } from "components/rtl";
import { Toaster } from "react-hot-toast";
import { getServerSideProps } from "./index";
import { SettingsConsumer, SettingsProvider } from "contexts/settings-context";
import "../src/language/i18n";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import nProgress from "nprogress";
import Router from "next/router";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useScrollToTop from "../src/api-manage/hooks/custom-hooks/useScrollToTop";

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

export const currentVersion = process.env.NEXT_PUBLIC_SITE_VERSION;
const clientSideEmotionCache = createEmotionCache();
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			cacheTime: 1000 * 60 * 5, // 5 minutes
			staleTime: 1000 * 60 * 2, // 2 minutes
		},
	},
});
let persistor = persistStore(store);
import { haveRtlLanguages } from "../src/components/header/top-navbar/language/rtlLanguageList";
function MyApp(props) {
	const { i18n } = useTranslation()
	const [languageDirection, setLanguageDirection] = useState("rtl")
	useEffect(() => {
		const lang = i18n.language;
		if (haveRtlLanguages.includes(lang)) {
			setLanguageDirection("rtl");
		} else {
			setLanguageDirection("ltr");
		}
	}, [i18n.language]);
	// Register service worker
	useEffect(() => {
		if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
			window.addEventListener("load", () => {
				navigator.serviceWorker
					.register("/firebase-messaging-sw.js")
					.then((registration) => {
						console.log(
							"Service Worker registered with scope:",
							registration.scope
						);
					})
					.catch((err) => {
						console.error("Service Worker registration failed:", err);
					});
			});
		}
	}, []);
	const {
		Component,
		emotionCache = clientSideEmotionCache,
		pageProps,
	} = props;
	const getLayout = Component.getLayout ?? ((page) => page);
	const { t } = useTranslation();

	// Version check
	useEffect(() => {
		const storedVersion = localStorage.getItem("appVersion");
		if (storedVersion !== currentVersion) {
			localStorage.clear();
			localStorage.setItem("appVersion", currentVersion);
		}
	}, []);

	return (
		<div className={rubik.variable}>
			{useScrollToTop()}
			<CacheProvider value={emotionCache}>
				<QueryClientProvider client={queryClient}>
					<ReduxProvider store={store}>
						<PersistGate loading={null} persistor={persistor}>
							<SettingsProvider>
								<SettingsConsumer>
									{(value) => (
										<ThemeProvider
											theme={createTheme({
												direction: languageDirection,
												responsiveFontSizes:
													value?.settings?.responsiveFontSizes,
												mode: value?.settings?.theme,
											})}
										>
											<RTL direction={languageDirection}>
												<CssBaseline />
												<Toaster position="top-center" />
												{getLayout(<Component {...pageProps} />)}
											</RTL>
										</ThemeProvider>
									)}
								</SettingsConsumer>
							</SettingsProvider>
						</PersistGate>
					</ReduxProvider>
					{process.env.NODE_ENV !== "production" && (
						<ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
					)}
				</QueryClientProvider>
			</CacheProvider>
		</div>
	);
}

export default MyApp;
export { getServerSideProps };
