import { Box, Skeleton, Stack } from "@mui/material";

const RegistrationSkeleton = () => (
  <Stack spacing={2.5} width="100%" py={{ xs: "1.125rem", md: "3rem" }} alignItems="center">
    <Stack alignItems="center" spacing={1}>
      <Skeleton variant="text" width={280} height={40} />
      <Skeleton variant="text" width={200} height={22} />
    </Stack>
    <Stack direction="row" spacing={3} justifyContent="center" flexWrap="wrap" useFlexGap>
      {[1, 2, 3].map((i) => (
        <Box key={i} width={280} p={2} textAlign="center">
          <Skeleton variant="circular" width={80} height={80} sx={{ mx: "auto", mb: 1 }} />
          <Skeleton variant="text" width={160} height={28} sx={{ mx: "auto" }} />
          <Skeleton variant="text" width={120} height={20} sx={{ mx: "auto" }} />
          <Skeleton variant="rounded" width={140} height={36} sx={{ mx: "auto", mt: 1 }} />
        </Box>
      ))}
    </Stack>
  </Stack>
);

export default RegistrationSkeleton;
