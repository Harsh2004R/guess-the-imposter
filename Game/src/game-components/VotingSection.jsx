import {
  Box,
  Button,
  Heading,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";

function VotingSection({
  players,
  vote,
  setVote,
  submitVote,
  voted,
}) {
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
        Vote
      </Heading>

      <RadioGroup.Root
        value={vote}
        onValueChange={(e) =>
          setVote(e.value)
        }
      >
        <Stack gap={3}>
          {players.map((player) => (
            <RadioGroup.Item
              key={player.id}
              value={player.id}
              disabled={player.eliminated}
              bg="whiteAlpha.50"
              border="1px solid rgba(255,255,255,.08)"
              p={4}
              borderRadius="15px"
              cursor="pointer"
            >
              <RadioGroup.ItemHiddenInput />

              <RadioGroup.ItemIndicator />

              <RadioGroup.ItemText>
                {player.name}
              </RadioGroup.ItemText>
            </RadioGroup.Item>
          ))}
        </Stack>
      </RadioGroup.Root>

      <Button
        mt={5}
        colorScheme="red"
        isDisabled={voted}
        onClick={submitVote}
      >
        {voted
          ? "Vote Submitted"
          : "Submit Vote"}
      </Button>
    </Box>
  );
}

export default VotingSection;