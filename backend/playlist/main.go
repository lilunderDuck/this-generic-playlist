package playlist

import (
	"path/filepath"
	"toast/backend/core"
	"toast/backend/db"
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

	emptyTrackData := []TrackData{}
	core.RegisterFn("track_getAll", func(data *GetAllTrackDataParam) ([]TrackData, error) {
		tracksData, err := utils.ReadJsonFile[[]TrackData](dataFolder + "/playlists/" + data.PlaylistId + "/" + "tracks.json")
		if err != nil {
			return emptyTrackData, err
		}

		return tracksData, nil
	})
}
