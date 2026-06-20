import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useGSAP } from "@gsap/react";
import {
  createRoom,
  generateRoomCode,
  joinRoom,
} from "../firebase/roomService";
import gsap from "gsap";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();

  console.log(user?.uid);

  const navigate = useNavigate();

  const heroRef = useRef(null);
  const cardRef = useRef(null);

  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  useGSAP(() => {
    gsap.from(heroRef.current, {
      opacity: 0,
      y: -80,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(cardRef.current, {
      opacity: 0,
      y: 100,
      duration: 1.2,
      delay: 0.2,
      ease: "power4.out",
    });

    gsap.to(".blob1", {
      x: 40,
      y: 30,
      repeat: -1,
      yoyo: true,
      duration: 6,
      ease: "sine.inOut",
    });

    gsap.to(".blob2", {
      x: -50,
      y: -20,
      repeat: -1,
      yoyo: true,
      duration: 7,
      ease: "sine.inOut",
    });
  });

  const createRoomHandler = async () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    try {
      const roomCode = generateRoomCode();

      await createRoom({
        roomCode,
        uid: user.uid,
        playerName: name,
      });

      sessionStorage.setItem("roomCode", roomCode);

      sessionStorage.setItem("playerName", name);

      navigate(`/lobby?room=${roomCode}`);
    } catch (error) {
      console.error(error);

      alert("Failed to create room");
    }
  };


  const joinRoomHandler = async () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!roomCode.trim()) {
      alert("Please enter room code");
      return;
    }

    try {
      await joinRoom({
        roomCode,
        uid: user.uid,
        playerName: name,
      });

      sessionStorage.setItem("roomCode", roomCode);

      sessionStorage.setItem("playerName", name);

      navigate(`/lobby?room=${roomCode}`);
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <Flex
      minH="100vh"
      bg="#050816"
      position="relative"
      overflow="hidden"
      align="center"
      justify="center"
      px={4}
    >
      {" "}
      <Box
        className="blob1"
        position="absolute"
        top="-150px"
        left="-150px"
        w="450px"
        h="450px"
        borderRadius="full"
        bg="purple.500"
        opacity="0.18"
        filter="blur(170px)"
      />
      <Box
        className="blob2"
        position="absolute"
        bottom="-150px"
        right="-150px"
        w="450px"
        h="450px"
        borderRadius="full"
        bg="cyan.400"
        opacity="0.15"
        filter="blur(170px)"
      />
      <Container maxW="1300px">
        <Flex
          direction={{
            base: "column",
            lg: "row",
          }}
          gap={12}
          align="center"
          justify="space-between"
        >
          <Box flex="1" ref={heroRef}>
            <Badge
              colorScheme="purple"
              px={4}
              py={2}
              borderRadius="full"
              mb={5}
              fontSize="sm"
            >
              MULTIPLAYER PARTY GAME
            </Badge>

            <Heading
              color="white"
              lineHeight="0.95"
              fontWeight="900"
              fontSize={{
                base: "5xl",
                md: "7xl",
                lg: "8xl",
              }}
            >
              FIND THE
            </Heading>

            <Heading
              bgGradient="linear(to-r, purple.400, cyan.300)"
              bgClip="text"
              lineHeight="0.95"
              fontWeight="900"
              fontSize={{
                base: "6xl",
                md: "8xl",
                lg: "9xl",
              }}
            >
              IMPOSTER
            </Heading>

            <Text
              mt={6}
              color="gray.400"
              maxW="550px"
              fontSize={{
                base: "md",
                md: "lg",
              }}
            >
              One player is lying. Everyone is suspicious. Discuss, bluff, vote
              and eliminate the imposter before it's too late.
            </Text>

            <Flex mt={8} gap={4} flexWrap="wrap">
              <Badge colorScheme="purple" p={3} borderRadius="full">
                🎭 Bluff
              </Badge>

              <Badge colorScheme="cyan" p={3} borderRadius="full">
                🔍 Investigate
              </Badge>

              <Badge colorScheme="green" p={3} borderRadius="full">
                🗳 Vote
              </Badge>
            </Flex>
          </Box>

          <Box
            ref={cardRef}
            flex="1"
            w="100%"
            maxW="500px"
            bg="rgba(255,255,255,.05)"
            backdropFilter="blur(20px)"
            border="1px solid rgba(255,255,255,.08)"
            borderRadius="35px"
            p={{
              base: 6,
              md: 8,
            }}
            boxShadow="0 0 40px rgba(0,0,0,.25)"
          >
            <Stack gap={5}>
              <Heading textAlign="center" color="white" size="lg">
                Join The Game
              </Heading>

              <Input
                _placeholder={{ color: "whiteAlpha.500" }}
                size="lg"
                placeholder="Enter Your Name"
                bg="whiteAlpha.100"
                border="1px solid rgba(255,255,255,.08)"
                color="white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Button
                h="60px"
                size="lg"
                bg="#3949AB"
                color="white"
                fontWeight="bold"
                onClick={createRoomHandler}
              >
                Create Room
              </Button>

              <Text textAlign="center" color="gray.500">
                OR
              </Text>

              <Input
                size="lg"
                _placeholder={{ color: "whiteAlpha.500" }}
                placeholder="ROOM CODE"
                bg="whiteAlpha.100"
                border="1px solid rgba(255,255,255,.08)"
                color="white"
                textTransform="uppercase"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              />

              <Button
                h="60px"
                size="lg"
                bg="#3949AB"
                color="white"
                fontWeight="bold"
                // onClick={joinRoom}
                onClick={joinRoomHandler}
              >
                Join Room
              </Button>
            </Stack>
          </Box>
        </Flex>
      </Container>
    </Flex>
  );
}

export default Home;
