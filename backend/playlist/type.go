package playlist

import "time"

type PlaylistItemSchema struct {
	Name           string               `json:"name"                    validate:"required"`
	Author         []PlaylistAuthorInfo `json:"author,omitempty"`
	CoverIconImage string               `json:"coverIconImage"`
	BannerImages   []string             `json:"bannerImages,omitempty"`
	Description    string               `json:"description,omitempty"`
}

type PlaylistItemData struct {
	*PlaylistItemSchema
	Id                   string  `json:"id"`
	TotalTrack           int     `json:"totalTrack"`
	TotalRuntimeInSecond float64 `json:"totalRuntimeInSecond"`
	CreatedAt            int64   `json:"createdAt"`
}

type PlaylistAuthorInfo struct {
	Name string `json:"name"`
	Url  string `json:"url,omitempty"`
}

type ResyncedPlaylistData struct {
	Playlist PlaylistItemData `json:"playlist"`
	Tracks   []TrackData      `json:"tracks"`
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

type TargetPlaylistParam struct {
	PlaylistId string `json:"playlistId" validate:"required"`
}

type BaseTrackData struct {
	Name           string  `json:"name"`
	Id             int     `json:"id"`
	CoverIconImage string  `json:"coverIconImage"`
	TotalDuration  float64 `json:"totalDuration"`
	AudioFile      string  `json:"audioFile"`
}

type SavedTrackData struct {
	BaseTrackData
	Author []int `json:"author,omitempty"`
}

type TrackData struct {
	BaseTrackData
	Author []PlaylistAuthorInfo `json:"author,omitempty"`
}

func ToTrackData(this *SavedTrackData, trackAuthors []PlaylistAuthorInfo) TrackData {
	return TrackData{
		BaseTrackData: this.BaseTrackData,
		Author:        trackAuthors,
	}
}
