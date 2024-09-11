package products

import (
	"encoding/json"
	"fmt"
	"mime/multipart"
	"net/http"
	"strconv"

	productsRepositories "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/products/repositories"
	models "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/models"
)

type ProductsController struct {
	productsRepository *productsRepositories.ProductsRepository
}

func NewproductsController() *ProductsController {
	return &ProductsController{
		productsRepository: productsRepositories.NewProductsRepository(),
	}
}

func (productsController *ProductsController) GetCollections(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Query().Get("name")

	productsRepositorie := productsController.productsRepository
	status, result := productsRepositorie.GetCollections(name)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (productsController *ProductsController) CreateCollection(w http.ResponseWriter, r *http.Request) {
	var collection models.Collection
	json.NewDecoder(r.Body).Decode(&collection)

	productsRepositorie := productsController.productsRepository
	status, result := productsRepositorie.CreateCollection(collection.Name)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (productsController *ProductsController) UpdateCollection(w http.ResponseWriter, r *http.Request) {
	var collection models.Collection
	json.NewDecoder(r.Body).Decode(&collection)

	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil || id < 0 {
		id = 0
	}
	collection.ID = uint(id)

	productsRepositorie := productsController.productsRepository
	status, result := productsRepositorie.UpdateCollection(collection)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (productsController *ProductsController) DeleteCollection(w http.ResponseWriter, r *http.Request) {
	idString := r.PathValue("id")
	id, err := strconv.Atoi(idString)
	if err != nil || id < 0 {
		id = 0
	}

	productsRepositorie := productsController.productsRepository
	status, result := productsRepositorie.DeleteCollection(uint(id))

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (productsController *ProductsController) GetColors(w http.ResponseWriter, r *http.Request) {
	productsRepositorie := productsController.productsRepository
	status, result := productsRepositorie.GetColors()

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (productsController *ProductsController) CreateColor(w http.ResponseWriter, r *http.Request) {
	var color models.Color
	json.NewDecoder(r.Body).Decode(&color)

	productsRepositorie := productsController.productsRepository
	status, result := productsRepositorie.CreateColor(color.Name)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (productsController *ProductsController) UpdateColor(w http.ResponseWriter, r *http.Request) {
	var color models.Color
	json.NewDecoder(r.Body).Decode(&color)

	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil || id < 0 {
		id = 0
	}
	color.ID = uint(id)

	productsRepositorie := productsController.productsRepository
	status, result := productsRepositorie.UpdateColor(color)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (productsController *ProductsController) DeleteColor(w http.ResponseWriter, r *http.Request) {
	idString := r.PathValue("id")
	id, err := strconv.Atoi(idString)
	if err != nil || id < 0 {
		id = 0
	}

	productsRepositorie := productsController.productsRepository
	status, result := productsRepositorie.DeleteColor(uint(id))

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (productsController *ProductsController) GetTailles(w http.ResponseWriter, r *http.Request) {
	productsRepositorie := productsController.productsRepository
	status, result := productsRepositorie.GetTailles()

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (productsController *ProductsController) CreateTaille(w http.ResponseWriter, r *http.Request) {
	var taille models.Taille
	json.NewDecoder(r.Body).Decode(&taille)

	productsRepositorie := productsController.productsRepository
	status, result := productsRepositorie.CreateTaille(taille.Name)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (productsController *ProductsController) UpdateTaille(w http.ResponseWriter, r *http.Request) {
	var taille models.Taille
	json.NewDecoder(r.Body).Decode(&taille)

	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil || id < 0 {
		id = 0
	}
	taille.ID = uint(id)

	productsRepositorie := productsController.productsRepository
	status, result := productsRepositorie.UpdateTaille(taille)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (productsController *ProductsController) DeleteTaille(w http.ResponseWriter, r *http.Request) {
	idString := r.PathValue("id")
	id, err := strconv.Atoi(idString)
	if err != nil || id < 0 {
		id = 0
	}

	productsRepositorie := productsController.productsRepository
	status, result := productsRepositorie.DeleteTaille(uint(id))

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (productsController *ProductsController) CreateItem(w http.ResponseWriter, r *http.Request) {
	var item models.Item
	json.Unmarshal([]byte(r.FormValue("item")), &item)

	// Receive files:
	imagesHeaders := r.MultipartForm.File["images"]
	var images []multipart.File
	for _, imagesHeader := range imagesHeaders {
		file, err := imagesHeader.Open()
		if err != nil {
			http.Error(w, "Unable to open file", http.StatusInternalServerError)
			return
		}
		defer file.Close()
		images = append(images, file)
	}

	productsRepositorie := productsController.productsRepository
	status, result := productsRepositorie.CreateItem(item, images)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (productsController *ProductsController) CreateItemImages(w http.ResponseWriter, r *http.Request) {
	var id uint
	json.Unmarshal([]byte(r.FormValue("id")), &id)

	fmt.Println(id)

	// Receive files:
	imagesHeaders := r.MultipartForm.File["images"]
	var images []multipart.File
	for _, imagesHeader := range imagesHeaders {
		file, err := imagesHeader.Open()
		if err != nil {
			http.Error(w, "Unable to open file", http.StatusInternalServerError)
			return
		}
		defer file.Close()
		images = append(images, file)
	}

	productsRepositorie := productsController.productsRepository
	status, result := productsRepositorie.CreateItemImages(id, images)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (productsController *ProductsController) DeleteItemImages(w http.ResponseWriter, r *http.Request) {
	var item models.Item
	json.NewDecoder(r.Body).Decode(&item)

	productsRepositorie := productsController.productsRepository
	status, result := productsRepositorie.DeleteItemImages(item.Images)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (productsController *ProductsController) UpdateItem(w http.ResponseWriter, r *http.Request) {
	var item models.Item
	json.NewDecoder(r.Body).Decode(&item)

	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil || id < 0 {
		id = 0
	}
	item.ID = uint(id)

	productsRepositorie := productsController.productsRepository
	status, result := productsRepositorie.UpdateItem(item)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (productsController *ProductsController) DeleteItem(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil || id < 0 {
		id = 0
	}

	productsRepositorie := productsController.productsRepository
	status, result := productsRepositorie.DeleteItem(uint(id))

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (productsController *ProductsController) GetItems(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	pageSizeString := query.Get("page_size")
	pageSize, err := strconv.Atoi(pageSizeString)
	if err != nil || pageSize < 0 {
		pageSize = 0
	}

	pageString := query.Get("page")
	page, err := strconv.Atoi(pageString)
	if err != nil || page < 0 {
		page = 0
	}

	appendWith := query.Get("append_with")
	orderBy := query.Get("order_by")
	name := query.Get("name")

	descString := query.Get("desc")
	desc, err := strconv.ParseBool(descString)
	if err != nil {
		desc = false
	}

	collectionIDString := query.Get("collection_id")
	collectionID, err := strconv.Atoi(collectionIDString)
	if err != nil || collectionID < 0 {
		collectionID = 0
	}

	colorIDString := query.Get("color_id")
	colorID, err := strconv.Atoi(colorIDString)
	if err != nil || colorID < 0 {
		colorID = 0
	}

	tailleIDString := query.Get("taille_id")
	tailleID, err := strconv.Atoi(tailleIDString)
	if err != nil || tailleID < 0 {
		tailleID = 0
	}

	productsRepository := productsController.productsRepository
	status, result := productsRepository.GetItems(
		uint(pageSize),
		uint(page),
		appendWith,
		orderBy,
		desc,
		uint(collectionID),
		uint(colorID),
		uint(tailleID),
		name,
	)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (productsController *ProductsController) GetItem(w http.ResponseWriter, r *http.Request) {
	productsRepositorie := productsController.productsRepository

	idString := r.PathValue("id")
	id, err := strconv.Atoi(idString)
	if err != nil || id < 0 {
		id = 0
	}

	query := r.URL.Query()
	appendWith := query.Get("append_with")

	status, result := productsRepositorie.GetItem(
		uint(id),
		appendWith,
	)

	if status == http.StatusOK {
		w.WriteHeader(status)
		response, _ := json.Marshal(result["item"])
		w.Write(response)
		return
	}

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}