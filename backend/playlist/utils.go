package playlist

import (
	"fmt"
	"strings"
	"toast/backend/utils"
	"unicode"
)

func TruncateAndProcessPlaylistName(name string) string {
	name = strings.Map(replaceSpecialChar, strings.ToLower(name))
	return fmt.Sprintf("%.25s_%d", name, utils.GetRandomIntWithinLength(6))
}

func replaceSpecialChar(r rune) rune {
	if unicode.IsLetter(r) || unicode.IsDigit(r) {
		return r
	}

	return '_'
}
