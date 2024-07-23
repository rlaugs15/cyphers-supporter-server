import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// __dirname을 ES 모듈에서 사용 가능하도록 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8001;

// CORS 설정
const corsOptions = {
  origin: "*", // 모든 도메인 허용
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// 정적 파일 서빙 설정
app.use("/frontend", express.static(path.join(__dirname, "frontend")));

// 프록시 엔드포인트 설정
const API_KEY = process.env.API_KEY;
const BASE_PATH = "https://api.neople.co.kr";

// API 키가 제대로 로드되었는지 확인하는 로그 추가
console.log("API_KEY:", API_KEY);

if (!API_KEY) {
  console.error("API_KEY is not defined");
}

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
      params: { apikey: API_KEY },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Neople API에서 데이터를 가져오는 중 오류 발생:", error);
    res
      .status(500)
      .json({ error: "Neople API에서 데이터를 가져오지 못했습니다." });
  }
});

app.get("/api/cy/players/:playerId/matches", async (req, res) => {
  try {
    const { playerId } = req.params;
    const { gameTypeId, startDate, endDate, limit } = req.query;
    const response = await axios.get(
      `${BASE_PATH}/cy/players/${playerId}/matches`,
      {
        params: { gameTypeId, startDate, endDate, limit, apikey: API_KEY },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Neople API에서 데이터를 가져오는 중 오류 발생:", error);
    res
      .status(500)
      .json({ error: "Neople API에서 데이터를 가져오지 못했습니다." });
  }
});

app.get("/api/cy/matches/:matchId", async (req, res) => {
  try {
    const { matchId } = req.params;
    const response = await axios.get(`${BASE_PATH}/cy/matches/${matchId}`, {
      params: { apikey: API_KEY },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Neople API에서 데이터를 가져오는 중 오류 발생:", error);
    res
      .status(500)
      .json({ error: "Neople API에서 데이터를 가져오지 못했습니다." });
  }
});

app.get("/api/cy/characters", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_PATH}/cy/characters`, {
      params: { apikey: API_KEY },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Neople API에서 데이터를 가져오는 중 오류 발생:", error);
    res
      .status(500)
      .json({ error: "Neople API에서 데이터를 가져오지 못했습니다." });
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
          params: { playerId, offset, limit, apikey: API_KEY },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error("Neople API에서 데이터를 가져오는 중 오류 발생:", error);
      res
        .status(500)
        .json({ error: "Neople API에서 데이터를 가져오지 못했습니다." });
    }
  }
);

// 모든 라우트를 index.html로 처리(리액트에서 처리), 최하단에 놓을 것
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
