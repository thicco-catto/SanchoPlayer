import search from "youtube-search";
import { GetSpotifyClientID, GetSpotifyClientSecret, GetYoutubeKey } from "../config";
import { User } from "discord.js";
import SpotifyWebApi from "spotify-web-api-node";

export class Song {
    url: string;
    title: string;
    username: string;
    userAvatar: string;
    thumbnail: string | null;

    constructor(url: string, title: string, username: string, userAvatar: string, thumbnail: string | null) {
        this.url = url;
        this.title = title;
        this.username = username;
        this.userAvatar = userAvatar;
        this.thumbnail = thumbnail;
    }
}

const queues: { [guildId: string]: Song[] } = {}

/**
 * Returns the music queue for the given guild.
 * @param guildId 
 * @returns 
 */
export function GetMusicQueue(guildId: string): Song[] {
    let queue = queues[guildId];

    if (!queue) {
        queue = [];
        queues[guildId] = queue;
    }

    return queue;
}

/**
 * Returns the song that's currently playing.
 * 
 * @param guildId 
 * @returns 
 */
export function GetCurrentlyPlaying(guildId: string): Song | undefined {
    const queue = GetMusicQueue(guildId);

    if (queue.length === 0) {
        return undefined;
    }

    return queue[0];
}

/**
 * Finishes the current song and goes to the next.
 * 
 * @param guildId 
 */
export function Next(guildId: string): Song | undefined {
    const queue = GetMusicQueue(guildId);
    queue.shift();
    return GetCurrentlyPlaying(guildId);
}

/**
 * Empties the queue for the given guild.
 * @param guildId 
 */
export function Flush(guildId: string) {
    queues[guildId] = [];
}

/**
 * Looks up the given query in youtube and enqueues the result.
 * @param query 
 */
export async function Enqueue(guildId: string, query: string, user: User) {
    const results = await search(query, {
        key: GetYoutubeKey(),
        maxResults: 1
    });

    const result = results.results[0];
    const song = new Song(
        result.link,
        result.title,
        user.displayName,
        user.avatarURL() ?? user.defaultAvatarURL,
        result.thumbnails.medium?.url ?? null
    );

    GetMusicQueue(guildId).push(song);

    return song;
}

export async function EnqueueSpotify(guildId: string, spotifyUrl: string, user: User, shuffle: boolean) {
    const spotifyApi = new SpotifyWebApi({
        clientId: GetSpotifyClientID(),
        clientSecret: GetSpotifyClientSecret()
    });

    const credsResponse = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(credsResponse.body['access_token']);

    spotifyUrl = spotifyUrl.replace("https://open.spotify.com/playlist/", "").split("?")[0];
    const response = await spotifyApi.getPlaylistTracks(spotifyUrl);

    let song: Song | undefined;
    let tracks = response.body.items;
    if (shuffle) {
        tracks = ShuffleArray(tracks);
    }
    
    let addedSongs = 0;
    for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i].track;
        
        if (!track) { continue; }
       
        const newSong = await Enqueue(guildId, `${track.name} ${track.artists[0].name}`, user);
        addedSongs++;
        if (!song) {
            song = newSong;
        }
    }

    return {
        song: song,
        totalSongs: tracks.length,
        addedSongs: addedSongs
    };
}


function ShuffleArray<T>(array: T[]): T[] {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
};