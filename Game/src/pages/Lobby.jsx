import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

function Lobby() {
  const navigate = useNavigate();

  const roomCode = "ABCD12";

  const players = [
    {
      id: 1,
      name: "Harsh",
      host: true,
    },
    {
      id: 2,
      name: "Rohan",
      host: false,
    },
    {
      id: 3,
      name: "Priya",
      host: false,
    },
    {
      id: 4,
      name: "Ankit",
      host: false,
    },
    {
      id: 5,
      name: "Aman",
      host: false,
    },
  ];

  useGSAP(() => {
    gsap.from(".room-card", {
      y: -40,
      opacity: 0,
      duration: 1,
    });

    gsap.from(".player-card", {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
    });

    gsap.to(".waiting-dot", {
      y: -8,
      repeat: -1,
      stagger: 0.15,
      yoyo: true,
      duration: 0.4,
    });
  });

  const copyCode = async () => {
    await navigator.clipboard.writeText(roomCode);

    alert("Room code copied");
  };

  return (
    <Flex
      minH="100vh"
      bg="#050816"
      position="relative"
      overflow="hidden"
      py={10}
      px={4}
    >
      {" "}
      <Box
        position="absolute"
        top="-150px"
        left="-150px"
        w="400px"
        h="400px"
        bg="purple.500"
        opacity=".18"
        borderRadius="full"
        filter="blur(170px)"
      />
      <Box
        position="absolute"
        bottom="-150px"
        right="-150px"
        w="400px"
        h="400px"
        bg="cyan.400"
        opacity=".15"
        borderRadius="full"
        filter="blur(170px)"
      />
      <Container maxW="1200px">
        <Flex direction="column" gap={8}>
          <Box
            className="room-card"
            bg="rgba(255,255,255,.05)"
            backdropFilter="blur(20px)"
            border="1px solid rgba(255,255,255,.08)"
            borderRadius="30px"
            p={6}
          >
            <Flex
              justify="space-between"
              align="center"
              flexWrap="wrap"
              gap={4}
            >
              <Box>
                <Text color="gray.400" fontSize="sm">
                  ROOM CODE
                </Text>

                <Heading color="white" size="2xl">
                  {roomCode}
                </Heading>
              </Box>

              <Button colorScheme="purple" onClick={copyCode}>
                Copy Code
              </Button>
            </Flex>
          </Box>

          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <Heading color="white" size="lg">
              Players
            </Heading>

            <Badge colorScheme="green" p={3} borderRadius="full">
              {players.length} Online
            </Badge>
          </Flex>

          <Grid
            templateColumns={{
              base: "1fr",
              sm: "1fr 1fr",
              lg: "1fr 1fr 1fr",
            }}
            gap={5}
          >
            {players.map((player) => (
              <Box
                key={player.id}
                className="player-card"
                bg="rgba(255,255,255,.05)"
                border="1px solid rgba(255,255,255,.08)"
                borderRadius="25px"
                p={5}
              >
                <Flex justify="space-between" align="center">
                  <Flex align="center" gap={3}>
                    <Flex
                      w="50px"
                      h="50px"
                      borderRadius="full"
                      bg="purple.500"
                      color="white"
                      justify="center"
                      align="center"
                      fontWeight="bold"
                    >
                      {player.name[0]}
                    </Flex>

                    <Text color="white" fontWeight="bold">
                      {player.name}
                    </Text>
                  </Flex>

                  {player.host && <Badge colorScheme="purple">HOST</Badge>}
                </Flex>
              </Box>
            ))}
          </Grid>

          <Box textAlign="center" mt={4}>
            <Text color="gray.400" mb={4}>
              Waiting for players
            </Text>

            <Flex justify="center" gap={2}>
              <Box
                className="waiting-dot"
                w="12px"
                h="12px"
                bg="purple.400"
                borderRadius="full"
              />

              <Box
                className="waiting-dot"
                w="12px"
                h="12px"
                bg="purple.400"
                borderRadius="full"
              />

              <Box
                className="waiting-dot"
                w="12px"
                h="12px"
                bg="purple.400"
                borderRadius="full"
              />
            </Flex>
          </Box>

          <Button
            mt={6}
            h="65px"
            size="lg"
            bgGradient="linear(to-r, purple.500, cyan.400)"
            color="black.300"
            fontWeight="bold"
            onClick={() => navigate("/words")}
          >
            Start Game
          </Button>
        </Flex>
      </Container>
    </Flex>
  );
}

export default Lobby;
