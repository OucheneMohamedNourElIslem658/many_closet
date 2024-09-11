package filestorage

import (
	"context"
	"fmt"
	"log"
	"mime/multipart"

	"github.com/imagekit-developer/imagekit-go"
	"github.com/imagekit-developer/imagekit-go/api/uploader"
)

var Instance *imagekit.ImageKit

func Init() {
	Instance = imagekit.NewFromParams(imagekit.NewParams{
		PrivateKey: envs.privateKey,
		PublicKey: envs.publicKey,
		UrlEndpoint: envs.endpointURL,
	})
	
	if Instance == nil {
		log.Fatal("File Storage failed to connect!")
	}

	fmt.Println("File storage connected succesfully!")
}

func UploadFile(file multipart.File, name string, folder string) (data *uploader.UploadResult, err error) {
	response, err := Instance.Uploader.Upload(
		context.Background(),
		file,
		uploader.UploadParam{
			FileName: name,
			Folder: folder,
		},
	)
	if err != nil {
		return nil, err
	}
	return &response.Data, err
}

func DeleteFile(id string) error {
	_, err := Instance.Media.DeleteFile(context.Background(), id)
	return err
}