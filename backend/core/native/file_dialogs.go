package native

import (
	"toast/backend/core/front2back"
	"toast/backend/debug"

	"github.com/ncruces/zenity"
)

type OpenFileDialogParam struct {
	Title  string                `json:"title"`
	Filter []OpenFileDialogParam `json:"filter"`
}

type OpenDialogFilterOptions struct {
	Name     string   `json:"name"`
	Patterns []string `json:"patterns"`
}

func RegisterNativeDialogPickerCalls(windowHandle uintptr) {
	front2back.RegisterFn("openFileDialog", func(data *OpenFileDialogParam) (string, error) {
		filePath, err := zenity.SelectFile(
			zenity.Title(data.Title),
			zenity.FileFilters{
				{Name: "Text Files", Patterns: []string{"*.txt", "*.md"}},
				{Name: "Images", Patterns: []string{"*.jpg", "*.png", "*.gif"}},
			},
			zenity.Attach(windowHandle),
		)

		if err != nil {
			if err == zenity.ErrCanceled {
				if debug.IS_ENABLED {
					debug.WarnLabel("native", "user cancel the file dialog")
				}

				return "", nil
			}

			return "", err
		}

		return filePath, nil
	})
}
