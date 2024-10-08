package products

import (
	"fmt"
	"math"
	"mime/multipart"
	"net/http"
	"sync"

	"github.com/go-sql-driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	models "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/models"
	database "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/database"
	filestorage "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/file_storage"
	tools "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/tools"
)

type ProductsRepository struct {
	database *gorm.DB
}

func NewProductsRepository() *ProductsRepository {
	return &ProductsRepository{
		database: database.Instance,
	}
}

func (productsRepository *ProductsRepository) CreateCollection(name string) (status int, result tools.Object) {
	if name == "" {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_COLLECTION_NAME",
		}
	}

	database := productsRepository.database

	collection := models.Collection{Name: name}
	err := database.Create(&collection).Error
	if err != nil {
		if mysqlErr, ok := err.(*mysql.MySQLError); ok && mysqlErr.Number == 1062 {
			return http.StatusBadRequest, tools.Object{
				"error": "COLLECTION_ALREADY_EXISTS",
			}
		}
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"message": "COLLECTION_CREATED",
	}
}

func (productsRepository *ProductsRepository) UpdateCollection(collection models.Collection) (status int, result tools.Object) {
	err := collection.ValidateUpdate()
	if err != nil {
		return http.StatusBadRequest, tools.Object{
			"error": err.Error(),
		}
	}

	database := productsRepository.database

	var existingCollection models.Collection
	err = database.Where("id = ?", collection.ID).First(&existingCollection).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return http.StatusBadRequest, tools.Object{
				"error": "COLLECTION_NOT_FOUND",
			}
		}

		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	existingCollection.Name = collection.Name
	err = database.Save(&existingCollection).Error
	if err != nil {
		if mysqlErr, ok := err.(*mysql.MySQLError); ok && mysqlErr.Number == 1062 {
			return http.StatusBadRequest, tools.Object{
				"error": "COLLECTION_ALREADY_EXISTS",
			}
		}
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"message": "COLLECTION_UPDATED",
	}
}

func (productsRepository *ProductsRepository) DeleteCollection(id uint) (status int, result tools.Object) {
	if id == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_ID",
		}
	}

	database := productsRepository.database

	deleteResult := database.Unscoped().Where("id = ?", id).Delete(&models.Collection{})

	err := deleteResult.Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	if deleteResult.RowsAffected == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "COLLECTION_NOT_FOUND",
		}
	}

	return http.StatusOK, tools.Object{
		"error": "COLLECTION_DELETED",
	}
}

func (productsRepository *ProductsRepository) GetCollections(name string) (status int, result tools.Object) {
	database := productsRepository.database

	var collections []models.Collection
	err := database.Where("name like ?", "%"+name+"%").
		Find(&collections).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"count":       len(collections),
		"collections": collections,
	}
}

func (productsRepository *ProductsRepository) CreateColor(name string) (status int, result tools.Object) {
	if name == "" {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_COLOR_NAME",
		}
	}

	database := productsRepository.database

	color := models.Color{Name: name}
	err := database.Create(&color).Error
	if err != nil {
		if mysqlErr, ok := err.(*mysql.MySQLError); ok && mysqlErr.Number == 1062 {
			return http.StatusBadRequest, tools.Object{
				"error": "COLOR_ALREADY_EXISTS",
			}
		}
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"message": "COLOR_CREATED",
	}
}

func (productsRepository *ProductsRepository) UpdateColor(color models.Color) (status int, result tools.Object) {
	err := color.ValidateUpdate()
	if err != nil {
		return http.StatusBadRequest, tools.Object{
			"error": err.Error(),
		}
	}

	database := productsRepository.database

	var existingColor models.Color
	err = database.Where("id = ?", color.ID).First(&existingColor).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return http.StatusBadRequest, tools.Object{
				"error": "COLOR_NOT_FOUND",
			}
		}

		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	existingColor.Name = color.Name
	err = database.Save(&existingColor).Error
	if err != nil {
		if mysqlErr, ok := err.(*mysql.MySQLError); ok && mysqlErr.Number == 1062 {
			return http.StatusBadRequest, tools.Object{
				"error": "COLOR_ALREADY_EXISTS",
			}
		}
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"message": "COLOR_UPDATED",
	}
}

