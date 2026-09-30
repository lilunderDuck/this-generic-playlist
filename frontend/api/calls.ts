import { registerPlain, registerProducer } from "./helper"

export interface IAuthorData {
  name: string
  url?: string
}

export interface IPlaylistItemSchema {
  name: string
  author?: IAuthorData[]
  coverIconImage?: string
  bannerImages?: string[]
  description?: string
}

export interface IPlaylistItemData extends IPlaylistItemSchema {
  id: string
  totalTrack: number
  totalRuntimeInSecond: number
  createdAt: number
}

export interface ITrackData {
  id: string
  name: string
  author?: IAuthorData[]
  coverIconImage?: string
  totalDuration: number
  audioFile: string
}

/**This contains all function to call to backend */
export const CODEC = {
  playlist_getAll$: registerProducer<IPlaylistItemData[]>("playlist_getAll"),
  playlist_create$: registerPlain<IPlaylistItemSchema, IPlaylistItemData>("playlist_create"),
  playlist_resync$: registerPlain<{
    playlistId: string
  }, {
    playlist: IPlaylistItemData
    tracks: ITrackData[]
  }>('playlist_resync'),
  track_getAll$: registerPlain<{
    playlistId: string
  }, ITrackData[]>('track_getAll')
  // playlist_create$: registerFn<IPlaylistItemSchema, IPlaylistItemData>('playlist_create', 'no-in-no-out')
}