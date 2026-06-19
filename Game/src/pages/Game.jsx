import {
  Container,
  Flex,
  Grid,
  Heading,
  Stack,
  Spinner,
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
      <Flex minH="100vh" bg="#050816" justify="center" align="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const players = Object.values(room.players || {});

  const isHost = room.hostId === user?.uid;

  const alivePlayers = players.filter((player) => !player.eliminated);

  const votes = room.votes || {};

  const voteCount = Object.keys(votes).length;

  const allVoted = voteCount >= alivePlayers.length;

  const myWord =
    room.imposterId === user?.uid
      ? room.selectedPair?.word2
      : room.selectedPair?.word1;

  return (
    <Flex minH="100vh" bg="#050816" py={10}>
      <Container maxW="1400px">
        <Stack gap={8}>
          <Heading color="white">Game Room</Heading>

          <Grid
            templateColumns={{
              base: "1fr",
              lg: "350px 1fr",
            }}
            gap={6}
          >
            <PlayerList
              players={players}
              pickedPlayerId={room.pickedPlayerId}
            />

            <Stack gap={6}>
              <WordCard word={myWord} />

              <PlayerPicker
                players={players}
                pickedPlayerId={room.pickedPlayerId}
                isHost={isHost}
                onPick={async () => {
                  const alivePlayers = players.filter(
                    (player) => !player.eliminated,
                  );

                  const randomPlayer =
                    alivePlayers[
                      Math.floor(Math.random() * alivePlayers.length)
                    ];

                  await pickRandomPlayer(roomCode, randomPlayer.uid);
                }}
              />

              <VotingSection
                players={players}
                vote={vote}
                setVote={setVote}
                voted={!!room?.votes?.[user?.uid]}
                showVoteMessage={showVoteMessage}
                submitVote={async () => {
                  if (!vote) {
                    alert("Select player");
                    return;
                  }

                  await votePlayer({
                    roomCode,
                    voterId: user.uid,
                    votedPlayerId: vote,
                  });

                  setShowVoteMessage(true);

                  setTimeout(() => {
                    setShowVoteMessage(false);
                  }, 3000);
                }}
              />

              <RoundResult
                room={room}
                players={players}
                isHost={isHost}
                allVoted={allVoted}
                onReveal={async () => {
                  await revealRoundResult(roomCode);
                }}
              />
            </Stack>
          </Grid>
        </Stack>
      </Container>
    </Flex>
  );
}

export default Game;
