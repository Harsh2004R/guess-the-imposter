import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Input,
  Stack,
  Text,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

import {
  addWordPair,
  deleteWordPair,
  listenToWordPairs,
  getRoom,
  startGame,
  listenToRoom,
} from "../firebase/roomService";

import { useAuth } from "../context/AuthContext";

function WordCollection() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const roomCode = sessionStorage.getItem("roomCode");

  const [word1, setWord1] = useState("");
  const [word2, setWord2] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [pairs, setPairs] = useState([]);

  useEffect(() => {
    if (!roomCode) return;

    const unsubscribe = listenToRoom(roomCode, (room) => {
      if (room?.status === "game") {
        navigate("/game");
      }
    });

    return () => unsubscribe();
  }, [roomCode, navigate]);

  useEffect(() => {
    const loadRoom = async () => {
      const room = await getRoom(roomCode);

      if (!room) return;

      setIsHost(room.hostId === user.uid);
    };

    loadRoom();
  }, [roomCode, user]);

  useEffect(() => {
    if (!roomCode) return;

    const unsubscribe = listenToWordPairs(roomCode, (data) => {
      setPairs(data);
    });

    return () => unsubscribe();
  }, [roomCode]);

  useGSAP(() => {
    gsap.from(".bucket-card", {
      y: 50,
      opacity: 0,
      duration: 1,
    });

    gsap.from(".pair-card", {
      y: 30,
      opacity: 0,
      stagger: 0.08,
      duration: 0.5,
    });
  });

  const addPairHandler = async () => {
    if (!word1.trim() || !word2.trim()) {
      alert("Enter both words");
      return;
    }

    try {
      await addWordPair({
        roomCode,
        word1: word1.trim(),
        word2: word2.trim(),
        createdBy: user.uid,
      });

      setWord1("");
      setWord2("");
    } catch (error) {
      console.error(error);
      alert("Failed to add pair");
    }
  };

  const removePairHandler = async (pairId) => {
    try {
      await deleteWordPair(roomCode, pairId);
    } catch (error) {
      console.error(error);
      alert("Failed to remove pair");
    }
  };

  // game starter function

  const startGameHandler = async () => {
    try {
      const room = await getRoom(roomCode);

      const players = Object.values(room.players || {});

      const pairs = Object.values(room.wordPairs || {});

      if (players.length < 3) {
        alert("Need at least 3 players");
        return;
      }

      if (pairs.length === 0) {
        alert("Add at least one word pair");
        return;
      }

      const selectedPair = pairs[Math.floor(Math.random() * pairs.length)];

      const imposter = players[Math.floor(Math.random() * players.length)];

      await startGame({
        roomCode,
        imposterId: imposter.uid,
        selectedPair,
      });

      navigate("/game");
    } catch (error) {
      console.error(error);

      alert("Failed to start game");
    }
  };

  return (
    <Flex
      minH="100vh"
      bg="#050816"
      py={10}
      px={4}
      position="relative"
      overflow="hidden"
    >
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
        <Stack gap={8}>
          <Box textAlign="center">
            <Heading color="white">Word Collection</Heading>

            <Text color="gray.400" mt={2}>
              Add similar word pairs for the game
            </Text>
          </Box>

          <Box
            className="bucket-card"
            bg="rgba(255,255,255,.05)"
            backdropFilter="blur(20px)"
            border="1px solid rgba(255,255,255,.08)"
            borderRadius="30px"
            p={6}
          >
            <Stack gap={4}>
              <Input
                placeholder="Word 1"
                size="lg"
                bg="whiteAlpha.100"
                color="white"
                value={word1}
                onChange={(e) => setWord1(e.target.value)}
              />

              <Input
                placeholder="Word 2"
                size="lg"
                bg="whiteAlpha.100"
                color="white"
                value={word2}
                onChange={(e) => setWord2(e.target.value)}
              />

              <Button colorScheme="purple" h="55px" onClick={addPairHandler}>
                Add Pair
              </Button>
            </Stack>
          </Box>

          <Flex justify="space-between" align="center" flexWrap="wrap">
            <Heading size="md" color="white">
              Word Bucket
            </Heading>

            <Badge colorScheme="green" p={3} borderRadius="full">
              {pairs.length} Pairs
            </Badge>
          </Flex>

          <Grid
            templateColumns={{
              base: "1fr",
              md: "1fr 1fr",
              lg: "1fr 1fr 1fr",
            }}
            gap={5}
          >
            {pairs.map((pair) => (
              <Box
                // border="1px solid red"
                key={pair.id}
                className="pair-card"
                bg="rgba(255,255,255,.05)"
                border="1px solid rgba(255,255,255,.08)"
                borderRadius="25px"
                p={5}
              >
                <Heading color="white" filter={"blur(2.6px)"} size="md">
                  {pair.word1}
                </Heading>

                <Text color="gray.400" mt={2}>
                  +
                </Text>

                <Heading
                  color="cyan.300"
                  filter={"blur(2.6px)"}
                  size="md"
                  mt={2}
                >
                  {pair.word2}
                </Heading>

                <Button
                  mt={4}
                  size="sm"
                  colorScheme="red"
                  onClick={() => removePairHandler(pair.id)}
                >
                  Remove
                </Button>
              </Box>
            ))}
          </Grid>

          {isHost && (
            <Button
              h="65px"
              size="lg"
              bgGradient="linear(to-r, purple.500, cyan.400)"
              color="black"
              fontWeight="bold"
              onClick={startGameHandler}
            >
              Lock Bucket & Continue
            </Button>
          )}
        </Stack>
      </Container>
    </Flex>
  );
}

export default WordCollection;
