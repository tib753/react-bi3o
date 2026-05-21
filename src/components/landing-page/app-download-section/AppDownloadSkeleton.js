import { Box, Skeleton, Stack } from "@mui/material";

const AppDownloadSkeleton = () => (
  <Stack width="100%" alignItems="center" justifyContent="center" height={500}>
    <Stack spacing={2} sx={{ paddingInlineStart: "2rem" }} width="100%">
      <Skeleton variant="text" width={300} height={44} />
      <Skeleton variant="text" width={220} height={36} />
      <Stack direction="row" spacing={2}>
        <Skeleton variant="rounded" width={160} height={50} />
        <Skeleton variant="rounded" width={160} height={50} />
      </Stack>
    </Stack>
    <Box sx={{ flex: 1 }} />
  </Stack>
);

export default AppDownloadSkeleton;
