import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

const SkeletonBars = ({ ...otherProps }) => {
  const configSkeleton = {
    ...otherProps,
  };

  return (
    <Box sx={{ width: "100%", padding: "20px 50px" }}>
      <Skeleton
        animation="wave"
        sx={{ height: "50px", marginBottom: "10px" }}
      />
      <Skeleton sx={{ height: "50px", marginBottom: "10px" }} />
      <Skeleton animation="wave" sx={{ height: "50px" }} />
    </Box>
  );
};

export default SkeletonBars;