func (productsRepository *ProductsRepository) DeleteColor(id uint) (status int, result tools.Object) {
	if id == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_ID",
		}
	}

	database := productsRepository.database

	deleteResult := database.Unscoped().Where("id = ?", id).Delete(&models.Color{})

	err := deleteResult.Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	if deleteResult.RowsAffected == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "COLOR_NOT_FOUND",
		}
	}

	return http.StatusOK, tools.Object{
		"error": "COLOR_DELETED",
	}
}

func (productsRepository *ProductsRepository) GetColors() (status int, result tools.Object) {
	database := productsRepository.database

	var colors []models.Color
	err := database.Find(&colors).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"count":  len(colors),
		"colors": colors,
	}
}

func (productsRepository *ProductsRepository) CreateTaille(name string) (status int, result tools.Object) {
	if name == "" {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_TAILLE_NAME",
		}
	}

	database := productsRepository.database

	taille := models.Taille{Name: name}
	err := database.Create(&taille).Error
	if err != nil {
		if mysqlErr, ok := err.(*mysql.MySQLError); ok && mysqlErr.Number == 1062 {
			return http.StatusBadRequest, tools.Object{
				"error": "TAILLE_ALREADY_EXISTS",
			}
		}
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"message": "TAILLE_CREATED",
	}
}

func (productsRepository *ProductsRepository) UpdateTaille(taille models.Taille) (status int, result tools.Object) {
	err := taille.ValidateUpdate()
	if err != nil {
		return http.StatusBadRequest, tools.Object{
			"error": err.Error(),
		}
	}

	database := productsRepository.database

	var existingTaille models.Taille
	err = database.Where("id = ?", taille.ID).First(&existingTaille).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return http.StatusBadRequest, tools.Object{
				"error": "TAILLE_NOT_FOUND",
			}
		}

		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	existingTaille.Name = taille.Name
	err = database.Save(&existingTaille).Error
	if err != nil {
		if mysqlErr, ok := err.(*mysql.MySQLError); ok && mysqlErr.Number == 1062 {
			return http.StatusBadRequest, tools.Object{
				"error": "TAILLE_ALREADY_EXISTS",
			}
		}
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"message": "TAILLE_UPDATED",
	}
}

func (productsRepository *ProductsRepository) DeleteTaille(id uint) (status int, result tools.Object) {
	if id == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_ID",
		}
	}

	database := productsRepository.database

	deleteResult := database.Unscoped().Where("id = ?", id).Delete(&models.Taille{})

	err := deleteResult.Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	if deleteResult.RowsAffected == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "TAILLE_NOT_FOUND",
		}
	}

	return http.StatusOK, tools.Object{
		"error": "TAILLE_DELETED",
	}
}

func (productsRepository *ProductsRepository) GetTailles() (status int, result tools.Object) {
	database := productsRepository.database

	var tailles []models.Taille
	err := database.Find(&tailles).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"count":   len(tailles),
		"tailles": tailles,
	}
}

