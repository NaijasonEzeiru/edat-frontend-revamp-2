import {  Stack,  Skeleton, Box } from "@mui/material";

const ProfileComponentLoader = () => {
    return (
        <Box component="div" sx={{padding: "3rem 1rem 1rem 3rem"}}>
            <Stack spacing={5} direction="row" sx={{ paddingBottom: "20px" }}>
            <Skeleton
                variant="rectangular"
                width={210}
                height={40}
                animation="wave"
                sx={{ bgcolor: "grey.200" }}
            />
            <Skeleton
                variant="rectangular"
                width={300}
                height={40}
                animation="wave"
                sx={{ bgcolor: "grey.200" }}
            />
            </Stack>
            <Stack spacing={5} direction="row" sx={{ paddingBottom: "20px" }}>
            <Skeleton
                variant="rectangular"
                width={210}
                height={40}
                animation="wave"
                sx={{ bgcolor: "grey.200" }}
            />
            <Skeleton
                variant="rectangular"
                width={250}
                height={40}
                animation="wave"
                sx={{ bgcolor: "grey.200" }}
            />
            </Stack>
            <Stack
            spacing={5}
            direction="column"
            sx={{ paddingBottom: "10px" }}
            >
            <Skeleton
                variant="rectangular"
                width={210}
                height={40}
                animation="wave"
                sx={{ bgcolor: "grey.200" }}
            />
            <Skeleton
                variant="rectangular"
                width={570}
                height={80}
                animation="wave"
                sx={{ bgcolor: "grey.200" }}
            />
            </Stack>
        </Box>
    )
};

export default ProfileComponentLoader;