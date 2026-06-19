import { Box, Button, Heading, Text } from "@chakra-ui/react";

function PlayerPicker({ isHost, players, pickedPlayerId, onPick }) {
  const pickedPlayer = players.find((player) => player.uid === pickedPlayerId);

  return (
    <Box
      bg="rgba(255,255,255,.05)"
      border="1px solid rgba(255,255,255,.08)"
      borderRadius="30px"
      p={6}
    >
      {pickedPlayer && (
        <Box mt={5}>
          <Text mt={2} color="cyan.300" fontSize="2xl" fontWeight="bold">
            {pickedPlayer.name}
            {`'s`}{" "}
            <Text as={"span"} color="white">
              Turn
            </Text>
          </Text>
        </Box>
      )}

      {isHost && (
        <Button mt="10px" colorScheme="purple" onClick={onPick}>
          Pick Random Player
        </Button>
      )}
    </Box>
  );
}

export default PlayerPicker;
