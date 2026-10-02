package main

import (
	"embed"
	"toast/backend/core"
	"toast/backend/playlist"
)

//go:embed dist/app/index.html dist/app/assets/*
var appAssets embed.FS

func main() {
	server := core.CreateServer(":8000")
	playlist.RegisterFunctions()

	app := core.NewApp("toast-playlist")
	app.Init(appAssets, "dist/app", "http://localhost:8000")

	core.StartServer(server)
}
