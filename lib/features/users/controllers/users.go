package users

import (
	"encoding/json"
	"net/http"
	"strconv"

	usersRepository "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/users/repositories"
	"github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/models"
	"github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/tools"
)

type UsersController struct {
	usersRepository *usersRepository.UsersRepository
}

func NewUsersController() *UsersController {
	return &UsersController{
		usersRepository: usersRepository.NewUsersRepository(),
	}
}

func (usersController *UsersController) GetProfile(w http.ResponseWriter, r *http.Request) {
	var body tools.Object
	json.NewDecoder(r.Body).Decode(&body)

	usersRepository := usersController.usersRepository

	auth, _ := r.Context().Value("auth").(tools.Object)
	id := uint(auth["id"].(float64))
	status, result := usersRepository.GetUser(id, "")

	if status == http.StatusOK {
		user := result["user"].(models.User)
		w.WriteHeader(status)
		response, _ := json.MarshalIndent(&user, "", "\t")
		w.Write(response)
		return
	}

	w.WriteHeader(status)
	reponse, _ := json.Marshal(result)
	w.Write(reponse)
}

func (usersController *UsersController) GetUser(w http.ResponseWriter, r *http.Request) {
	idString := r.PathValue("id")
	id, err := strconv.Atoi(idString)
	if err != nil || id < 0 {
		id = 0
	}

	appendWith := r.PathValue("append_with")

	usersRepository := usersController.usersRepository
	status, result := usersRepository.GetUser(uint(id), appendWith)

	if status == http.StatusOK {
		user := result["user"].(models.User)
		w.WriteHeader(status)
		response, _ := json.Marshal(&user)
		w.Write(response)
		return
	}

	w.WriteHeader(status)
	reponse, _ := json.Marshal(result)
	w.Write(reponse)
}

func (usersController *UsersController) GetUsers(w http.ResponseWriter, r *http.Request) {
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

	orderBy := query.Get("order_by")

	descString := query.Get("desc")
	desc, err := strconv.ParseBool(descString)
	if err != nil {
		desc = false
	}

	auth, _ := r.Context().Value("auth").(tools.Object)
	id := uint(auth["id"].(float64))

	usersRepository := usersController.usersRepository
	status, result := usersRepository.GetUsers(
		id,
		uint(pageSize),
		uint(page),
		orderBy,
		desc,
	)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (usersController *UsersController) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	var user models.User
	json.NewDecoder(r.Body).Decode(&user)

	auth, _ := r.Context().Value("auth").(tools.Object)
	id := auth["id"].(float64)
	user.ID = uint(id)

	usersRepository := usersController.usersRepository
	status, result := usersRepository.UpdateProfile(user)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (usersController *UsersController) UpdateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	json.NewDecoder(r.Body).Decode(&user)

	idString := r.PathValue("id")
	id, err := strconv.Atoi(idString)
	if err != nil || id < 0 {
		id = 0
	}
	user.ID = uint(id)

	usersRepository := usersController.usersRepository
	status, result := usersRepository.UpdateUser(user)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (usersController *UsersController) DeleteUser(w http.ResponseWriter, r *http.Request) {
	idString := r.PathValue("id")
	id, err := strconv.Atoi(idString)
	if err != nil || id < 0 {
		id = 0
	}

	usersRepository := usersController.usersRepository
	status, result := usersRepository.DeleteUser(uint(id))

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}