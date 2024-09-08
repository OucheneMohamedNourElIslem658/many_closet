package orders

import (
	"bytes"
	"encoding/json"
	"fmt"
	"math"
	"net/http"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	models "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/models"
	chargily "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/chargily"
	database "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/database"
	tools "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/tools"
)

type OrdersRepository struct {
	database *gorm.DB
	chargily chargily.Config
}

func NewOrdersRepository() *OrdersRepository {
	return &OrdersRepository{
		database: database.Instance,
		chargily: chargily.Instance,
	}
}

func (ordersRepository *OrdersRepository) MakeOrder(order models.Order, successURL string) (status int, responseBytesult tools.Object) {
	if err := order.VaidateCreate(); err != nil {
		return http.StatusBadRequest, tools.Object{
			"error": err,
		}
	}

	if successURL == "" {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_SUCCESS_URL",
		}
	}

	database := ordersRepository.database

	orderPrice := 0
	var orderCurrency string
	for _, purchase := range order.Purchases {
		err := database.Where("id = ?", purchase.ItemID).First(&purchase.Item).Error
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

		item := purchase.Item
		itemPrice := (item.Price - *item.Sold) * purchase.Count
		orderPrice += int(itemPrice)
		orderCurrency = item.Currency
	}

	requestBody := tools.Object{
		"amount":      orderPrice,
		"currency":    orderCurrency,
		"success_url": successURL,
		"metadata":    order,
	}
	requestBytes, _ := json.Marshal(requestBody)
	url := ordersRepository.chargily.BaseURL
	secretKey := ordersRepository.chargily.SecretKey

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(requestBytes))
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %v", secretKey))
	req.Header.Add("Content-Type", "application/json")

	responseBytes, err := http.DefaultClient.Do(req)
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}
	defer responseBytes.Body.Close()

	var response tools.Object
	json.NewDecoder(responseBytes.Body).Decode(&response)
	if responseBytes.StatusCode == http.StatusOK {
		return http.StatusOK, tools.Object{
			"checkout_url": response["checkout_url"],
		}
	} else {
		var err tools.Object
		json.NewDecoder(responseBytes.Body).Decode(&err)
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": response["message"],
		}
	}
}

func (ordersRepository *OrdersRepository) CreateOrder(order models.Order) (status int, responseBytesult tools.Object) {
	if err := order.VaidateCreate(); err != nil {
		return http.StatusBadRequest, tools.Object{
			"error": err.Error(),
		}
	}

	database := database.Instance
	for index, purchase := range order.Purchases {
		err := database.Model(&models.Item{}).
			Where("id = ?", purchase.ItemID).
			First(&order.Purchases[index].Item).
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

		item := order.Purchases[index].Item
		itemStock := *(item.Stock)
		if itemStock < purchase.Count {
			return http.StatusBadRequest, tools.Object{
				"error":   "ITEMS_COUNT_OUT_OF_BOUND_FOUND",
				"message": item.ID,
			}
		}

	}

	err := database.Create(&order).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"error": "ORDER_CREATED",
	}
}

func (ordersRepository *OrdersRepository) UpdateOrder(order models.Order) (status int, responseBytesult tools.Object) {
	if order.ID == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "ORDER_ID_INDEFINED",
		}
	}

	database := ordersRepository.database
	var storedOrder models.Order
	err := database.Where("id = ?", order.ID).
		First(&storedOrder).
		Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return http.StatusBadRequest, tools.Object{
				"error": "ORDER_NOT_FOUND",
			}
		}
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	if order.IsAccepted != nil {
		storedOrder.IsAccepted = order.IsAccepted
	}

	err = database.Save(&storedOrder).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"error": "ORDER_UPDATED",
	}
}

func (ordersRepository *OrdersRepository) GetOrders(pageSize uint, page uint, appendWith string, orderBy string, desc bool, userID uint, isAccepted *bool) (status int, result tools.Object) {
	database := ordersRepository.database

	if pageSize == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_PAGE_SIZE",
		}
	}

	var totalRecords int64
	database.Model(&models.Order{}).Count(&totalRecords)
	totalPages := int(math.Ceil(float64(totalRecords) / float64(pageSize)))

	if page < 1 {
		return http.StatusBadRequest, tools.Object{
			"error": "INVALID_PAGE",
		}
	}

	validExtensions := tools.GetValidExtentions(appendWith, "user")
	validFilters := tools.GetValidFilters(orderBy, "creation_time")

	offset := (page - 1) * pageSize

	query := database.Model(&models.Order{})

	var orders []models.Order
	query.Limit(int(pageSize)).Offset(int(offset))

	for _, extension := range validExtensions {
		query.Preload(extension)
	}

	for _, filter := range validFilters {
		query.Order(clause.OrderByColumn{
			Column: clause.Column{Name: filter},
			Desc:   desc,
		})
	}

	if userID != 0 {
		query.Where("user_id = ?", userID)
	}

	if isAccepted != nil {
		query.Where("is_accepted = ?", isAccepted)
	}

	err := query.Find(&orders).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"count":       len(orders),
		"page":        page,
		"page_size":   pageSize,
		"total_pages": totalPages,
		"orders":      orders,
	}
}

func (ordersRepository *OrdersRepository) GetOrder(id uint, appendWith string) (status int, result tools.Object) {
	database := ordersRepository.database

	validExtensions := tools.GetValidExtentions(appendWith, "user", "purchases")

	query := database.Model(&models.Order{}).Where("id = ?", id)

	for _, extension := range validExtensions {
		query.Preload(extension)
		if extension == "Purchases" {
			query.Preload("Purchases.Item")
		}
	}

	var order models.Order
	err := query.First(&order).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return http.StatusBadRequest, tools.Object{
				"error": "ORDER_NOT_FOUND",
			}
		}
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"order": order,
	}
}

func (ordersRepository *OrdersRepository) DeleteOrder(id uint) (status int, result tools.Object) {
	if id == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_ID",
		}
	}

	database := ordersRepository.database

	deleteResult := database.Unscoped().Where("id = ?", id).Delete(&models.Order{})
	err := deleteResult.Error
	affectedRows := deleteResult.RowsAffected

	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	if affectedRows == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "ORDER_NOT_FOUND",
		}
	}

	return http.StatusOK, tools.Object{
		"message": "ORDER_DELETED",
	}
}
