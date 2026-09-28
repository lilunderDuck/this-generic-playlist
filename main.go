package main

import (
	"fmt"
	"toast/backend/core"
)

func main() {
	server := core.CreateServer(":8000")
	core.RegisterFnAction("hello_world", func() error {
		fmt.Println("hello world")
		return nil
	})

	assetsServer := core.NewAssetsServer("toast-playlist")
	assetsServer.MustOpen()

	core.StartServer(server)
	assetsServer.Close()
}
