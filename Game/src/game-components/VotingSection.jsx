import {
  Box,
  Button,
  Heading,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";

function VotingSection({
  players,
  vote,
  setVote,
  submitVote,
  showVoteMessage,
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
          {players
            .filter((player) => !player.eliminated)
            .map((player) => (
              <RadioGroup.Item
                key={player.uid}
                value={player.uid}
                disabled={player.eliminated}
                bg="whiteAlpha.50"
                border="1px solid rgba(255,255,255,.08)"
                p={4}
                color="#FFF"
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
        bg="#d7d7d7"
        color="#000"
        colorScheme="red"
        isDisabled={voted}
        onClick={submitVote}
      >
        {voted
          ? "Vote Submitted"
          : "Submit Vote"}
      </Button>

      {showVoteMessage && (
        <Text
          mt={3}
          color="green.300"
        >
          ✓ Your vote has been submitted
        </Text>
      )}
    </Box>
  );
}

export default VotingSection;