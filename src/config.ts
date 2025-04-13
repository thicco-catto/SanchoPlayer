import dotenv from 'dotenv';

let loadedEnv = false;

function TryLoadEnv() {
    if (!loadedEnv) {
        dotenv.config();
        loadedEnv = true;
    }
}

let cachedDiscordToken: string | undefined;

export function GetDiscordToken(): string {
    TryLoadEnv();

    if (cachedDiscordToken) {
        return cachedDiscordToken;
    }

    cachedDiscordToken = process.env["DISCORD_TOKEN"];

    if (cachedDiscordToken) {
        return cachedDiscordToken;
    }

    throw new Error("DISCORD_TOKEN has not been set as environment variable.");
}

let cachedAppId: string | undefined;

export function GetAppID(): string {
    TryLoadEnv();

    if (cachedAppId) {
        return cachedAppId;
    }

    cachedAppId = process.env["APP_ID"];

    if (cachedAppId) {
        return cachedAppId;
    }

    throw new Error("APP_ID has not been set as environment variable.");
}

let cachedYtdlp: string | undefined;

export function GetYTDLPPath(): string {
    TryLoadEnv();

    if (cachedYtdlp) {
        return cachedYtdlp;
    }

    cachedYtdlp = process.env["YTDLP_PATH"];

    if (cachedYtdlp) {
        return cachedYtdlp;
    }

    throw new Error("YTDLP_PATH has not been set as environment variable.");
}

let cachedFFMPEGPath: string | undefined;

export function GetFFMPEGPath(): string {
    TryLoadEnv();

    if (cachedFFMPEGPath) {
        return cachedFFMPEGPath;
    }

    cachedFFMPEGPath = process.env["FFMPEG_PATH"];

    if (cachedFFMPEGPath) {
        return cachedFFMPEGPath;
    }

    throw new Error("FFMPEG_PATH has not been set as environment variable.");
}

let cachedYoutubeKey: string | undefined;

export function GetYoutubeKey(): string {
    TryLoadEnv();

    if (cachedYoutubeKey) {
        return cachedYoutubeKey;
    }

    cachedYoutubeKey = process.env["YOUTUBE_KEY"];

    if (cachedYoutubeKey) {
        return cachedYoutubeKey;
    }

    throw new Error("YOUTUBE_KEY has not been set as environment variable.");
}

let cachedSpotifyClientId: string | undefined;

export function GetSpotifyClientID(): string {
    TryLoadEnv();

    if (cachedSpotifyClientId) {
        return cachedSpotifyClientId;
    }

    cachedSpotifyClientId = process.env["SPOTIFY_CLIENT_ID"];

    if (cachedSpotifyClientId) {
        return cachedSpotifyClientId;
    }

    throw new Error("SPOTIFY_CLIENT_ID has not been set as environment variable.");
}

let cachedSpotifyClientSecret: string | undefined;

export function GetSpotifyClientSecret(): string {
    TryLoadEnv();

    if (cachedSpotifyClientSecret) {
        return cachedSpotifyClientSecret;
    }

    cachedSpotifyClientSecret = process.env["SPOTIFY_CLIENT_SECRET"];

    if (cachedSpotifyClientSecret) {
        return cachedSpotifyClientSecret;
    }

    throw new Error("SPOTIFY_CLIENT_SECRET has not been set as environment variable.");
}