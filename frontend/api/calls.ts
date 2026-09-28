export interface IAuthorData {
  name: string
  url?: string
}

export interface IPlaylistItemSchema {
  name: string
  author?: IAuthorData
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

export const CODEC = {
  playlist_create$: registerFn<IPlaylistItemSchema, IPlaylistItemData, 'no-in-no-out'>('playlist_create', 'no-in-no-out')
}

type Mode = 'in-out' | 'in-no-out' | 'no-in-out' | 'no-in-no-out'
async function registerFn<In, Out, ChosenMode extends Mode>(name: string, mode: ChosenMode) {
  const ROUTE = `http://localhost:8000/teleporter/${name}`
  if (['in-out', 'in-no-out'].includes(mode)) {
    return async(incomingData: In) => {
      const fetchOption: RequestInit = {
        method: "POST",
        body: JSON.stringify(incomingData)        
      }
  
      const fetchResult = await fetch(ROUTE, fetchOption)
      if (mode !== 'in-no-out') {
        return
      }

      return await fetchResult.json() as Out
    }
  }

  return async() => {
    const fetchOption: RequestInit = {
      method: "POST",
    }

    const fetchResult = await fetch(ROUTE, fetchOption)
    if (mode !== 'no-in-out') {
      return
    }

    return await fetchResult.json() as Out
  }
}