func (productsRepository *ProductsRepository) CreateItem(item models.Item) (status int, result tools.Object) {
	err := item.ValidateCreate()
	if err != nil {
		return http.StatusBadRequest, tools.Object{
			"error": err.Error(),
		}
	}

	database := productsRepository.database
	var similarItem models.Item
	err = database.Where("name = ?", item.Name).First(&similarItem).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	if err == nil {
		return http.StatusBadRequest, tools.Object{
			"error": "ITEM_ALREADY_EXISTS",
		}
	}

	var wg sync.WaitGroup

	wg.Add(3)

	go func() {
		defer wg.Done()
		productsRepository.getValidCollections(&item.Collections)
	}()

	go func() {
		defer wg.Done()
		productsRepository.getValidColors(&item.Colors)
	}()

	go func() {
		defer wg.Done()
		productsRepository.getValidTailles(&item.Tailles)
	}()

	wg.Wait()

	// // Upload images concurrently:
	// var mutex sync.Mutex
	// wg.Add(len(images))
	// errs := make(chan error, len(images))
	// itemImages := []models.ItemImage{}
	// for _, image := range images {
	// 	go func() {
	// 		defer wg.Done()
	// 		response, err := filestorage.UploadFile(image, item.Name, "/images/items")
	// 		if err != nil {
	// 			errs <- err
	// 			return
	// 		}
	// 		itemImage := models.ItemImage{
	// 			URL:        response.Url,
	// 			ImageKitID: response.FileId,
	// 		}
	// 		mutex.Lock()
	// 		itemImages = append(itemImages, itemImage)
	// 		mutex.Unlock()
	// 	}()
	// }
	// wg.Wait()
	// close(errs)

	// var errors []string
	// for i := 0; i < len(errs); i++ {
	// 	err := <-errs
	// 	errors = append(errors, err.Error())
	// }

	// if len(errors) > 0 {
	// 	return http.StatusInternalServerError, tools.Object{
	// 		"error":   "INTERNAL_SERVER_ERROR",
	// 		"message": errors,
	// 	}
	// }

	// item.Images = itemImages
	err = database.Create(&item).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"message": "ITEM_CREATED",
	}
}

func (productsRepository *ProductsRepository) UpdateItem(item models.Item) (status int, result tools.Object) {
	if item.ID == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_ID",
		}
	}

	database := productsRepository.database

	var existingItem models.Item
	err := database.Where("id = ?", item.ID).
		Preload("Colors", "Tailles", "Collections").
		First(&existingItem).
		Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return http.StatusBadRequest, tools.Object{
				"error": "ITEM_NOT_FOUND",
			}
		}

		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	if item.Name != "" {
		existingItem.Name = item.Name
	}

	if item.Description != "" {
		existingItem.Description = item.Description
	}

	if item.Price != 0 {
		existingItem.Price = item.Price
	}

	if item.SKU != "" {
		existingItem.SKU = item.SKU
	}

	if item.Currency != "" {
		existingItem.Currency = item.Currency
	}

	if item.Images != nil {
		existingItem.Images = item.Images
	}

	if item.Sold != 0 {
		existingItem.Sold = item.Sold
	}

	if item.Stock != 0 {
		existingItem.Stock = item.Stock
	}

	var wg sync.WaitGroup

	wg.Add(3)

	go func() {
		defer wg.Done()
		if item.Collections != nil {
			productsRepository.getValidCollections(&item.Collections)
		}
	}()

	go func() {
		defer wg.Done()
		if item.Colors != nil {
			productsRepository.getValidColors(&item.Colors)
		}
	}()

	go func() {
		defer wg.Done()
		if item.Tailles != nil {
			productsRepository.getValidTailles(&item.Tailles)
		}
	}()

	wg.Wait()

	err = database.Save(&existingItem).Error
	if err != nil {
		if mysqlErr, ok := err.(*mysql.MySQLError); ok && mysqlErr.Number == 1062 {
			return http.StatusBadRequest, tools.Object{
				"error": "ITEM_ALREADY_EXISTS",
			}
		}
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"message": "ITEM_UPDATED",
	}
}

