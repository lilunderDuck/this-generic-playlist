package main

import (
	"embed"
	"toast/backend/core"
	"toast/backend/playlist"
)

//go:generate goversioninfo -icon=./this/toast.ico -manifest=./this/app.manifest -skip-versioninfo=true

//go:embed dist/app/index.html dist/app/assets/*
var appAssets embed.FS

func main() {
	app := core.NewApp("playlist")
	app.Init(appAssets, "dist/app", "http://localhost:8000")

	playlist.RegisterFunctions()

	app.Start(":8000")
}
