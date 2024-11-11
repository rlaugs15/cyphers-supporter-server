import axios from "axios";
import "dotenv/config";

const API_KEY = process.env.API_KEY;
const BASE_PATH = "https://api.neople.co.kr";

export const handler = async (event) => {
  const {
    nickname,
    playerId,
    gameTypeId,
    startDate,
    endDate,
    limit,
    matchId,
    characterId,
    rankingType,
    itemId,
    offset,
  } = { ...event.queryStringParameters, ...event.pathParameters };

  let url;
  if (nickname) {
    url = `${BASE_PATH}/cy/players?nickname=${nickname}`;
  } else if (playerId) {
    url =
      gameTypeId || startDate || endDate || limit
        ? `${BASE_PATH}/cy/players/${playerId}/matches`
        : `${BASE_PATH}/cy/players/${playerId}`;
  } else if (matchId) {
    url = `${BASE_PATH}/cy/matches/${matchId}`;
  } else if (characterId && rankingType) {
    url = `${BASE_PATH}/cy/ranking/characters/${characterId}/${rankingType}`;
  } else if (itemId) {
    url = `${BASE_PATH}/cy/battleitems/${itemId}`;
  } else {
    url = `${BASE_PATH}/cy/characters`;
  }

  const params = {
    apikey: API_KEY,
    ...(gameTypeId && { gameTypeId }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(limit && { limit }),
    ...(offset && { offset }),
  };

  try {
    const { data } = await axios.get(url, { params });
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return handleAxiosError(error);
  }
};
