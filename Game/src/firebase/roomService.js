import { ref, set, get, onValue } from "firebase/database";

import { db } from "./firebase";

const CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";

export const generateRoomCode = () => {
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  }

  return code;
};

export const createRoom = async ({ roomCode, uid, playerName }) => {
  await set(ref(db, `rooms/${roomCode}`), {
    roomCode,

    hostId: uid,

    status: "lobby",

    currentTurnPlayer: null,

    imposterId: null,

    pickedPair: null,

    createdAt: Date.now(),

    players: {
      [uid]: {
        uid,
        name: playerName,
        host: true,
        eliminated: false,
      },
    },
  });
};

export const joinRoom = async ({ roomCode, uid, playerName }) => {
  const roomRef = ref(db, `rooms/${roomCode}`);

  const snapshot = await get(roomRef);

  if (!snapshot.exists()) {
    throw new Error("Room not found");
  }

  await set(ref(db, `rooms/${roomCode}/players/${uid}`), {
    uid,
    name: playerName,
    host: false,
    eliminated: false,
  });
};

export const listenToRoom = (roomCode, callback) => {
  const roomRef = ref(db, `rooms/${roomCode}`);

  return onValue(roomRef, (snapshot) => {
    callback(snapshot.val());
  });
};
