import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Grid,
  Text,
} from "@chakra-ui/react";

import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  listenToRoom,
  restartGame,
} from "../firebase/roomService";

function Winner() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const roomCode =
    sessionStorage.getItem("roomCode");

  const [room, setRoom] =
    useState(null);

  useEffect(() => {
    const unsubscribe =
      listenToRoom(
        roomCode,
        (data) => {
          // Room deleted
          if (!data) {
            sessionStorage.removeItem(
              "roomCode"
            );


            navigate("/");

            return;
          }

          setRoom(data);

          if (
            data?.status === "game"
          ) {
            navigate("/game");
          }
        }
      );

    return () => unsubscribe();


  }, []);

  if (!room) {
    return (<Flex
      minH="100vh"
      bg="#050816"
      justify="center"
      align="center"
    > <Text color="white">
        Loading... </Text> </Flex>
    );
  }

  const isHost =
    room.hostId === user?.uid;

  const players = Object.values(
    room.players || {}
  );

  const imposter =
    players.find(
      (p) =>
        p.uid === room.imposterId
    );

  const survivors =
    players.filter(
      (p) => !p.eliminated
    );

  const voteMap =
    room.finalVotes || {};

  const voteCount =
    room.finalVoteCount || {};

  const imposterWord =
    room?.selectedPair?.word2 ||
    "Unknown";

  return (
    <Flex
      minH="100vh"
      bg="radial-gradient(circle at top, #1b2735 0%, #090a0f 45%, #050816 100%)"
      justify="center"
      align="center"
      py={10}
      px={4}
      position="relative"
      overflow="hidden"

    >


      {/* Background Glow Effects */}



      <Box
        position="fixed"
        inset="0"
        pointerEvents="none"
        bg="
  radial-gradient(circle at 20% 20%, rgba(139,92,246,.18), transparent 30%),
  radial-gradient(circle at 80% 70%, rgba(59,130,246,.15), transparent 30%),
  radial-gradient(circle at 50% 100%, rgba(236,72,153,.08), transparent 30%)
  "
      />

      <Container maxW="900px" zIndex={1}>
        <Stack gap={6}>
          {/* Trophy Banner */}
          <Box textAlign="center">
            <Text
              fontSize={{
                base: "60px",
                md: "90px",
              }}
            >
              {room.winner === "players" ? "🏆" : "😈"}
            </Text>

            <Heading
              color="white"
              fontSize={{
                base: "3xl",
                md: "5xl",
              }}
              fontWeight="800"
              letterSpacing="1px"
              textShadow="0 0 30px rgba(255,255,255,.2)"
            >
              {room.winner === "players"
                ? "VICTORY!"
                : "IMPOSTER WINS"}
            </Heading>

            <Text
              color="gray.400"
              mt={2}
              fontSize={{
                base: "md",
                md: "lg",
              }}
            >
              Match Completed
            </Text>
          </Box>

          {/* Main Glass Card */}
          <Box
            bg="rgba(255,255,255,.05)"
            backdropFilter="blur(25px)"
            border="1px solid rgba(255,255,255,.08)"
            borderRadius="32px"
            overflow="hidden"
            boxShadow="0 25px 80px rgba(0,0,0,.45)"
          >
            <Stack gap={0}>
              {/* Imposter Reveal */}
              <Box
                p={8}
                bg="
          linear-gradient(
          135deg,
          rgba(255,70,70,.20),
          rgba(255,0,0,.05)
          )"
                borderBottom="1px solid rgba(255,255,255,.08)"
              >
                <Text
                  color="red.200"
                  fontWeight="700"
                  letterSpacing="3px"
                  fontSize="sm"
                >
                  IMPOSTER REVEALED
                </Text>

                <Heading
                  color="white"
                  mt={2}
                  fontSize={{
                    base: "2xl",
                    md: "4xl",
                  }}
                >
                  {imposter?.name}
                </Heading>

                <Text
                  color="orange.300"
                  mt={3}
                  fontWeight="600"
                >
                  Secret Word:
                  <Text
                    as="span"
                    color="yellow.300"
                    ml={2}
                  >
                    {imposterWord}
                  </Text>
                </Text>
              </Box>

              <Box p={{ base: 5, md: 8 }}>
                {/* Winners Section */}
                {room.winner === "players" && (
                  <Stack gap={5}>
                    <Heading
                      color="green.300"
                      textAlign="center"
                      size="lg"
                    >
                      👑 Winning Players
                    </Heading>

                    <Box
                      display="grid"
                      gridTemplateColumns={{
                        base: "1fr",
                        sm: "repeat(2,1fr)",
                        md: "repeat(3,1fr)",
                      }}
                      gap={4}
                    >
                      {survivors.map((player) => (
                        <Box
                          key={player.uid}
                          p={4}
                          borderRadius="20px"
                          bg="rgba(255,255,255,.05)"
                          border="1px solid rgba(255,255,255,.08)"
                          textAlign="center"
                          transition=".3s"
                          _hover={{
                            transform: "translateY(-4px)",
                            borderColor:
                              "rgba(255,255,255,.25)",
                          }}
                        >
                          <Text fontSize="42px">
                            👑
                          </Text>

                          <Text
                            color="white"
                            fontWeight="700"
                            mt={2}
                          >
                            {player.name}
                          </Text>
                        </Box>
                      ))}
                    </Box>
                  </Stack>
                )}

                {room.winner === "imposter" && (
                  <Box
                    mt={2}
                    p={5}
                    borderRadius="20px"
                    bg="rgba(255,0,0,.08)"
                    border="1px solid rgba(255,0,0,.15)"
                    textAlign="center"
                  >
                    <Text
                      color="red.300"
                      fontSize="xl"
                      fontWeight="bold"
                    >
                      Players failed to catch the Imposter
                    </Text>
                  </Box>
                )}



                {/* Vote Count */}
                <Heading
                  size="lg"
                  color="white"
                  mt={10}
                  mb={4}
                >
                  📊 Vote Count
                </Heading>

                <Box
                  display="grid"
                  gridTemplateColumns={{
                    base: "1fr",
                    md: "repeat(2,1fr)",
                  }}
                  gap={4}
                >
                  {Object.keys(voteCount).length === 0 ? (
                    <Text color="gray.400">
                      No vote count found
                    </Text>
                  ) : (
                    Object.entries(voteCount)
                      .sort(
                        (a, b) =>
                          b[1] - a[1]
                      )
                      .map(
                        ([
                          playerId,
                          totalVotes,
                        ]) => {
                          const player =
                            players.find(
                              (p) =>
                                p.uid ===
                                playerId
                            );

                          return (
                            <Box
                              key={playerId}
                              p={5}
                              borderRadius="20px"
                              bg="rgba(255,255,255,.05)"
                              border="1px solid rgba(255,255,255,.08)"
                            >
                              <Text
                                color="white"
                                fontWeight="700"
                              >
                                {player?.name}
                              </Text>

                              <Text
                                color="purple.300"
                                fontSize="2xl"
                                fontWeight="bold"
                                mt={1}
                              >
                                {totalVotes} Vote
                                {totalVotes > 1
                                  ? "s"
                                  : ""}
                              </Text>
                            </Box>
                          );
                        }
                      )
                  )}
                </Box>


                {/* Final Votes */}
                <Heading
                  size="lg"
                  color="white"
                  mt={10}
                  mb={4}
                >
                  📊 Final Votes
                </Heading>

                <Box
                  p={5}
                  borderRadius="24px"
                  bg="rgba(255,255,255,.04)"
                  border="1px solid rgba(255,255,255,.08)"
                >
                  {Object.keys(voteMap).length === 0 ? (
                    <Text color="gray.400">
                      No votes found
                    </Text>
                  ) : (
                    Object.entries(voteMap).map(
                      ([voterId, votedId]) => {
                        const voter =
                          players.find(
                            (p) =>
                              p.uid === voterId
                          );

                        const votedPlayer =
                          players.find(
                            (p) =>
                              p.uid === votedId
                          );

                        return (
                          <Flex
                            key={voterId}
                            justify="space-between"
                            align="center"
                            py={3}
                            borderBottom="1px solid rgba(255,255,255,.05)"
                          >
                            <Text color="white">
                              {voter?.name}
                            </Text>

                            <Text
                              color="red.300"
                              fontWeight="bold"
                            >
                              ➜
                            </Text>

                            <Text color="white">
                              {votedPlayer?.name}
                            </Text>
                          </Flex>
                        );
                      }
                    )
                  )}
                </Box>


                {/* Footer */}
                <Box
                  textAlign="center"
                  mt={10}
                >
                  {isHost ? (
                    <Button
                      size="lg"
                      h="60px"
                      px={10}
                      fontSize="18px"
                      fontWeight="700"
                      borderRadius="20px"
                      bg="linear-gradient(135deg,#8b5cf6,#6366f1)"
                      color="white"
                      _hover={{
                        transform:
                          "translateY(-2px)",
                        boxShadow:
                          "0 10px 30px rgba(99,102,241,.4)",
                      }}
                      onClick={() =>
                        restartGame(
                          roomCode
                        )
                      }
                    >
                      🎮 Play Again
                    </Button>
                  ) : (
                    <Text
                      color="gray.400"
                      fontSize="lg"
                    >
                      Waiting for host to
                      start next game...
                    </Text>
                  )}
                </Box>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Container>


    </Flex>
  );

}

export default Winner;