func (productsRepository *ProductsRepository) GetItems(pageSize uint, page uint, appendWith string, orderBy string, desc bool, collectionID uint, colorID uint, tailleID uint, name string) (status int, result tools.Object) {
	database := productsRepository.database

	if pageSize == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_PAGE_SIZE",
		}
	}

	var totalRecords int64
	database.Model(&models.Item{}).Count(&totalRecords)
	totalPages := int(math.Ceil(float64(totalRecords) / float64(pageSize)))

	if page < 1 || page > uint(totalPages) {
		return http.StatusBadRequest, tools.Object{
			"error": "INVALID_PAGE",
		}
	}

	validExtentions := tools.GetValidExtentions(appendWith, "collections", "colors", "tailles")
	validFilters := tools.GetValidFilters(orderBy, "name", "price", "stock", "rate", "creation_time")

	offset := (page - 1) * pageSize

	query := database.Model(&models.Item{})

	if collectionID != 0 {
		query.Joins("JOIN item_collections ON item_collections.item_id = items.id").
			Where("item_collections.collection_id = ?", collectionID)
	}

	if colorID != 0 {
		query.Joins("JOIN item_colors ON item_colors.item_id = items.id").
			Where("item_colors.color_id = ?", colorID)
	}

	if tailleID != 0 {
		query.Joins("JOIN item_tailles ON item_tailles.item_id = items.id").
			Where("item_tailles.taille_id = ?", tailleID)
	}

	query.Where("name like ?", "%"+name+"%")

	var items []models.Item
	query.Limit(int(pageSize)).Offset(int(offset))

	for _, extention := range validExtentions {
		query.Preload(extention)
	}
	query.Preload("Images")

	for _, filter := range validFilters {
		query.Order(clause.OrderByColumn{
			Column: clause.Column{Name: filter},
			Desc:   desc,
		})
	}

	err := query.Find(&items).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"count":       len(items),
		"page":        page,
		"page_size":   pageSize,
		"total_pages": totalPages,
		"items":       items,
	}
}

func (productsRepository *ProductsRepository) GetItem(id uint, appendWith string) (status int, result tools.Object) {
	if id == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_ID",
		}
	}

	validExtentions := tools.GetValidExtentions(appendWith, "collections", "colors", "tailles")
	database := productsRepository.database

	var item models.Item
	query := database.Where("id = ?", id)

	for _, extention := range validExtentions {
		query.Preload(extention)
	}
	query.Preload("Images")

	err := query.First(&item).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return http.StatusNotFound, tools.Object{
				"error": "ITEM_NOT_FOUND",
			}
		}
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"item": item,
	}
}

func (productsRepository *ProductsRepository) DeleteItem(id uint) (status int, result tools.Object) {
	if id == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_ID",
		}
	}

	database := productsRepository.database

	var item models.Item
	err := database.Where("id = ?", id).
		Preload("Images").
		First(&item).
		Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return http.StatusNotFound, tools.Object{
				"error": "ITEM_NOT_FOUND",
			}
		}
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	err = database.Unscoped().Where("id = ?", id).Delete(&item).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"error": "ITEM_DELETED",
	}
}

func (productsRepository *ProductsRepository) CreateItemImages(id uint, images []multipart.File) (status int, result tools.Object) {
	if id == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "ID_INDEFINED",
		}
	}
	if images == nil {
		return http.StatusBadRequest, tools.Object{
			"error": "IMAGES_INDEFINED",
		}
	}

	database := productsRepository.database

	var item models.Item
	err := database.Where("id = ?", id).First(&item).Error
	if err != nil {
		if err != gorm.ErrRecordNotFound {
			return http.StatusBadRequest, tools.Object{
				"error": "ITEM_NOT_FOUND",
			}
		}
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	// Upload images concurrently:
	var wg sync.WaitGroup
	var mutex sync.Mutex

	wg.Add(len(images))
	errs := make(chan error)
	itemImages := []models.ItemImage{}
	for _, image := range images {
		go func() {
			defer wg.Done()
			response, err := filestorage.UploadFile(image, item.Name, "/images/items")
			if err != nil {
				errs <- err
				return
			}

			itemImage := models.ItemImage{
				ItemID:     item.ID,
				URL:        response.Url,
				ImageKitID: response.FileId,
			}
			err = database.Create(&itemImage).Error
			if err != nil {
				errs <- err
				return
			}

			mutex.Lock()
			itemImages = append(itemImages, itemImage)
			mutex.Unlock()
		}()
	}
	wg.Wait()
	close(errs)

	var errors []string
	for i := 0; i < len(errs); i++ {
		err := <-errs
		errors = append(errors, err.Error())
	}

	return http.StatusOK, tools.Object{
		"message": "IMAGES_ADDED",
		"errors":  errors,
	}
}

