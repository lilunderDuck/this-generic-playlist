EXECUTABLE_NAME:="this_generic_playlist"

install_goversioninfo:
  go install github.com/josephspurrier/goversioninfo/cmd/goversioninfo@latest

gen_required_exe_stuff:
  go generate

dev_server: gen_required_exe_stuff
  go build -o dist/{{EXECUTABLE_NAME}}_dev.exe -tags=TOAST_DEBUG,TOAST_DEV_MODE main.go
  dist/{{EXECUTABLE_NAME}}_dev.exe

build_debug_frontend_preview:
  bunx vite build --mode prod_debug
  bunx vite preview

[parallel]
preview_debug: build_debug_frontend_preview dev_server

build: gen_required_exe_stuff
  bun run build
  go build -ldflags="-H=windowsgui" -o dist/{{EXECUTABLE_NAME}}.exe main.go

build_debug: gen_required_exe_stuff
  bun run build
  go build -o dist/{{EXECUTABLE_NAME}}.exe -tags=TOAST_DEBUG main.go