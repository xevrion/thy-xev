import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import querystring from "querystring";
import cors from "cors";
import fetch from "node-fetch";
/* eslint-disable  @typescript-eslint/no-explicit-any */


dotenv.config({ path: ".env.production" });
const app = express();

const PORT = 3001;

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN!;



app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Your React app URL
    credentials: true
}));

app.use(express.json());

// 1. Login route → redirect to Spotify
app.get("/login", (req: Request, res: Response) => {
    const scope = [
        "user-read-currently-playing",
        "user-read-playback-state",
        "user-read-recently-played",
      ].join(" ");
    const authUrl =
        "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
            response_type: "code",
            client_id: CLIENT_ID,
            scope: scope,
            redirect_uri: REDIRECT_URI,
        });
    res.redirect(authUrl);
});

// 2. Callback → exchange code for tokens
app.get("/callback", async (req: Request, res: Response) => {
    const code = req.query.code as string | undefined;

    if (!code) return res.status(400).send("No code provided");

    try {
        // const tokenResponse = await axios.post(
        //     "https://accounts.spotify.com/api/token",
        //     querystring.stringify({
        //         grant_type: "authorization_code",
        //         code: code,
        //         redirect_uri: REDIRECT_URI,
        //         client_id: CLIENT_ID,
        //         client_secret: CLIENT_SECRET,
        //     }),
        //     { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        // );

        // console.log("✅ Refresh token obtained", tokenResponse.data.refresh_token);
        console.log("✅ Refresh token obtained");
        res.send(`
            <html>
                <body style="font-family: Arial; text-align: center; margin-top: 50px;">
                    <h2>✅ Spotify Auth Successful!</h2>
                    <p>You can close this tab and go back to your portfolio.</p>
                    <script>window.close();</script>
                </body>
            </html>
        `);
    } catch (err: any) {
        console.error(err.response?.data || err.message);
        res.status(500).send("Error exchanging code");
    }
});

// 3. Now Playing → fetch current song
app.get("/now-playing", async (req: Request, res: Response) => {
    if (!REFRESH_TOKEN) {
        return res.json({
            isPlaying: false,
            message: "Please authenticate first by visiting /login"
        });
    }

    try {
        // 1) Refresh access token using your refresh token
        const params = new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: REFRESH_TOKEN,
        });
    
        const tokenResp = await axios.post(
          "https://accounts.spotify.com/api/token",
          params.toString(),
          {
            headers: {
              Authorization:
                "Basic " +
                Buffer.from(
                  CLIENT_ID +
                    ":" +
                    CLIENT_SECRET
                ).toString("base64"),
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
    
        const accessToken = tokenResp.data.access_token;
    
        // 2) First try: currently playing track
        const now = await axios.get(
          "https://api.spotify.com/v1/me/player/currently-playing",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            validateStatus: () => true,
          }
        );
    
        // If something is playing
        if (now.status === 200 && now.data && now.data.item) {
          const track = now.data.item;
    
          return res.status(200).json({
            isPlaying: true,
            title: track.name,
            artist: track.artists.map((a: any) => a.name).join(", "),
            album: track.album.name,
            albumArt: track.album.images?.[0]?.url,
            songUrl: track.external_urls.spotify,
          });
        }
    
        // 3) Fallback: recently played
        const recent = await axios.get(
          "https://api.spotify.com/v1/me/player/recently-played?limit=1",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
    
        const last = recent.data.items[0].track;
    
        return res.status(200).json({
          isPlaying: false,
          title: last.name,
          artist: last.artists.map((a: any) => a.name).join(", "),
          albumArt: last.album.images?.[0]?.url,
          songUrl: last.external_urls.spotify,
        });
      } catch (err) {
        console.error((err as any).response?.data || (err as any).message);
        return res.status(500).json({
          error: "Failed to fetch playback",
          details: (err as any).response?.data,
        });
      }
});

// Health check
app.get("/", (req: Request, res: Response) => {
    res.json({
        status: "Server running!",
        authenticated: !!REFRESH_TOKEN,
        endpoints: {
            login: "/login",
            nowPlaying: "/now-playing"
        }
    });
});

app.listen(PORT, () =>
    console.log(`🚀 Spotify server running on http://localhost:${PORT}`)
);



// alltime
app.get("/wakatimeAllTime", async (req: Request, res: Response) => {
    try {
        const apiKey = process.env.WAKATIME_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "Missing WAKATIME_API_KEY in .env" });
        }

        const url = "https://wakatime.com/api/v1/users/current/all_time_since_today";

        const response = await fetch(url, {
            headers: {
                Authorization: "Basic " + Buffer.from(apiKey + ":").toString("base64"),
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            const text = await response.text();
            return res.status(response.status).json({
                error: "Failed to fetch WakaTime all-time data",
                details: text,
            });
        }

        const data = await response.json();
        res.json(data); // forward directly
    } catch (err: any) {
        console.error("Error fetching WakaTime:", err.message);
        res.status(500).json({ error: "Internal error fetching WakaTime" });
    }
});

// Daily stats (today only)
app.get("/wakatimeDaily", async (req: Request, res: Response) => {
    try {
        const apiKey = process.env.WAKATIME_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "Missing WAKATIME_API_KEY in .env" });
        }

        const today = new Date().toISOString().split("T")[0];
        const url = `https://wakatime.com/api/v1/users/current/summaries?start=${today}&end=${today}`;

        const response = await fetch(url, {
            headers: {
                Authorization: "Basic " + Buffer.from(apiKey + ":").toString("base64"),
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            const text = await response.text();
            return res.status(response.status).json({
                error: "Failed to fetch WakaTime daily data",
                details: text,
            });
        }

        const data = await response.json();
        res.json(data); // forward directly
    } catch (err: any) {
        console.error("Error fetching WakaTime daily:", err.message);
        res.status(500).json({ error: "Internal error fetching WakaTime daily" });
    }
});


// Weekly stats (last 7 days)
app.get("/wakatimeWeekly", async (req: Request, res: Response) => {
    try {
        const apiKey = process.env.WAKATIME_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "Missing WAKATIME_API_KEY in .env" });
        }

        const today = new Date().toISOString().split("T")[0];
        const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];

        const url = `https://wakatime.com/api/v1/users/current/summaries?start=${lastWeek}&end=${today}`;

        const response = await fetch(url, {
            headers: {
                Authorization: "Basic " + Buffer.from(apiKey + ":").toString("base64"),
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            const text = await response.text();
            return res.status(response.status).json({
                error: "Failed to fetch WakaTime weekly data",
                details: text,
            });
        }

        const data = await response.json();
        res.json(data); // forward directly
    } catch (err: any) {
        console.error("Error fetching WakaTime weekly:", err.message);
        res.status(500).json({ error: "Internal error fetching WakaTime weekly" });
    }
});
