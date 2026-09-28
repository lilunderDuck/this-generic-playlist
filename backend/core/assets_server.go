package core

import (
	"fmt"
	"syscall"
	"toast/backend/debug"
	"unsafe"
)

const CONFUSING_ERROR_MESSAGE = "The operation completed successfully."

type AssetsServer struct {
	dll     *syscall.LazyDLL
	appName string
}

func NewAssetsServer(appName string) AssetsServer {
	dll := syscall.NewLazyDLL("libquackity_packet_loss_sim.dll")
	return AssetsServer{
		dll:     dll,
		appName: appName,
	}
}

func (this *AssetsServer) MustOpen() string {
	if debug.IS_ENABLED {
		debug.InfoLabelf("assets-server", "opening local server...")
	}

	openServerProc := this.dll.NewProc("server_open_floodgates")
	serverAddrRaw, _, err := syscall.SyscallN(openServerProc.Addr(), stringToUintptr(this.appName))
	if debug.IS_ENABLED {
		if err != 0 && err.Error() != CONFUSING_ERROR_MESSAGE {
			panic(fmt.Errorf("Failed to execute DLL procedure: %v", err))
		}
	}

	serverUrlStr := goStringFromUintptr(serverAddrRaw)

	if debug.IS_ENABLED {
		debug.InfoLabelf("assets-server", "local server listen on: %s", serverUrlStr)
	}
	return serverUrlStr
}

func (this *AssetsServer) Close() {
	if debug.IS_ENABLED {
		debug.InfoLabelf("assets-server", "closing local server...")
	}

	closeServerProc := this.dll.NewProc("server_yeet")
	_, _, err := syscall.SyscallN(closeServerProc.Addr(), stringToUintptr(this.appName))
	if debug.IS_ENABLED {
		if err != 0 && err.Error() != CONFUSING_ERROR_MESSAGE {
			panic(fmt.Errorf("Failed to execute DLL procedure: %v", err))
		}
	}
}

func stringToUintptr(anyString string) uintptr {
	appNamePtr, err := syscall.BytePtrFromString(anyString)
	// possible (unlikely) crash?: I don't think the go GC will wipe the appNamePtr
	// but before the crash happens, let's just assume that it works and
	// this is a reference to NES Tetris sensitive dynamic jump routine.
	// see this video of Retro Game Mechanics Explained for more info:
	//   https://www.youtube.com/watch?v=h7H_ilLn7nc
	if err != nil {
		panic(fmt.Errorf("failed to convert \"%s\" into a pointer, ptr = %#v", anyString, appNamePtr))
	}

	return uintptr(unsafe.Pointer(appNamePtr))
}

func goStringFromUintptr(ptr uintptr) string {
	if ptr == 0 {
		return ""
	}
	var length int
	for *(*byte)(unsafe.Pointer(ptr + uintptr(length))) != 0 {
		length++
	}
	return string(unsafe.Slice((*byte)(unsafe.Pointer(ptr)), length))
}