func (productsRepository *ProductsRepository) DeleteItemImages(images []models.ItemImage) (status int, result tools.Object) {
	if len(images) == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "IMAGES_INDEFINED",
		}
	}

	database := productsRepository.database

	var imagesToDelete []models.ItemImage
	var fetchErrors []string
	var wg sync.WaitGroup
	fetchErrorsChan := make(chan string, len(images))
	imageChan := make(chan models.ItemImage, len(images))

	wg.Add(len(images))
	for _, image := range images {
		go func() {
			defer wg.Done()
			var img models.ItemImage
			err := database.First(&img, image.ID).Error
			if err != nil {
				fetchErrorsChan <- err.Error()
				return
			}
			imageChan <- img
		}()
	}
	wg.Wait()
	close(fetchErrorsChan)
	close(imageChan)

	for errMsg := range fetchErrorsChan {
		fetchErrors = append(fetchErrors, errMsg)
	}

	for img := range imageChan {
		imagesToDelete = append(imagesToDelete, img)
	}

	if len(fetchErrors) > 0 {
		return http.StatusInternalServerError, tools.Object{
			"error":   "FETCH_IMAGES_ERROR",
			"message": fetchErrors,
		}
	}

	var deleteErrors []string
	deleteErrorsChan := make(chan string, len(imagesToDelete))
	wg.Add(len(imagesToDelete))

	for _, image := range imagesToDelete {
		fmt.Println("Deleting image ID:", image.ID)

		go func() {
			defer wg.Done()

			err := database.Unscoped().Delete(&image, image.ID).Error
			if err != nil {
				deleteErrorsChan <- err.Error()
				return
			}
		}()
	}

	wg.Wait()
	close(deleteErrorsChan)

	for errMsg := range deleteErrorsChan {
		deleteErrors = append(deleteErrors, errMsg)
	}

	if len(deleteErrors) > 0 {
		return http.StatusInternalServerError, tools.Object{
			"error":   "DELETE_IMAGES_ERROR",
			"message": deleteErrors,
		}
	}

	return http.StatusOK, tools.Object{
		"message": "IMAGES_DELETED",
	}
}


func (productsRepository ProductsRepository) getValidCollections(InvalidCollections *[]models.Collection) {
	database := productsRepository.database
	collections := *InvalidCollections
	if len(collections) != 0 {
		var wg sync.WaitGroup
		var mutex sync.Mutex
		validCollections := make([]models.Collection, 0, len(collections))
		wg.Add(len(collections))
		for _, collection := range collections {
			go func() {
				defer wg.Done()
				err := database.Where("id = ?", collection.ID).First(&models.Collection{}).Error
				if err == nil {
					mutex.Lock()
					validCollections = append(validCollections, collection)
					mutex.Unlock()
				}
			}()
		}
		wg.Wait()
		*InvalidCollections = validCollections
	}
}

func (productsRepository ProductsRepository) getValidColors(InvalidColors *[]models.Color) {
	database := productsRepository.database
	colors := *InvalidColors
	if len(colors) != 0 {
		var wg sync.WaitGroup
		var mutex sync.Mutex
		validColors := make([]models.Color, 0, len(colors))
		wg.Add(len(colors))
		for _, color := range colors {
			go func() {
				defer wg.Done()
				err := database.Where("id = ?", color.ID).First(&models.Color{}).Error
				if err == nil {
					mutex.Lock()
					validColors = append(validColors, color)
					mutex.Unlock()
				}
			}()
		}
		wg.Wait()
		*InvalidColors = validColors
	}
}

func (productsRepository ProductsRepository) getValidTailles(InvalidTailles *[]models.Taille) {
	database := productsRepository.database
	tailles := *InvalidTailles
	if len(tailles) != 0 {
		var wg sync.WaitGroup
		var mutex sync.Mutex
		validTailles := make([]models.Taille, 0, len(tailles))
		wg.Add(len(tailles))
		for _, taille := range tailles {
			go func() {
				defer wg.Done()
				err := database.Where("id = ?", taille.ID).First(&models.Taille{}).Error
				if err == nil {
					mutex.Lock()
					validTailles = append(validTailles, taille)
					mutex.Unlock()
				}
			}()
		}
		wg.Wait()
		*InvalidTailles = validTailles
	}
}
