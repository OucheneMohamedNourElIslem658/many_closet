package orders

import (
	"encoding/json"
	"net/http"
	"strconv"

	ordersRepositories "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/orders/repositories"
	"github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/models"
	"github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/tools"
)

type OrdersController struct {
	ordersRepository *ordersRepositories.OrdersRepository
}

func NewOrdersController() *OrdersController {
	return &OrdersController{
		ordersRepository: ordersRepositories.NewOrdersRepository(),
	}
}

func (ordersController *OrdersController) MakeOrder(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Order      models.Order
		SuccessURL string `json:"success_url"`
	}
	json.NewDecoder(r.Body).Decode(&body)

	auth, _ := r.Context().Value("auth").(tools.Object)
	id := uint(auth["id"].(float64))
	body.Order.ID = id

	ordersRepositorie := ordersController.ordersRepository
	status, result := ordersRepositorie.MakeOrder(body.Order, body.SuccessURL)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (ordersController *OrdersController) CreateOrder(w http.ResponseWriter, r *http.Request) {
	var order models.Order
	json.NewDecoder(r.Body).Decode(&order)

	auth, _ := r.Context().Value("auth").(tools.Object)
	id := uint(auth["id"].(float64))
	order.UserID = id

	ordersRepositorie := ordersController.ordersRepository
	status, result := ordersRepositorie.CreateOrder(order)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (ordersController *OrdersController) UpdateOrder(w http.ResponseWriter, r *http.Request) {
	var order models.Order
	json.NewDecoder(r.Body).Decode(&order)

	idString := r.PathValue("id")
	id, err := strconv.Atoi(idString)
	if err != nil || id < 0 {
		id = 0
	}
	order.ID = uint(id)

	ordersRepositorie := ordersController.ordersRepository
	status, result := ordersRepositorie.UpdateOrder(order)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (ordersController *OrdersController) GetOrders(w http.ResponseWriter, r *http.Request) {
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

	descString := query.Get("desc")
	desc, err := strconv.ParseBool(descString)
	if err != nil {
		desc = false
	}

	userIDString := query.Get("user_id")
	userID, err := strconv.Atoi(userIDString)
	if err != nil || userID < 0 {
		userID = 0
	}

	var isAccepted *bool
	isAcceptedString := query.Get("is_accepted")
	isAcceptedBool, err := strconv.ParseBool(isAcceptedString)
	if err != nil {
		isAccepted = nil
	} else {
		isAccepted = &isAcceptedBool
	}

	ordersRepository := ordersController.ordersRepository
	status, result := ordersRepository.GetOrders(
		uint(pageSize),
		uint(page),
		appendWith,
		orderBy,
		desc,
		uint(userID),
		isAccepted,
	)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (ordersController *OrdersController) GetOrder(w http.ResponseWriter, r *http.Request) {
	idString := r.PathValue("id")
	id, err := strconv.Atoi(idString)
	if err != nil || id < 0 {
		id = 0
	}

	query := r.URL.Query()
	appendWith := query.Get("append_with")

	ordersRepository := ordersController.ordersRepository
	status, result := ordersRepository.GetOrder(
		uint(id),
		appendWith,
	)

	if status == http.StatusOK {
		w.WriteHeader(status)
		response, _ := json.Marshal(result["order"])
		w.Write(response)
		return
	}

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (ordersController *OrdersController) DeleteOrder(w http.ResponseWriter, r *http.Request) {
	idString := r.PathValue("id")
	id, err := strconv.Atoi(idString)
	if err != nil || id < 0 {
		id = 0
	}

	ordersRepository := ordersController.ordersRepository
	status, result := ordersRepository.DeleteOrder(
		uint(id),
	)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}
