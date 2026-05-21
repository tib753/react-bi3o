import { NoSsr, Skeleton, Stack, styled } from "@mui/material";
import HeaderComponent from "../header";
import FooterComponent from "../footer";
import PropTypes from "prop-types";
import useGetLandingPage from "api-manage/hooks/react-query/useGetLandingPage";
import { useEffect } from "react";

const FooterSkeleton = () => (
  <Stack spacing={2} width="100%" px={3} py={4}>
    <Skeleton variant="rounded" width="100%" height={180} />
    <Skeleton variant="rounded" width="100%" height={260} />
    <Skeleton variant="text" width={200} height={20} sx={{ mx: "auto" }} />
  </Stack>
);

export const MainLayoutRoot = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: "100vh",
}));

export const LandingLayout = ({ children, configData, landingPageData }) => {
  const { data, refetch } = useGetLandingPage();
  useEffect(() => {
    refetch();
  }, []);

  return (
    <MainLayoutRoot justifyContent="space-between">
      <header>
        <HeaderComponent configData={configData} />
      </header>
      {children}
      <footer>
        {data || landingPageData ? (
          <FooterComponent configData={configData} landingPageData={data} />
        ) : (
          <FooterSkeleton />
        )}
      </footer>
    </MainLayoutRoot>
  );
};

LandingLayout.propTypes = {
  children: PropTypes.node,
};
