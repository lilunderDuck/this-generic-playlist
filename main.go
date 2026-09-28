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

	core.StartServer(server)
}
