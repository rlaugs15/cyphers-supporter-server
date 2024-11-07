import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = 8080;

// __dirname 및 __filename 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS 설정
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "/frontend")));

const API_KEY = process.env.API_KEY;
const BASE_PATH = "https://api.neople.co.kr";

// 프록시 엔드포인트 예시
app.get("/api/cy/players", async (req, res) => {
  try {
    const { nickname } = req.query;
    const response = await axios.get(`${BASE_PATH}/cy/players`, {
      params: {
        nickname,
        apikey: API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Neople API에서 데이터를 가져오는 중 오류 발생:", error);
    res
      .status(500)
      .json({ error: "Neople API에서 데이터를 가져오지 못했습니다." });
  }
});

app.get("/api/cy/players/:playerId", async (req, res) => {
  try {
    const { playerId } = req.params;
    const response = await axios.get(`${BASE_PATH}/cy/players/${playerId}`, {
      params: {
        apikey: API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Neople API에서 데이터를 가져오는 중 오류 발생:", error);
    res
      .status(500)
      .json({ error: "FNeople API에서 데이터를 가져오지 못했습니다." });
  }
});

app.get("/api/cy/players/:playerId/matches", async (req, res) => {
  try {
    const { playerId } = req.params;
    const { gameTypeId, startDate, endDate, limit } = req.query;
    const response = await axios.get(
      `${BASE_PATH}/cy/players/${playerId}/matches`,
      {
        params: {
          gameTypeId,
          startDate,
          endDate,
          limit,
          apikey: API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Neople API에서 데이터를 가져오는 중 오류 발생:", error);
    res
      .status(500)
      .json({ error: "FNeople API에서 데이터를 가져오지 못했습니다." });
  }
});

app.get("/api/cy/matches/:matchId", async (req, res) => {
  try {
    const { matchId } = req.params;
    const response = await axios.get(`${BASE_PATH}/cy/matches/${matchId}`, {
      params: {
        apikey: API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Neople API에서 데이터를 가져오는 중 오류 발생:", error);
    res
      .status(500)
      .json({ error: "FNeople API에서 데이터를 가져오지 못했습니다." });
  }
});

app.get("/api/cy/characters", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_PATH}/cy/characters`, {
      params: {
        apikey: API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Neople API에서 데이터를 가져오는 중 오류 발생:", error);
    res
      .status(500)
      .json({ error: "FNeople API에서 데이터를 가져오지 못했습니다." });
  }
});

app.get(
  "/api/cy/ranking/characters/:characterId/:rankingType",
  async (req, res) => {
    try {
      const { characterId, rankingType } = req.params;
      const { playerId, offset, limit } = req.query;
      const response = await axios.get(
        `${BASE_PATH}/cy/ranking/characters/${characterId}/${rankingType}`,
        {
          params: {
            playerId,
            offset,
            limit,
            apikey: API_KEY,
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error("Neople API에서 데이터를 가져오는 중 오류 발생:", error);
      res
        .status(500)
        .json({ error: "FNeople API에서 데이터를 가져오지 못했습니다." });
    }
  }
);

app.get("/api/cy/battleitems/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const response = await axios.get(`${BASE_PATH}/cy/battleitems/${itemId}`, {
      params: {
        apikey: API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Neople API에서 데이터를 가져오는 중 오류 발생:", error);
    res
      .status(500)
      .json({ error: "FNeople API에서 데이터를 가져오지 못했습니다." });
  }
});

// 모든 라우트를 index.html로 처리(리액트에서 처리), 최하단에 놓을 것
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.listen(PORT, function () {
  console.log(`listening on ${PORT}`);
});
