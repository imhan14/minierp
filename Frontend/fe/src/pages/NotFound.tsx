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
import planet_with_person from "../assets/pageNotFound/planet_with_person.png";
import ship1 from "../assets/pageNotFound/ship1.png";
import ship2 from "../assets/pageNotFound/ship2.png";
import cloud1 from "../assets/pageNotFound/cloud1.png";
import cloud2 from "../assets/pageNotFound/cloud2.png";
import cloud3 from "../assets/pageNotFound/cloud3.png";
import cloud4 from "../assets/pageNotFound/cloud4.png";
import stars from "../assets/pageNotFound/stars.png";
import line from "../assets/pageNotFound/line.png";
import shootingStar from "../assets/pageNotFound/onStar.png";
import moon from "../assets/pageNotFound/moon.png";

interface CloudProps {
  driftSpeed?: number;
  bottomPos?: string;
  scaleSize?: number;
}

const starMove = keyframes`
  0% { left: 90%; top: 58%; opacity: 0; transform: scale(0.2); }
  10% { opacity: 1; transform: scale(0.5); }
  25% { top:42%; transform: scale(0.7); }
  50% { left:50%; top:30%; }
  75% { top:19% }
  95% { opacity: 1; transform: scale(0.2);}
  100% { left: -12%; top: 13%; opacity: 0; transform: scale(0); }
`;

const lineReveal = keyframes`
 0% { clip-path: inset(75% 0 0 75%); opacity: 0; }
  10% { opacity: 1; }
  60% { clip-path:inset(40% 0 0 40%); }
  76% { clip-path:inset(30% 0 0 30%); }
  100% { clip-path: inset(0 0 0 0); opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const cloudMovement = keyframes`
  0%, 100% { transform: translateX(-2%); }
  50% { transform: translateX(2%); }
`;

// --- 2. Styled Components

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
  top: "20%",
  left: "30%",
  width: "40vw",
  aspectRatio: "1.5 / 1",
  zIndex: 10,
});

const StarImage = styled("img")({
  position: "absolute",
  width: "15%",
  zIndex: 2,
  animation: `${starMove} 4s linear infinite`,
  transformOrigin: "center",
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
            bottom: "20%",
            left: "20%",
            width: "80px",
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
                marginRight: 3,
                fontSize: { xs: "10rem", md: "15rem" },
                fontWeight: 900,
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
                mx: -2,
                borderRadius: "50%",
                filter: "drop-shadow(0 0 30px #1ebbb0)",
              }}
            />

            <Typography
              sx={{
                fontSize: { xs: "10rem", md: "15rem" },
                fontWeight: 900,
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
            Bạn đã lạc đến rìa vũ trụ, quay về thôi!
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
