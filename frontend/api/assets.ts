export const ASSETS_SERVER = "http://localhost:34515"
export const PREVIEW_ROUTE = "http://localhost:34515/preview?path="

export function playlistCoverIconUrl(playlistId: string, fileName: string) {
  return `${ASSETS_SERVER}/local-assets/data/toast-playlist/playlists/${playlistId}/icons/${fileName}` as const
}

export function playlistBannerUrl(playlistId: string, fileName: string) {
  return `${ASSETS_SERVER}/local-assets/data/toast-playlist/playlists/${playlistId}/banner/${fileName}` as const
}