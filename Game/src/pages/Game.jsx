import {
  Container,
  Flex,
  Grid,
  Heading,
  Stack,
  Spinner,
  Box
} from "@chakra-ui/react";

import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

import {
  listenToRoom,
  pickRandomPlayer,
  votePlayer,
  revealRoundResult,
} from "../firebase/roomService";
import { useNavigate } from "react-router-dom";

import PlayerList from "../game-components/PlayerList";
import WordCard from "../game-components/WordCard";
import PlayerPicker from "../game-components/PlayerPicker";
import VotingSection from "../game-components/VotingSection";
import RoundResult from "../game-components/RoundResult";

function Game() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const roomCode = sessionStorage.getItem("roomCode");

  const [room, setRoom] = useState(null);

  const [vote, setVote] = useState("");
  const [showVoteMessage, setShowVoteMessage] = useState(false);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    if (!roomCode) return;

    const unsubscribe = listenToRoom(roomCode, (roomData) => {
      if (roomData?.status === "finished") {
        navigate("/winner");
        return;
      }

      setRoom(roomData);
    });

    return () => unsubscribe();
  }, [roomCode]);

  useEffect(() => {
    if (!room) return;

    setVote("");
    setShowVoteMessage(false);
  }, [room?.status]);
  if (!room) {
    return (
      <Flex
        minH="100vh"
        bg="radial-gradient(circle at top, #1b2735 0%, #090a0f 45%, #050816 100%)"
        justify="center"
        align="center"
      >
        <Stack align="center">
          <Spinner
            size="xl"
            thickness="4px"
            color="purple.400"
          />
          <Heading
            size="md"
            color="white"
          >
            Loading Game...
          </Heading>
        </Stack>
      </Flex>
    );
  }

  const players = Object.values(
    room.players || {}
  );

  const isHost =
    room.hostId === user?.uid;

  const alivePlayers =
    players.filter(
      (player) => !player.eliminated
    );

  const votes = room.votes || {};

  const voteCount =
    Object.keys(votes).length;

  const allVoted =
    voteCount >= alivePlayers.length;

  const myWord =
    room.imposterId === user?.uid
      ? room.selectedPair?.word2
      : room.selectedPair?.word1;

  return (
    <Flex
      minH="100vh"
      bg="radial-gradient(circle at top, #1b2735 0%, #090a0f 45%, #050816 100%)"
      py={10}
      px={4}
      position="relative"
      overflow="hidden"
    >
      {/* Background Effects */}
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

      <Container
        maxW="1400px"
        zIndex={1}
      >
        <Stack gap={8}>
          {/* Header */}
          <Box
            bg="rgba(255,255,255,.05)"
            backdropFilter="blur(25px)"
            border="1px solid rgba(255,255,255,.08)"
            borderRadius="30px"
            p={{
              base: 5,
              md: 7,
            }}
          >
            <Stack gap={3}>
              <Heading
                color="white"
                fontSize={{
                  base: "2xl",
                  md: "4xl",
                }}
                fontWeight="800"
              >
                🎮 Imposter Game
              </Heading>

              <Flex
                gap={3}
                wrap="wrap"
              >
                <Box
                  px={4}
                  py={2}
                  borderRadius="full"
                  bg="rgba(139,92,246,.15)"
                  border="1px solid rgba(139,92,246,.3)"
                >
                  <Heading
                    size="sm"
                    color="purple.200"
                  >
                    Room: {roomCode}
                  </Heading>
                </Box>

                <Box
                  px={4}
                  py={2}
                  borderRadius="full"
                  bg="rgba(34,197,94,.15)"
                  border="1px solid rgba(34,197,94,.3)"
                >
                  <Heading
                    size="sm"
                    color="green.200"
                  >
                    Alive: {alivePlayers.length}
                  </Heading>
                </Box>

                <Box
                  px={4}
                  py={2}
                  borderRadius="full"
                  bg="rgba(59,130,246,.15)"
                  border="1px solid rgba(59,130,246,.3)"
                >
                  <Heading
                    size="sm"
                    color="blue.200"
                  >
                    Votes: {voteCount}/
                    {alivePlayers.length}
                  </Heading>
                </Box>
              </Flex>
            </Stack>
          </Box>

          {/* Main Layout */}
          <Grid
            templateColumns={{
              base: "1fr",
              lg: "350px 1fr",
            }}
            gap={6}
          >
            {/* Sidebar */}
            <Box
              bg="rgba(255,255,255,.05)"
              backdropFilter="blur(25px)"
              border="1px solid rgba(255,255,255,.08)"
              borderRadius="30px"
              p={4}
              boxShadow="0 20px 60px rgba(0,0,0,.35)"
            >
              <PlayerList
                players={players}
                pickedPlayerId={
                  room.pickedPlayerId
                }
              />
            </Box>

            {/* Right Content */}
            <Stack gap={6}>
              {/* Word Card */}
              <Box
                bg="rgba(255,255,255,.05)"
                backdropFilter="blur(25px)"
                border="1px solid rgba(255,255,255,.08)"
                borderRadius="30px"
                p={5}
                boxShadow="0 20px 60px rgba(0,0,0,.35)"
              >
                <WordCard
                  word={myWord}
                />
              </Box>

              {/* Player Picker */}
              <Box
                bg="rgba(255,255,255,.05)"
                backdropFilter="blur(25px)"
                border="1px solid rgba(255,255,255,.08)"
                borderRadius="30px"
                p={5}
                boxShadow="0 20px 60px rgba(0,0,0,.35)"
              >
                <PlayerPicker
                  players={players}
                  pickedPlayerId={
                    room.pickedPlayerId
                  }
                  isHost={isHost}
                  onPick={async () => {
                    const alivePlayers =
                      players.filter(
                        (player) =>
                          !player.eliminated
                      );

                    const randomPlayer =
                      alivePlayers[
                      Math.floor(
                        Math.random() *
                        alivePlayers.length
                      )
                      ];

                    await pickRandomPlayer(
                      roomCode,
                      randomPlayer.uid
                    );
                  }}
                />
              </Box>

              {/* Voting */}
              <Box
                bg="rgba(255,255,255,.05)"
                backdropFilter="blur(25px)"
                border="1px solid rgba(255,255,255,.08)"
                borderRadius="30px"
                p={5}
                boxShadow="0 20px 60px rgba(0,0,0,.35)"
              >
                <VotingSection
                  players={players}
                  vote={vote}
                  setVote={setVote}
                  voted={
                    !!room?.votes?.[
                    user?.uid
                    ]
                  }
                  showVoteMessage={
                    showVoteMessage
                  }
                  submitVote={async () => {
                    if (!vote) {
                      alert(
                        "Select player"
                      );
                      return;
                    }

                    await votePlayer({
                      roomCode,
                      voterId:
                        user.uid,
                      votedPlayerId:
                        vote,
                    });

                    setShowVoteMessage(
                      true
                    );

                    setTimeout(() => {
                      setShowVoteMessage(
                        false
                      );
                    }, 3000);
                  }}
                />
              </Box>

              {/* Round Result */}
              <Box
                bg="rgba(255,255,255,.05)"
                backdropFilter="blur(25px)"
                border="1px solid rgba(255,255,255,.08)"
                borderRadius="30px"
                p={5}
                boxShadow="0 20px 60px rgba(0,0,0,.35)"
              >
                <RoundResult
                  room={room}
                  players={players}
                  isHost={isHost}
                  allVoted={allVoted}
                  onReveal={async () => {
                    await revealRoundResult(
                      roomCode
                    );
                  }}
                />
              </Box>
            </Stack>
          </Grid>
        </Stack>
      </Container>
    </Flex>
  );
}

export default Game;
