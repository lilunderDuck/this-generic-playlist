dev_server:
  go build -o dist/main.exe -tags=TOAST_DEBUG,TOAST_DEV_MODE main.go
  dist/main.exe