import { Box, Button, Heading, Text } from "@chakra-ui/react";

function RoundResult({ room, players, isHost, allVoted, onReveal }) {
  // const eliminatedPlayer = players.find((player) => player.eliminated);
  const eliminatedPlayer = players.find(
    (player) => player.uid === room.eliminatedPlayerId,
  );

  return (
    <Box
      bg="rgba(255,255,255,.05)"
      border="1px solid rgba(255,255,255,.08)"
      borderRadius="30px"
      p={6}
    >
      <Heading color="white" size="md" mb={4}>
        Round Result
      </Heading>

      {!allVoted ? (
        <Text color="gray.400">Waiting for all players to vote...</Text>
      ) : (
        <>
          {isHost && (
            <Button colorScheme="purple" onClick={onReveal}>
              Reveal Result
            </Button>
          )}

          {eliminatedPlayer && (
            <Text mt={4} color="red.300" fontSize="xl" fontWeight="bold">
              ❌ {eliminatedPlayer.name} Eliminated
            </Text>
          )}
        </>
      )}
    </Box>
  );
}

export default RoundResult;
