// import {
//   Box,
//   Button,
//   Container,
//   Flex,
//   Grid,
//   Heading,
//   Input,
//   Stack,
//   Text,
//   Badge,
// } from "@chakra-ui/react";
// import { useState } from "react";
// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
// import { useNavigate } from "react-router-dom";

// function WordCollection() {
//   const navigate = useNavigate();

//   const [word1, setWord1] = useState("");
//   const [word2, setWord2] = useState("");

//   const [pairs, setPairs] = useState([
//     {
//       id: 1,
//       word1: "Fish",
//       word2: "Crab",
//     },
//     {
//       id: 2,
//       word1: "Tea",
//       word2: "Coffee",
//     },
//   ]);

//   useGSAP(() => {
//     gsap.from(".bucket-card", {
//       y: 50,
//       opacity: 0,
//       duration: 1,
//     });

//     gsap.from(".pair-card", {
//       y: 30,
//       opacity: 0,
//       stagger: 0.08,
//       duration: 0.5,
//     });
//   });

//   const addPair = () => {
//     if (!word1.trim() || !word2.trim()) {
//       alert("Enter both words");
//       return;
//     }

//     const newPair = {
//       id: Date.now(),
//       word1,
//       word2,
//     };

//     setPairs((prev) => [...prev, newPair]);

//     setWord1("");
//     setWord2("");
//   };

//   const removePair = (id) => {
//     setPairs((prev) => prev.filter((item) => item.id !== id));
//   };

//   return (
//     <Flex
//       minH="100vh"
//       bg="#050816"
//       py={10}
//       px={4}
//       position="relative"
//       overflow="hidden"
//     >
//       {" "}
//       <Box
//         position="absolute"
//         top="-150px"
//         left="-150px"
//         w="400px"
//         h="400px"
//         bg="purple.500"
//         opacity=".18"
//         borderRadius="full"
//         filter="blur(170px)"
//       />
//       <Box
//         position="absolute"
//         bottom="-150px"
//         right="-150px"
//         w="400px"
//         h="400px"
//         bg="cyan.400"
//         opacity=".15"
//         borderRadius="full"
//         filter="blur(170px)"
//       />
//       <Container maxW="1200px">
//         <Stack gap={8}>
//           <Box textAlign="center">
//             <Heading color="white">Word Collection</Heading>

//             <Text color="gray.400" mt={2}>
//               Every player submits similar word pairs
//             </Text>
//           </Box>

//           <Box
//             className="bucket-card"
//             bg="rgba(255,255,255,.05)"
//             backdropFilter="blur(20px)"
//             border="1px solid rgba(255,255,255,.08)"
//             borderRadius="30px"
//             p={6}
//           >
//             <Stack gap={4}>
//               <Input
//                 placeholder="Word 1"
//                 size="lg"
//                 bg="whiteAlpha.100"
//                 color="white"
//                 value={word1}
//                 onChange={(e) => setWord1(e.target.value)}
//               />

//               <Input
//                 placeholder="Word 2"
//                 size="lg"
//                 bg="whiteAlpha.100"
//                 color="white"
//                 value={word2}
//                 onChange={(e) => setWord2(e.target.value)}
//               />

//               <Button colorScheme="purple" h="55px" onClick={addPair}>
//                 Add Pair
//               </Button>
//             </Stack>
//           </Box>

//           <Flex justify="space-between" align="center" flexWrap="wrap">
//             <Heading size="md" color="white">
//               Word Bucket
//             </Heading>

//             <Badge colorScheme="green" p={3} borderRadius="full">
//               {pairs.length} Pairs
//             </Badge>
//           </Flex>

//           <Grid
//             templateColumns={{
//               base: "1fr",
//               md: "1fr 1fr",
//               lg: "1fr 1fr 1fr",
//             }}
//             gap={5}
//           >
//             {pairs.map((pair) => (
//               <Box
//                 key={pair.id}
//                 className="pair-card"
//                 bg="rgba(255,255,255,.05)"
//                 border="1px solid rgba(255,255,255,.08)"
//                 borderRadius="25px"
//                 p={5}
//               >
//                 <Heading color="white" size="md">
//                   {pair.word1}
//                 </Heading>

//                 <Text color="gray.400" mt={2}>
//                   +
//                 </Text>

//                 <Heading color="cyan.300" size="md" mt={2}>
//                   {pair.word2}
//                 </Heading>

//                 <Button
//                   mt={4}
//                   size="sm"
//                   colorScheme="red"
//                   onClick={() => removePair(pair.id)}
//                 >
//                   Remove
//                 </Button>
//               </Box>
//             ))}
//           </Grid>

//           <Button
//             h="65px"
//             size="lg"
//             bgGradient="linear(to-r, purple.500, cyan.400)"
//             color="black.300"
//             fontWeight="bold"
//             onClick={() => navigate("/game")}
//           >
//             Lock Bucket & Continue
//           </Button>
//         </Stack>
//       </Container>
//     </Flex>
//   );
// }

