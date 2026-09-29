package playlist

import "time"

type PlaylistItemSchema struct {
	Name           string             `json:"name"                    validate:"required"`
	Author         PlaylistAuthorInfo `json:"author,omitempty"`
	CoverIconImage string             `json:"coverIconImage"`
	BannerImages   []string           `json:"bannerImages,omitempty"`
	Description    string             `json:"description,omitempty"`
}

type PlaylistItemData struct {
	*PlaylistItemSchema
	Id                   string `json:"id"`
	TotalTrack           int    `json:"totalTrack"`
	TotalRuntimeInSecond int    `json:"totalRuntimeInSecond"`
	CreatedAt            int64  `json:"createdAt"`
}

type PlaylistAuthorInfo struct {
	Name string `json:"name"`
	Url  string `json:"url,omitempty"`
}

func NewPlaylistItemData(data *PlaylistItemSchema) *PlaylistItemData {
	return &PlaylistItemData{
		PlaylistItemSchema:   data,
		Id:                   TruncateAndProcessPlaylistName(data.Name),
		TotalTrack:           0,
		TotalRuntimeInSecond: 0,
		CreatedAt:            time.Now().UnixMilli(),
	}
}
