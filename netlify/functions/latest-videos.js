// Netlify Function: fetches the latest uploads for a YouTube channel
// using the official YouTube Data API v3, server-side (no CORS issues).
//
// Reads the API key from the YOUTUBE_API_KEY environment variable
// (set in Netlify: Project configuration -> Environment variables).

const HANDLE = "FlaviusEnavius";
const FETCH_TIMEOUT_MS = 5000;

// fetch() has no built-in timeout - without this, a YouTube API call that
// merely hangs (not errors) blocks the function until Netlify's own
// execution limit instead of degrading to the fallback UI quickly.
function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

exports.handler = async function () {
  const API_KEY = process.env.YOUTUBE_API_KEY;

  if (!API_KEY) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videos: [], error: "missing_api_key" }),
    };
  }

  try {
    const channelUrl =
      `https://www.googleapis.com/youtube/v3/channels` +
      `?part=contentDetails&forHandle=${HANDLE}&key=${API_KEY}`;
    const channelRes = await fetchWithTimeout(channelUrl);
    const channelData = await channelRes.json();

    const uploadsPlaylistId =
      channelData.items &&
      channelData.items[0] &&
      channelData.items[0].contentDetails &&
      channelData.items[0].contentDetails.relatedPlaylists &&
      channelData.items[0].contentDetails.relatedPlaylists.uploads;

    if (!uploadsPlaylistId) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videos: [], error: "channel_not_found" }),
      };
    }

    const itemsUrl =
      `https://www.googleapis.com/youtube/v3/playlistItems` +
      `?part=snippet&maxResults=5&playlistId=${uploadsPlaylistId}&key=${API_KEY}`;
    const itemsRes = await fetchWithTimeout(itemsUrl);
    const itemsData = await itemsRes.json();

    const videos = (itemsData.items || [])
      .map((item) => ({
        id: item.snippet && item.snippet.resourceId && item.snippet.resourceId.videoId,
        title: item.snippet && item.snippet.title,
      }))
      .filter((v) => v.id);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=1800",
      },
      body: JSON.stringify({ videos }),
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videos: [], error: "fetch_failed" }),
    };
  }
};
