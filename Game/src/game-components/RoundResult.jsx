import {
  Box,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";

function RoundResult({
  eliminatedPlayer,
}) {
  if (!eliminatedPlayer)
    return null;

  return (
    <Box
      bg="rgba(255,255,255,.05)"
      border="1px solid rgba(255,255,255,.08)"
      borderRadius="30px"
      p={6}
    >
      <Heading
        color="white"
        size="md"
      >
        Round Result
      </Heading>

      <Text
        mt={4}
        color="red.300"
        fontSize="xl"
      >
        ❌{" "}
        {
          eliminatedPlayer.name
        }{" "}
        Eliminated
      </Text>
    </Box>
  );
}

export default RoundResult;