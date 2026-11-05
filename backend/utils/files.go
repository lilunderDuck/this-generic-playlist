package utils

import (
	"os"
	"path/filepath"
)

func GetCurrentExecDir() (currentPath string) {
	folderPath, err := os.Executable()
	if err != nil {
		panic(err)
	}

	return filepath.Dir(folderPath)
}
