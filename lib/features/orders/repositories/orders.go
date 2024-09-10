package orders

import (
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
		itemStock := item.Stock
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

func (ordersRepository *OrdersRepository) AcceptOrder(id uint) (status int, responseBytesult tools.Object) {
	if id == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "ID_UNDEFINED",
		}
	}

	database := ordersRepository.database
	var order models.Order
	err := database.Where("id = ?", id).
		Preload("Purchases").
		Preload("Purchases.Item").
		First(&order).
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

	if order.Status == "pendingAcceptance" || order.Status == "rejected" {
		for _, purchase := range order.Purchases {
			item := purchase.Item
			stock := item.Stock
			stock -= purchase.Count
			item.Stock = stock
			err := database.Save(&item).Error
			if err != nil {
				return http.StatusInternalServerError, tools.Object{
					"error":   "INTERNAL_SERVER_ERROR",
					"message": err.Error(),
				}
			}
		}
		order.Status = "accepted"
	} else {
		return http.StatusBadRequest, tools.Object{
			"error": "ORDER_ALREADY_ACCEPTED",
		}
	}

	err = database.Save(&order).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"error": "ORDER_ACCEPTED",
	}
}

func (ordersRepository *OrdersRepository) UnacceptOrder(id uint) (status int, responseBytesult tools.Object) {
	if id == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "ID_UNDEFINED",
		}
	}

	database := ordersRepository.database
	var order models.Order
	err := database.Where("id = ?", id).
		Preload("Purchases").
		Preload("Purchases.Item").
		First(&order).
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

	if order.Status == "paid" {
		return http.StatusBadRequest, tools.Object{
			"error": "ORDER_ALREADY_PAID",
		}
	}

	if order.Status == "pendingAcceptance" || order.Status == "accepted" {
		for _, purchase := range order.Purchases {
			item := purchase.Item
			stock := item.Stock
			stock += purchase.Count
			item.Stock = stock
			err := database.Save(&item).Error
			if err != nil {
				return http.StatusInternalServerError, tools.Object{
					"error":   "INTERNAL_SERVER_ERROR",
					"message": err.Error(),
				}
			}
		}
		order.Status = "rejected"
	} else {
		return http.StatusBadRequest, tools.Object{
			"error": "ORDER_ALREADY_UNACCEPTED",
		}
	}

	err = database.Save(&order).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"error": "ORDER_UNACCEPTED",
	}
}

func (ordersRepository *OrdersRepository) GetOrders(pageSize uint, page uint, appendWith string, orderBy string, desc bool, userID uint, orderStatus string) (status int, result tools.Object) {
	database := ordersRepository.database

	if pageSize == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "UNDEFINED_PAGE_SIZE",
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

	if orderStatus != "" {
		query.Where("status = ?", orderStatus)
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
			"error": "UNDEFINED_ID",
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

func (ordersRepository *OrdersRepository) SendPaymentURL(id uint, successURL string, failureURL string) (status int, responseBytesult tools.Object) {
	if id == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "UNDEFINED_ID",
		}
	}
	if successURL == "" {
		return http.StatusBadRequest, tools.Object{
			"error": "UNDEFINED_SUCCESS_URL",
		}
	}
	if failureURL == "" {
		return http.StatusBadRequest, tools.Object{
			"error": "UNDEFINED_FAILURE_URL",
		}
	}

	database := ordersRepository.database

	var order models.Order
	err := database.Where("id = ?", id).
		Preload("Purchases").
		Preload("Purchases.Item").
		First(&order).Error
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

	if order.Status == "rejected" || order.Status == "pendingAcceptance" {
		return http.StatusBadRequest, tools.Object{
			"error": "ORDER_NOT_ACCEPTED_YET",
		}
	}

	if order.Status == "paid" {
		return http.StatusBadRequest, tools.Object{
			"error": "ORDER_ALREADY_PAID",
		}
	}

	if order.Status == "pendingPayment" {
		return http.StatusBadRequest, tools.Object{
			"error": "URL_ALREADY_SENT",
		}
	}
	status, result := chargily.CreateCheckoutURL(&order, successURL, failureURL)
	if status != http.StatusOK {
		return status, result
	}

	err = database.Save(&order).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}
	return status, result
}

func (ordersRepository *OrdersRepository) ExpirePaymentURL(id uint) (status int, responseBytesult tools.Object) {
	if id == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "UNDEFINED_ID",
		}
	}

	database := ordersRepository.database

	var order models.Order
	err := database.Where("id = ?", id).
		Preload("Purchases").
		Preload("Purchases.Item").
		First(&order).Error
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

	if order.Status == "rejected" || order.Status == "pendingAcceptance" {
		return http.StatusBadRequest, tools.Object{
			"error": "ORDER_NOT_ACCEPTED_YET",
		}
	}

	if order.Status == "accepted" {
		return http.StatusBadRequest, tools.Object{
			"error": "URL_NOT_SENT_YET",
		}
	}

	if order.Status == "paid" {
		return http.StatusBadRequest, tools.Object{
			"error": "ORDER_ALREADY_PAID",
		}
	}

	status, result := chargily.ExpireChekoutURL(*order.CheckoutID)
	if status != http.StatusOK {
		return status, result
	}

	order.Status = "accepted"
	order.CheckoutID = nil
	err = database.Save(&order).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}
	return status, result
}

func (ordersRepository *OrdersRepository) PaymentWebhook(paymentStatus string, orderID uint) (status int, responseBytesult tools.Object) {
	if orderID == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "UNDEFINED_ORDER_ID",
		}
	}

	if paymentStatus == "" {
		return http.StatusBadRequest, tools.Object{
			"error": "UNDEFINED_PAYMENT_STATUS",
		}
	}

	database := ordersRepository.database

	var order models.Order
	err := database.Where("id = ?", orderID).
		Preload("Purchases").
		Preload("Purchases.Item").
		First(&order).Error
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

	if order.Status == "rejected" || order.Status == "pendingAcceptance" {
		return http.StatusBadRequest, tools.Object{
			"error": "ORDER_NOT_ACCEPTED_YET",
		}
	}

	if order.Status == "accepted" {
		return http.StatusBadRequest, tools.Object{
			"error": "URL_NOT_SENT_YET",
		}
	}

	if order.Status == "paid" {
		return http.StatusBadRequest, tools.Object{
			"error": "ORDER_ALREADY_PAID",
		}
	}

	if paymentStatus == "paid" {
		order.Status = "paid"
		err = database.Save(&order).Error
		if err != nil {
			return http.StatusInternalServerError, tools.Object{
				"error":   "INTERNAL_SERVER_ERROR",
				"message": err.Error(),
			}
		}
		return http.StatusOK,  tools.Object{
			"message": "ORDER_PAID",
		}
	}

	return http.StatusBadRequest,  tools.Object{
		"message": "PAYMENT_NOT_DONE_YET",
	}
}
