import {
  Box,
  Button,
  Container,
  CssBaseline,
  keyframes,
  styled,
  Typography,
} from "@mui/material";
import { Link } from "react-router";
import planet_with_person from "../assets/pageNotFound/person_with_planet.svg";
import ship1 from "../assets/pageNotFound/ship1.svg";
import ship2 from "../assets/pageNotFound/ship2.svg";
import cloud1 from "../assets/pageNotFound/cloud1.svg";
import cloud2 from "../assets/pageNotFound/cloud2.svg";
import cloud3 from "../assets/pageNotFound/cloud3.svg";
import cloud4 from "../assets/pageNotFound/cloud4.svg";
import stars from "../assets/pageNotFound/stars.svg";
import line from "../assets/pageNotFound/line.svg";
import shootingStar from "../assets/pageNotFound/shootingStar1.svg";
import moon from "../assets/pageNotFound/moon.svg";

interface CloudProps {
  driftSpeed?: number;
  bottomPos?: string;
  scaleSize?: number;
}

const lineReveal = keyframes`
0% { opacity: 0; transform: rotate(0deg); clip-path: inset(0 100% 0 0); }
  10% { opacity: 1; }
  80% { opacity: 1; transform: rotate(0deg); clip-path: inset(0 0 0 0); }
  85% {opacity: 0}
  100% {opacity: 0}
`;

const starMove = keyframes`
  0% { left: -5%; top: 15%; opacity: 0; transform: scale(0.2); }
  10% { opacity: 1; transform: scale(0.3); top:17%; }
  20% { top:17.7%; transform: scale(0.5); }
  40% { top:26.4%; }
  50% { top:34% }
  65% { top:45% }
  80% { left: 93%; top: 62%; opacity: 1; transform: scale(0.3);}
  81%,100% {opacity: 0; transform: scale(0);}
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const cloudMovement = keyframes`
  0%, 100% { transform: translateX(-2%); }
  50% { transform: translateX(2%); }
`;

const BackgroundContainer = styled(Box)({
  backgroundColor: "#03090a",
  backgroundImage: `url(${stars})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  width: "100vw",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const ShootingStarGroup = styled(Box)({
  position: "absolute",
  top: "15%",
  left: "30%",
  width: "40vw",
  aspectRatio: "1.5 / 1",
  zIndex: 10,
  overflow: "visible",
});

const LineImage = styled("img")({
  position: "absolute",
  width: "100%",
  height: "100%",
  objectFit: "contain",
  zIndex: 1,
  animation: `${lineReveal} 4s linear infinite`,
  pointerEvents: "none",
});
const StarImage = styled("img")({
  position: "absolute",
  width: "15%",
  zIndex: 2,
  animation: `${starMove} 4s linear infinite`,
  transformOrigin: "center",
});

const Cloud = styled("img", {
  shouldForwardProp: (prop) =>
    prop !== "driftSpeed" && prop !== "bottomPos" && prop !== "scaleSize",
})<CloudProps>(({ driftSpeed = 10, bottomPos = "-5%", scaleSize = 1 }) => ({
  position: "absolute",
  bottom: bottomPos || "-5%",
  width: "120%",
  left: "3%",
  zIndex: 10,
  transform: `scale(${scaleSize || 1})`,
  animation: `${cloudMovement} ${driftSpeed}s ease-in-out infinite`,
  pointerEvents: "none",
}));

const NotFound = () => {
  return (
    <>
      <CssBaseline />
      <BackgroundContainer>
        <ShootingStarGroup sx={{ zIndex: 99 }}>
          <LineImage src={line} alt="trail" />
          <StarImage src={shootingStar} alt="star" />
        </ShootingStarGroup>

        <Box
          component="img"
          src={planet_with_person}
          sx={{
            position: "absolute",
            bottom: "-20px",
            left: "-20px",
            height: { xs: "35vh", md: "70vh" },
            zIndex: 15,
          }}
        />

        <Box
          component="img"
          src={ship1}
          sx={{
            position: "absolute",
            bottom: { xs: "12%", md: "20%" },
            left: { xs: "40%", md: "20%" },
            width: { xs: "50px", md: "80px" },
            animation: `${float} 3s ease-in-out infinite`,
            zIndex: 15,
          }}
        />

        <Box
          component="img"
          src={ship2}
          sx={{
            position: "absolute",
            top: "15%",
            right: "10%",
            width: "120px",
            animation: `${float} 5s ease-in-out infinite`,
            zIndex: 5,
          }}
        />

        <Container
          sx={{ textAlign: "center", zIndex: 20, position: "relative" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "10rem", md: "15rem" },
                fontWeight: 800,
                color: "#1ebbb0",
                lineHeight: 1,
              }}
            >
              4
            </Typography>

            <Box
              component="img"
              src={moon}
              sx={{
                height: { xs: "8rem", md: "12rem" },
                mx: 2,
                borderRadius: "50%",
                filter: "drop-shadow(0 0 30px #1ebbb0)",
              }}
            />

            <Typography
              sx={{
                fontSize: { xs: "10rem", md: "15rem" },
                fontWeight: 800,
                color: "#1ebbb0",
                lineHeight: 1,
              }}
            >
              4
            </Typography>
          </Box>
          <Typography
            variant="h4"
            sx={{
              color: "#1ebbb0",
              letterSpacing: 10,
              mb: 4,
              fontWeight: "bold",
            }}
          >
            NOT FOUND
          </Typography>
          <Typography
            sx={{
              color: "#1ebbb0",
              mb: 2,
            }}
          >
            Bạn không có quyền truy cập, hoặc trang không tồn tại, vui lòng quay
            lại trang chủ
          </Typography>

          <Button
            variant="contained"
            component={Link}
            to="/"
            sx={{
              bgcolor: "#1ebbb0",
              color: "#fff",
              px: 6,
              py: 1.5,
              borderRadius: "50px",
              fontSize: "1.1rem",
              "&:hover": { bgcolor: "#179a91" },
            }}
          >
            Go Home
          </Button>
        </Container>

        <Cloud
          src={cloud1}
          driftSpeed={12}
          bottomPos="-6%"
          scaleSize={1.2}
          sx={{ opacity: 0.9, zIndex: 14 }}
        />
        <Cloud
          src={cloud2}
          driftSpeed={18}
          bottomPos="-5%"
          scaleSize={1.3}
          sx={{ opacity: 0.7, zIndex: 13 }}
        />
        <Cloud
          src={cloud3}
          driftSpeed={25}
          bottomPos="-8%"
          scaleSize={1.4}
          sx={{ opacity: 0.5, zIndex: 12 }}
        />
        <Cloud
          src={cloud4}
          driftSpeed={30}
          bottomPos="-10%"
          scaleSize={1.5}
          sx={{ opacity: 0.3, zIndex: 11 }}
        />
      </BackgroundContainer>
    </>
  );
};

export default NotFound;
