import {
  ref,
  set,
  get,
  onValue,
  push,
  remove,
  update,
} from "firebase/database";

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
    selectedPair: null,

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

// words pair lofic
export const addWordPair = async ({ roomCode, word1, word2, createdBy }) => {
  const pairRef = push(ref(db, `rooms/${roomCode}/wordPairs`));

  await set(pairRef, {
    id: pairRef.key,
    word1,
    word2,
    createdBy,
    createdAt: Date.now(),
  });
};

export const deleteWordPair = async (roomCode, pairId) => {
  await remove(ref(db, `rooms/${roomCode}/wordPairs/${pairId}`));
};

export const listenToWordPairs = (roomCode, callback) => {
  return onValue(ref(db, `rooms/${roomCode}/wordPairs`), (snapshot) => {
    const data = snapshot.val() || {};

    callback(Object.values(data));
  });
};

// game.jsx required functions

export const startGame = async ({ roomCode, imposterId, selectedPair }) => {
  await update(ref(db, `rooms/${roomCode}`), {
    status: "game",
    imposterId,
    selectedPair,
    pickedPlayerId: null,
    votes: {},
    eliminatedPlayerId: null,
    winner: null,
  });
};

export const updateRoomStatus = async (roomCode, status) => {
  await update(ref(db, `rooms/${roomCode}`), {
    status,
  });
};

export const getRoom = async (roomCode) => {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));

  return snapshot.val();
};

export const pickRandomPlayer = async (roomCode, playerId) => {
  await update(ref(db, `rooms/${roomCode}`), {
    pickedPlayerId: playerId,
  });
};

// voting functions
export const votePlayer = async ({ roomCode, voterId, votedPlayerId }) => {
  await update(ref(db, `rooms/${roomCode}/votes`), {
    [voterId]: votedPlayerId,
  });
};

export const eliminatePlayer = async (roomCode, playerId) => {
  await update(ref(db, `rooms/${roomCode}/players/${playerId}`), {
    eliminated: true,
  });
};




export const revealRoundResult = async (roomCode) => {
  const room = await getRoom(roomCode);

  const votes = room.votes || {};

  const count = {};

  Object.values(votes).forEach((playerId) => {
    count[playerId] = (count[playerId] || 0) + 1;
  });

  const entries = Object.entries(count);

  if (!entries.length) return;

  entries.sort((a, b) => b[1] - a[1]);

  const eliminatedPlayerId = entries[0][0];

  await eliminatePlayer(
    roomCode,
    eliminatedPlayerId
  );

  const updatedRoom = await getRoom(roomCode);

  const alivePlayers = Object.values(
    updatedRoom.players || {}
  ).filter((p) => !p.eliminated);

  // IMPOSTER CAUGHT

  if (
    eliminatedPlayerId ===
    updatedRoom.imposterId
  ) {
    await update(
      ref(db, `rooms/${roomCode}`),
      {
        status: "finished",
        winner: "players",
        winnerPlayers: alivePlayers.map(
          (p) => p.uid
        ),
        eliminatedPlayerId,
      }
    );

    return;
  }

  // IMPOSTER WIN

  if (alivePlayers.length <= 3) {
    await update(
      ref(db, `rooms/${roomCode}`),
      {
        status: "finished",
        winner: "imposter",
        eliminatedPlayerId,
      }
    );

    return;
  }

  // NEXT VOTING ROUND

  await update(
    ref(db, `rooms/${roomCode}`),
    {
      eliminatedPlayerId,
      votes: {},
      pickedPlayerId: null,
    }
  );
};

export const restartGame = async (roomCode) => {
  const room = await getRoom(roomCode);

  const players = Object.values(room.players || {});
  const pairs = Object.values(room.wordPairs || {});

  const selectedPair =
    pairs[Math.floor(Math.random() * pairs.length)];

  const imposter =
    players[Math.floor(Math.random() * players.length)];

  const updatedPlayers = {};

  players.forEach((player) => {
    updatedPlayers[player.uid] = {
      ...player,
      eliminated: false,
    };
  });

  await update(ref(db, `rooms/${roomCode}`), {
    status: "game",

    players: updatedPlayers,

    imposterId: imposter.uid,

    selectedPair,

    votes: {},

    winner: null,

    eliminatedPlayerId: null,

    pickedPlayerId: null,
  });
};