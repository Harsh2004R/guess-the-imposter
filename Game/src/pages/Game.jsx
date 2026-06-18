import {
  Container,
  Flex,
  Grid,
  Heading,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";

import PlayerList from "../game-components/PlayerList";
import WordCard from "../game-components/WordCard";
import PlayerPicker from "../game-components/PlayerPicker";
import VotingSection from "../game-components/VotingSection";
import RoundResult from "../game-components/RoundResult";

import { gameData } from "../data/gameMock.js";

function Game() {
  const [pickedPlayerId, setPickedPlayerId] =
    useState(null);

  const [vote, setVote] =
    useState("");

  const [voted, setVoted] =
    useState(false);

  const [
    eliminatedPlayer,
    setEliminatedPlayer,
  ] = useState(null);

  const myWord =
    gameData.currentUserId ===
    gameData.imposterId
      ? gameData.imposterWord
      : gameData.currentWord;

  const randomPick = () => {
    const alive =
      gameData.players.filter(
        (player) =>
          !player.eliminated
      );

    const random =
      alive[
        Math.floor(
          Math.random() *
            alive.length
        )
      ];

    setPickedPlayerId(
      random.id
    );
  };

  const submitVote = () => {
    if (!vote) return;

    setVoted(true);

    const eliminated =
      gameData.players.find(
        (player) =>
          player.id === vote
      );

    setEliminatedPlayer(
      eliminated
    );
  };

  return (
    <Flex
      minH="100vh"
      bg="#050816"
      py={10}
    >
      <Container
        maxW="1400px"
      >
        <Stack gap={8}>
          <Heading
            color="white"
          >
            Game Room
          </Heading>

          <Grid
            templateColumns={{
              base: "1fr",
              lg: "350px 1fr",
            }}
            gap={6}
          >
            <PlayerList
              players={
                gameData.players
              }
              pickedPlayerId={
                pickedPlayerId
              }
            />

            <Stack gap={6}>
              <WordCard
                word={myWord}
              />

              <PlayerPicker
                players={
                  gameData.players
                }
                pickedPlayerId={
                  pickedPlayerId
                }
                isHost={
                  gameData.hostId ===
                  gameData.currentUserId
                }
                onPick={
                  randomPick
                }
              />

              <VotingSection
                players={
                  gameData.players
                }
                vote={vote}
                setVote={setVote}
                submitVote={
                  submitVote
                }
                voted={voted}
              />

              <RoundResult
                eliminatedPlayer={
                  eliminatedPlayer
                }
              />
            </Stack>
          </Grid>
        </Stack>
      </Container>
    </Flex>
  );
}

export default Game;