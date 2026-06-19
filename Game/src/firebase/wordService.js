import { db } from "./firebase";

import {
  ref,
  set,
  onValue,
  update,
} from "firebase/database";

export const submitWordPair = async ({
  roomCode,
  uid,
  word1,
  word2,
}) => {
  await set(
    ref(
      db,
      `rooms/${roomCode}/wordPairs/${uid}`
    ),
    {
      word1,
      word2,
      submitted: true,
    }
  );
};

export const listenWordPairs = (
  roomCode,
  callback
) => {
  const wordsRef = ref(
    db,
    `rooms/${roomCode}/wordPairs`
  );

  return onValue(wordsRef, (snapshot) => {
    callback(snapshot.val() || {});
  });
};

export const moveToGame = async (
  roomCode
) => {
  await update(
    ref(db, `rooms/${roomCode}`),
    {
      status: "game",
    }
  );
};