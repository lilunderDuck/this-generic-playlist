package playlist

import (
	"errors"
	"path/filepath"
	"strconv"
	"toast/backend/core/front2back"
	"toast/backend/db"
	"toast/backend/debug"
	"toast/backend/utils"
)

func RegisterFunctions() {
	dataFolder := filepath.Join(utils.GetCurrentExecDir(), "data/this_generic_playlist")
	playlistsDb := db.New(dataFolder + "/playlists.db")
	// tracksDb := db.New(dataFolder + "/tracks.db")
	front2back.RegisterFnProducer("playlist_getAll", func() ([]PlaylistItemData, error) {
		rawValue := playlistsDb.ValuesAsStringFast()
		data, err := utils.ParseJsonString[[]PlaylistItemData](rawValue)
		if err != nil {
			return nil, err
		}
		return data, nil
	})

	front2back.RegisterFn("playlist_create", func(data *PlaylistItemSchema) (*PlaylistItemData, error) {
		newData := NewPlaylistItemData(data)
		rawData := []byte(utils.StringifyJson(newData))
		err := playlistsDb.Put(newData.Id, rawData)
		if err != nil {
			return nil, nil
		}

		return newData, nil
	})

	front2back.RegisterFn("playlist_resync", func(param *TargetPlaylistParam) (*ResyncedPlaylistData, error) {
		basePath := dataFolder + "/list/" + param.PlaylistId
		tracksData, err := utils.ReadJsonFile[[]TrackData](basePath + "/tracks.json")
		if err != nil {
			return nil, err
		}

		totalRuntime := 0.0
		for trackIndex := range tracksData {
			durationInF64, err := mp3_calculateDuration(basePath + "/track/" + tracksData[trackIndex].AudioFile)
			if err != nil {
				if debug.IS_ENABLED {
					debug.ErrLabel("playlist", err)
				}

				continue
			}
			tracksData[trackIndex].TotalDuration = durationInF64
			totalRuntime += durationInF64
		}

		err = utils.WriteJsonFile(basePath+"/tracks.json", tracksData)
		if err != nil {
			return nil, err
		}

		rawPlaylistData, ok := playlistsDb.GetString(param.PlaylistId)
		if !ok {
			return nil, errors.New("cannot find playlist with id: " + param.PlaylistId)
		}

		playlistData, err := utils.ParseJsonString[PlaylistItemData](rawPlaylistData)
		if err != nil {
			return nil, err
		}

		playlistData.TotalTrack = len(tracksData)
		playlistData.TotalRuntimeInSecond = totalRuntime

		err = playlistsDb.Put(param.PlaylistId, []byte(utils.StringifyJson(playlistData)))
		if err != nil {
			return nil, err
		}

		return &ResyncedPlaylistData{
			Playlist: playlistData,
			Tracks:   tracksData,
		}, nil
	})

	CACHE_DIRECTORY := filepath.Join(utils.GetCurrentDir(), "cache")
	utils.CreateDirectory(CACHE_DIRECTORY)
	tracksDb := db.New(dataFolder + "/tracks/tracks.db")
	authorDb := db.New(dataFolder + "/tracks/authors.db")
	emptyTrackData := []TrackData{}
	front2back.RegisterFn("track_getAll", func(data *TargetPlaylistParam) ([]TrackData, error) {
		cachedTracksDataPath := CACHE_DIRECTORY + "/" + data.PlaylistId + ".json"
		tracksData, err := utils.ReadJsonFile[[]TrackData](cachedTracksDataPath)
		if err == nil {
			return tracksData, nil
		}

		if debug.IS_ENABLED {
			debug.WarnLabelf("tracks", "cached track list not saved for %s, compiling a new one...", data.PlaylistId)
		}

		tracksRefPath := dataFolder + "/list/" + data.PlaylistId + ".json"
		tracksRef, err := utils.ReadJsonFile[[]int](tracksRefPath)
		if err != nil {
			if debug.IS_ENABLED {
				debug.WarnLabelf("playlist", "could not be able to read %s, returned empty tracks data instead", debug.FormatPath(tracksRefPath))
				debug.WarnLabelf("playlist", "%v", err)
			}

			return emptyTrackData, nil
		}

		wholeTracks := make([]TrackData, len(tracksRef))
		for trackIndex, trackId := range tracksRef {
			if debug.IS_ENABLED {
				debug.InfoLabelf("tracks", "compiling track %d", trackId)
			}

			trackData, err := tracksDb.GetJSON[SavedTrackData](strconv.Itoa(trackId))
			if err != nil {
				return emptyTrackData, err
			}

			trackAuthors := []PlaylistAuthorInfo{}
			for i := 0; i < len(trackData.Author); i++ {
				authorData, err := authorDb.GetJSON[PlaylistAuthorInfo](strconv.Itoa(trackData.Author[i]))
				if err != nil {
					if debug.IS_ENABLED {
						debug.WarnLabelf("playlist", "%#v", err)
					}
					continue
				}

				trackAuthors = append(trackAuthors, *authorData)
			}

			wholeTracks[trackIndex] = ToTrackData(trackData, trackAuthors)
		}

		if err := utils.WriteJsonFile(cachedTracksDataPath, wholeTracks); err != nil {
			if debug.IS_ENABLED {
				debug.ErrLabelf("playlist", "error during saving cached tracks data: %#v", err)
			}
			return emptyTrackData, nil
		}

		return wholeTracks, nil
	})
}
