import {
  Badge,
  Box,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

function PlayerList({
  players,
  pickedPlayerId,
}) {
  return (
    <Box
      bg="rgba(255,255,255,.05)"
      borderRadius="30px"
      border="1px solid rgba(255,255,255,.08)"
      p={6}
    >
      <Heading
        color="white"
        size="md"
        mb={5}
      >
        Players
      </Heading>

      <Stack>
        {players
        .map((player) => (
          <Flex
            key={player.uid}
            justify="space-between"
            align="center"
            p={3}
            borderRadius="15px"
            bg={
              pickedPlayerId ===
              player.uid
                ? "green.500"
                : "whiteAlpha.50"
            }
            opacity={
              player.eliminated
                ? 0.4
                : 1
            }
          >
            <Text color="white">
              {player.eliminated
                ? "❌ "
                : "🟢 "}
              {player.name}
            </Text>

            {pickedPlayerId ===
              player.uid && (
              <Badge
                colorScheme="green"
              >
                TURN
              </Badge>
            )}
          </Flex>
        ))}
      </Stack>
    </Box>
  );
}

export default PlayerList;