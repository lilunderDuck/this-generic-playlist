package playlist

import (
	"time"
	"toast/backend/core"
)

type PlaylistItemSchema struct {
	Name           string             `json:"name"`
	Author         PlaylistAuthorInfo `json:"author,omitempty"`
	CoverIconImage string             `json:"coverIconImage"`
	BannerImages   []string           `json:"bannerImages,omitempty"`
	Description    string             `json:"description,omitempty"`
}

type PlaylistItemData struct {
	PlaylistItemSchema
	Id                   string        `json:"id"`
	TotalTrack           int           `json:"totalTrack"`
	TotalRuntimeInSecond int           `json:"totalRuntimeInSecond"`
	CreatedAt            time.Duration `json:"createdAt"`
}

type PlaylistAuthorInfo struct {
	Name string `json:"name"`
	Url  string `json:"url,omitempty"`
}

func RegisterFunctions() {
	core.RegisterFn("playlist_create", func(data *PlaylistItemSchema) (*PlaylistItemData, error) {
		return nil, nil
	})
	// core.RegisterFn("playlist_add", )
}