// export default WordCollection;



import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Input,
  Stack,
  Text,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

import {
  addWordPair,
  deleteWordPair,
  listenToWordPairs,
} from "../firebase/roomService";

import { useAuth } from "../context/AuthContext";

function WordCollection() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const roomCode = sessionStorage.getItem("roomCode");

  const [word1, setWord1] = useState("");
  const [word2, setWord2] = useState("");

  const [pairs, setPairs] = useState([]);

  useEffect(() => {
    if (!roomCode) return;

    const unsubscribe = listenToWordPairs(
      roomCode,
      (pairsData) => {
        setPairs(pairsData);
      }
    );

    return () => unsubscribe();
  }, [roomCode]);

  useGSAP(() => {
    gsap.from(".bucket-card", {
      y: 50,
      opacity: 0,
      duration: 1,
    });

    gsap.from(".pair-card", {
      y: 30,
      opacity: 0,
      stagger: 0.08,
      duration: 0.5,
    });
  });

  const addPairHandler = async () => {
    if (!word1.trim() || !word2.trim()) {
      alert("Enter both words");
      return;
    }

    try {
      await addWordPair({
        roomCode,
        word1: word1.trim(),
        word2: word2.trim(),
        createdBy: user.uid,
      });

      setWord1("");
      setWord2("");
    } catch (error) {
      console.error(error);
      alert("Failed to add pair");
    }
  };

  const removePairHandler = async (pairId) => {
    try {
      await deleteWordPair(roomCode, pairId);
    } catch (error) {
      console.error(error);
      alert("Failed to remove pair");
    }
  };

  return (
    <Flex
      minH="100vh"
      bg="#050816"
      py={10}
      px={4}
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="-150px"
        left="-150px"
        w="400px"
        h="400px"
        bg="purple.500"
        opacity=".18"
        borderRadius="full"
        filter="blur(170px)"
      />

      <Box
        position="absolute"
        bottom="-150px"
        right="-150px"
        w="400px"
        h="400px"
        bg="cyan.400"
        opacity=".15"
        borderRadius="full"
        filter="blur(170px)"
      />

      <Container maxW="1200px">
        <Stack gap={8}>
          <Box textAlign="center">
            <Heading color="white">
              Word Collection
            </Heading>

            <Text color="gray.400" mt={2}>
              Add similar word pairs for the game
            </Text>
          </Box>

          <Box
            className="bucket-card"
            bg="rgba(255,255,255,.05)"
            backdropFilter="blur(20px)"
            border="1px solid rgba(255,255,255,.08)"
            borderRadius="30px"
            p={6}
          >
            <Stack gap={4}>
              <Input
                placeholder="Word 1"
                size="lg"
                bg="whiteAlpha.100"
                color="white"
                value={word1}
                onChange={(e) =>
                  setWord1(e.target.value)
                }
              />

              <Input
                placeholder="Word 2"
                size="lg"
                bg="whiteAlpha.100"
                color="white"
                value={word2}
                onChange={(e) =>
                  setWord2(e.target.value)
                }
              />

              <Button
                colorScheme="purple"
                h="55px"
                onClick={addPairHandler}
              >
                Add Pair
              </Button>
            </Stack>
          </Box>

          <Flex
            justify="space-between"
            align="center"
            flexWrap="wrap"
          >
            <Heading
              size="md"
              color="white"
            >
              Word Bucket
            </Heading>

            <Badge
              colorScheme="green"
              p={3}
              borderRadius="full"
            >
              {pairs.length} Pairs
            </Badge>
          </Flex>

          <Grid
            templateColumns={{
              base: "1fr",
              md: "1fr 1fr",
              lg: "1fr 1fr 1fr",
            }}
            gap={5}
          >
            {pairs.map((pair) => (
              <Box
              // border="1px solid red"
                key={pair.id}
                className="pair-card"
                bg="rgba(255,255,255,.05)"
                border="1px solid rgba(255,255,255,.08)"
                borderRadius="25px"
                p={5}
              >
                <Heading
                  color="white"
                  filter={"blur(2.6px)"}
                  size="md"
                >
                  {pair.word1}
                </Heading>

                <Text
                  color="gray.400"
                  mt={2}
                >
                  +
                </Text>

                <Heading
                  color="cyan.300"
                    filter={"blur(2.6px)"}
                  size="md"
                  mt={2}
                >
                  {pair.word2}
                </Heading>

                <Button
                  mt={4}
                  size="sm"
                  colorScheme="red"
                  onClick={() =>
                    removePairHandler(pair.id)
                  }
                >
                  Remove
                </Button>
              </Box>
            ))}
          </Grid>

          <Button
            h="65px"
            size="lg"
            bgGradient="linear(to-r, purple.500, cyan.400)"
            color="black"
            fontWeight="bold"
            onClick={() => navigate("/game")}
          >
            Lock Bucket & Continue
          </Button>
        </Stack>
      </Container>
    </Flex>
  );
}

export default WordCollection;

