import {
  Box,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";

function PlayerPicker({
  isHost,
  players,
  pickedPlayerId,
  onPick,
}) {
  const current =
    players.find(
      (p) =>
        p.id === pickedPlayerId
    );

  return (
    <Box
      bg="rgba(255,255,255,.05)"
      border="1px solid rgba(255,255,255,.08)"
      borderRadius="30px"
      p={6}
    >
      <Heading
        size="md"
        color="white"
        mb={5}
      >
        Player Picker
      </Heading>

      {current ? (
        <Text
          color="green.300"
          fontSize="xl"
          mb={5}
        >
          🎯 {current.name}
        </Text>
      ) : (
        <Text
          color="gray.400"
          mb={5}
        >
          No Player Selected
        </Text>
      )}

      {isHost && (
        <Button
          colorScheme="purple"
          onClick={onPick}
        >
          Pick Random Player
        </Button>
      )}
    </Box>
  );
}

export default PlayerPicker;