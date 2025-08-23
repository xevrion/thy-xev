import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import querystring from "querystring";
import cors from "cors";

dotenv.config();
const app = express();

const PORT = 3001;

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;

let refresh_token: string | null = null;


app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Your React app URL
    credentials: true
}));

app.use(express.json());

// 1. Login route → redirect to Spotify
app.get("/login", (req: Request, res: Response) => {
    const scope = "user-read-currently-playing user-read-playback-state";
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
app.get("/api/callback", async (req: Request, res: Response) => {
    const code = req.query.code as string | undefined;

    if (!code) return res.status(400).send("No code provided");

    try {
        const tokenResponse = await axios.post(
            "https://accounts.spotify.com/api/token",
            querystring.stringify({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: REDIRECT_URI,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        refresh_token = tokenResponse.data.refresh_token;
        console.log("✅ Refresh token obtained!");
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
    if (!refresh_token) {
        return res.json({
            isPlaying: false,
            message: "Please authenticate first by visiting /login"
        });
    }

    try {
        // Refresh access token
        const tokenResponse = await axios.post(
            "https://accounts.spotify.com/api/token",
            querystring.stringify({
                grant_type: "refresh_token",
                refresh_token: refresh_token,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const access_token: string = tokenResponse.data.access_token;

        // Get currently playing
        const nowPlaying = await axios.get(
            "https://api.spotify.com/v1/me/player/currently-playing",
            {
                headers: { Authorization: `Bearer ${access_token}` },
            }
        );

        if (nowPlaying.status === 204 || !nowPlaying.data) {
            return res.json({ isPlaying: false, message: "No song currently playing" });
        }

        const song = nowPlaying.data.item;
        const isPlaying = nowPlaying.data.is_playing;

        res.json({
            isPlaying: isPlaying,
            title: song.name,
            artist: song.artists.map((a: any) => a.name).join(", "),
            album: song.album.name,
            albumArt: song.album.images[0]?.url || null,
            songUrl: song.external_urls.spotify,
            duration: song.duration_ms,
            progress: nowPlaying.data.progress_ms,
            preview_url: song.preview_url, // 30s preview if available (refresh every 30 seconds)
        });
    } catch (err: any) {
        console.error("Error fetching now playing:", err.response?.data || err.message);
        res.json({ isPlaying: false, message: "Error fetching current song" });
    }
});

// Health check
app.get("/", (req: Request, res: Response) => {
    res.json({
        status: "Server running!",
        authenticated: !!refresh_token,
        endpoints: {
            login: "/login",
            nowPlaying: "/now-playing"
        }
    });
});

app.listen(PORT, () =>
    console.log(`🚀 Spotify server running on http://localhost:${PORT}`)
);