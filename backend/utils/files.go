package utils

import (
	"errors"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
	"toast/backend/debug"
)

func GetCurrentExecDir() (currentPath string) {
	folderPath, err := os.Executable()
	if err != nil {
		panic(err)
	}

	return filepath.Dir(folderPath)
}

// Takes a file path and rename the file's basename.
//
//	RenameFileInPath("path/to/old_file.txt", func(oldFilename string) string {
//	  return "new_file"
//	})
//	// returns "path/to/new_file.txt"
//
// Note: It only returns the new, full file path without modifying the file on the filesystem.
func RenameFileInPath(path string, newName func(oldFilename string) string) string {
	baseDir := filepath.Dir(path)
	fileExt := filepath.Ext(path)
	fileName := strings.Replace(filepath.Base(path), fileExt, "", 1)

	newFileName := newName(fileName)
	return filepath.Join(baseDir, newFileName+fileExt)
}

// Returns the current executable path.
// The function will `panic` if it cannot determine the executable's path.
func GetCurrentDir() (currentPath string) {
	folderPath, err := os.Executable()
	if err != nil {
		panic(err)
	}

	return filepath.Dir(folderPath)
}

// Makes a new folder at the given path. It will create all
// intermediate directories in the path if they do not already exist.
func CreateDirectory(path string) (makeDirError error) {
	if debug.IS_ENABLED {
		debug.InfoLabelf("dir", "Create directory: %s", path)
	}

	return os.MkdirAll(path, 0666)
}

// Checks if a file exists at the given path.
func IsFileExist(pathToFile string) (existOrNot bool) {
	_, err := os.Stat(pathToFile)
	if err == nil {
		return true
	}

	if errors.Is(err, fs.ErrNotExist) {
		return false
	}

	return false
}

// Checks if a directory exists at the given path.
func IsDirectoryExist(path string) (existOrNot bool) {
	info, err := os.Stat(path)
	if err == nil {
		return info.IsDir()
	}

	if os.IsNotExist(err) {
		return false
	}

	return false
}

// Writes the given data to a file at the specified path.
// It creates the file if it does not exist and overwrite it if it does.
func WriteFile(pathToFile string, stuff []byte) (writeError error) {
	if debug.IS_ENABLED {
		debug.InfoLabelf("file", "Write file: %s", pathToFile)
	}

	return os.WriteFile(pathToFile, stuff, os.ModePerm)
}
