package playlist

import (
	"errors"
	"path/filepath"
	"toast/backend/core"
	"toast/backend/db"
	"toast/backend/debug"
	"toast/backend/utils"
)

func RegisterFunctions() {
	dataFolder := filepath.Join(core.GetCurrentExecDir(), "data/toast-playlist")
	playlistsDb := db.New(dataFolder + "/playlists.db")
	// tracksDb := db.New(dataFolder + "/tracks.db")
	core.RegisterFnProducer("playlist_getAll", func() ([]PlaylistItemData, error) {
		rawValue := playlistsDb.ValuesAsStringFast()
		data, err := utils.ParseJsonString[[]PlaylistItemData](rawValue)
		if err != nil {
			return nil, err
		}
		return data, nil
	})

	core.RegisterFn("playlist_create", func(data *PlaylistItemSchema) (*PlaylistItemData, error) {
		newData := NewPlaylistItemData(data)
		rawData := []byte(utils.StringifyJson(newData))
		err := playlistsDb.Put(newData.Id, rawData)
		if err != nil {
			return nil, nil
		}

		return newData, nil
	})

	core.RegisterFn("playlist_resync", func(param *TargetPlaylistParam) (*ResyncedPlaylistData, error) {
		basePath := dataFolder + "/playlists/" + param.PlaylistId
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

	emptyTrackData := []TrackData{}
	core.RegisterFn("track_getAll", func(data *TargetPlaylistParam) ([]TrackData, error) {
		tracksData, err := utils.ReadJsonFile[[]TrackData](dataFolder + "/playlists/" + data.PlaylistId + "/" + "tracks.json")
		if err != nil {
			return emptyTrackData, err
		}

		return tracksData, nil
	})
}
