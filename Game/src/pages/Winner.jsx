import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { listenToRoom, restartGame } from "../firebase/roomService";

function Winner() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const roomCode = sessionStorage.getItem("roomCode");

  const [room, setRoom] = useState(null);

  useEffect(() => {
    const unsubscribe = listenToRoom(roomCode, (data) => {
      setRoom(data);

      if (data?.status === "game") {
        navigate("/game");
      }
    });

    return () => unsubscribe();
  }, []);

  if (!room) {
    return (
      <Flex minH="100vh" bg="#050816" justify="center" align="center">
        <Text color="white">Loading...</Text>
      </Flex>
    );
  }
  const isHost = room.hostId === user?.uid;

  const players = Object.values(room.players || {});

  const imposter = players.find((p) => p.uid === room.imposterId);

  const survivors = players.filter((p) => !p.eliminated);

  return (
    <Flex minH="100vh" bg="#050816" align="center" justify="center">
      <Container maxW="700px">
        <Box
          bg="rgba(255,255,255,.05)"
          border="1px solid rgba(255,255,255,.08)"
          borderRadius="30px"
          p={8}
          textAlign="center"
        >
          <Stack gap={5}>
            <Heading color="white">
              {room.winner === "players"
                ? "🎉 Imposter Caught"
                : "😈 Imposter Wins"}
            </Heading>

            <Text color="blue.400" fontSize="2xl" fontWeight="bold">
              Imposter : {imposter?.name}
            </Text>

            {room.winner === "players" && (
              <>
                <Text color="green.300">Winners</Text>

                <Box
                  w="200px"
                  mx="auto"
                  h="auto"
                  p={2}
                  borderRadius={"md"}
                  // Glassmorphic effects
                  bg="rgba(255, 255, 255, 0.08)"
                  backdropFilter="blur(10px)"
                  border="1px solid rgba(255, 255, 255, 0.2)"
                  boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
                >
                  {survivors.map((player) => (
                    <Text color="white">{player.name}</Text>
                  ))}
                </Box>
              </>
            )}

            {room.winner === "imposter" && (
              <Text color="red.300" fontSize="xl">
                Players failed to catch the imposter.
              </Text>
            )}

            {isHost ? (
              <Button
                mt={4}
                colorScheme="purple"
                size="lg"
                onClick={() => restartGame(roomCode)}
              >
                Play Again
              </Button>
            ) : (
              <Text color="gray.400">
                Waiting for host to start next game...
              </Text>
            )}
          </Stack>
        </Box>
      </Container>
    </Flex>
  );
}

export default Winner;
