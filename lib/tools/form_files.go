package tools

import (
	"mime/multipart"
	"net/http"
)

func FormFiles(r *http.Request, key string) (formFiles []multipart.File) {
	filesHeaders := r.MultipartForm.File[key]
	var files []multipart.File
	for _, fileHeader := range filesHeaders {
		file, _ := fileHeader.Open()
		defer file.Close()
		files = append(files, file)
	}
	return files
}