EXECUTABLE_NAME:="this_generic_playlist"

dev_server: 
  go build -o dist/{{EXECUTABLE_NAME}}_dev.exe -tags=TOAST_DEBUG,TOAST_DEV_MODE main.go
  dist/{{EXECUTABLE_NAME}}_dev.exe

build_debug_frontend_preview:
  bunx vite build --mode prod_debug
  bunx vite preview

[parallel]
preview_debug: build_debug_frontend_preview dev_server

build: 
  bun run build
  go build -ldflags="-H=windowsgui" -o dist/{{EXECUTABLE_NAME}}.exe main.go

build_debug: 
  bun run build
  go build -o dist/{{EXECUTABLE_NAME}}.exe -tags=TOAST_DEBUG main.go