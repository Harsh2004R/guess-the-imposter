import {
  Box,
  Heading,
  Text,
} from "@chakra-ui/react";

function WordCard({
  word,
}) {
  return (
    <Box
      bg="rgba(255,255,255,.05)"
      border="1px solid rgba(255,255,255,.08)"
      borderRadius="30px"
      p={6}
    >
      <Text
        color="gray.400"
        mb={2}
      >
        YOUR WORD
      </Text>

      <Heading
        color="cyan.300"
        size="2xl"
      >
        {word}
      </Heading>
    </Box>
  );
}

export default WordCard;