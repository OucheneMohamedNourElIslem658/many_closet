package notifications

import (
	"net/http"
	"sync"

	"gorm.io/gorm"

	models "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/models"
	database "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/database"
	tools "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/tools"
)

type NotificationsRepository struct {
	database *gorm.DB
}

func NewNotificationsRepository() *NotificationsRepository {
	return &NotificationsRepository{
		database: database.Instance,
	}
}

func (repo *NotificationsRepository) CreateOrderNotification(userID *uint, orderID uint, eventType string) error {
	if userID == nil {
		return repo.sendNotificationToAllAdmins(orderID, eventType)
	}

	notification := &models.Notification{
		Title: "Order Update",
		UserID: *userID,
		OrderNotification: &models.OrderNotification{
			OrderID:   orderID,
			EventType: eventType,
		},
		Description: "Order event: " + eventType,
	}

	return repo.CreateNotification(notification)
}

func (repo *NotificationsRepository) sendNotificationToAllAdmins(orderID uint, eventType string) error {
	var wg sync.WaitGroup
	errs := make(chan error, 100)

	var admins []models.User
	err := repo.database.Where("is_admin = ?", true).Find(&admins).Error
	if err != nil {
		return err
	}

	for _, admin := range admins {
		wg.Add(1)
		go func(adminID uint) {
			defer wg.Done()
			notification := &models.Notification{
				Title: "Order Update",
				UserID: adminID,
				OrderNotification: &models.OrderNotification{
					OrderID:   orderID,
					EventType: eventType,
				},
				Description: "Order event: " + eventType,
			}
			if err := repo.CreateNotification(notification); err != nil {
				errs <- err
			}
		}(admin.ID)
	}

	wg.Wait()
	close(errs)

	// Check for errors
	for err := range errs {
		if err != nil {
			return err
		}
	}

	return nil
}

func (repo *NotificationsRepository) CreateItemNotification(userIDs []uint, itemID uint, event string) error {
	if userIDs == nil {
		return repo.sendNotificationToAllUsers(itemID, event)
	}

	var wg sync.WaitGroup
	errs := make(chan error, len(userIDs))

	for _, userID := range userIDs {
		wg.Add(1)
		go func(userID uint) {
			defer wg.Done()
			notification := &models.Notification{
				Title: "Item Update",
				UserID: userID,
				ItemNotification: &models.ItemNotification{
					ItemID: itemID,
					Event:  event,
				},
				Description: "Item event: " + event,
			}
			if err := repo.CreateNotification(notification); err != nil {
				errs <- err
			}
		}(userID)
	}

	wg.Wait()
	close(errs)

	// Check for errors
	for err := range errs {
		if err != nil {
			return err
		}
	}

	return nil
}

func (repo *NotificationsRepository) sendNotificationToAllUsers(itemID uint, event string) error {
	var wg sync.WaitGroup
	errs := make(chan error, 100)

	var users []models.User
	err := repo.database.Where("is_admin = ?", false).Find(&users).Error
	if err != nil {
		return err
	}

	for _, user := range users {
		wg.Add(1)
		go func(userID uint) {
			defer wg.Done()
			notification := &models.Notification{
				Title: "Item Update",
				UserID: userID,
				ItemNotification: &models.ItemNotification{
					ItemID: itemID,
					Event:  event,
				},
				Description: "Item event: " + event,
			}
			if err := repo.CreateNotification(notification); err != nil {
				errs <- err
			}
		}(user.ID)
	}

	wg.Wait()
	close(errs)

	// Check for errors
	for err := range errs {
		if err != nil {
			return err
		}
	}

	return nil
}

func (repo *NotificationsRepository) CreateReviewNotification(reviewID uint, event string) error {
	return repo.sendReviewNotificationToAllAdmins(reviewID, event)
}

func (repo *NotificationsRepository) sendReviewNotificationToAllAdmins(reviewID uint, eventType string) error {
	var wg sync.WaitGroup
	errs := make(chan error, 100)

	var admins []models.User
	err := repo.database.Where("is_admin = ?", true).Find(&admins).Error
	if err != nil {
		return err
	}

	for _, admin := range admins {
		wg.Add(1)
		go func(adminID uint) {
			defer wg.Done()
			notification := &models.Notification{
				Title: "Order Update",
				UserID: adminID,
				ReviewNotification: &models.ReviewNotification{
					ReviewID:   reviewID,
					Event: eventType,
				},
				Description: "Review event: " + eventType,
			}
			if err := repo.CreateNotification(notification); err != nil {
				errs <- err
			}
		}(admin.ID)
	}

	wg.Wait()
	close(errs)

	for err := range errs {
		if err != nil {
			return err
		}
	}

	return nil
}

func (repo *NotificationsRepository) CreateNotification(notification *models.Notification) error {
	err := repo.database.Create(notification).Error
	return err
}

func (repo *NotificationsRepository) UpdateNotification(notificationID uint, userID uint, seen *bool) (int, tools.Object) {
	if seen == nil {
		return http.StatusBadRequest, tools.Object{
			"error":   "INDEFINED_SEEN",
		}
	}

	err := repo.database.Model(&models.Notification{}).
		Where("id = ? and user_id = ?", notificationID, userID).
		Update("seen", *seen).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	var notification models.Notification
	err = repo.database.First(&notification, notificationID).Error
	if err != nil {
		return http.StatusNotFound, tools.Object{
			"error":   "NOTIFICATION_NOT_FOUND",
		}
	}

	return http.StatusOK, tools.Object{
		"message": "NOTIFICATION_UPDATED",
	}
}

func (repo *NotificationsRepository) DeleteNotification(notificationID uint, userID uint) (int, tools.Object) {
	var notification models.Notification
	err := repo.database.Where("id = ? and user_id = ?", notificationID, userID).
	    First(&notification).
		Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return http.StatusBadRequest, tools.Object{
				"error":   "NOTIFICATION_NOT_FOUND",
			}
		}

		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}
	err = repo.database.Unscoped().Delete(&notification).
		Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"message": "NOTIFICATION_DELETED",
	}
}

func (repo *NotificationsRepository) GetOrderNotifications(userID uint, pageSize uint, page uint, appendMetadata bool) (int, tools.Object) {
	if pageSize <= 0 {
		return http.StatusBadRequest, tools.Object{
			"error":   "INVALID_PAGE_SIZE",
			"message": "Page size must be greater than zero.",
		}
	}

	if page <= 0 {
		return http.StatusBadRequest, tools.Object{
			"error":   "INVALID_PAGE_NUMBER",
			"message": "Page number must be greater than zero.",
		}
	}

	var totalNotifications int64
	countQuery := repo.database.Model(&models.Notification{}).Where("user_id = ? and order_notification_id IS NOT NULL", userID).Count(&totalNotifications)
	if countQuery.Error != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": countQuery.Error.Error(),
		}
	}
	totalPages := (totalNotifications + int64(pageSize) - 1) / int64(pageSize)

	var notifications []models.Notification
	query := repo.database.Where("user_id = ? and order_notification_id IS NOT NULL", userID)

	if appendMetadata {
		query.Preload("OrderNotification.Order")
	}

	query.Order("created_at desc").
		Limit(int(pageSize)).
		Offset(int((page - 1) * pageSize)).
		Find(&notifications)

	if query.Error != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": query.Error.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"page_size": pageSize,
		"page": page,
		"total_pages": totalPages,
		"notifications": notifications,
	}
}

func (repo *NotificationsRepository) GetItemNotifications(userID uint, pageSize uint, page uint, appendMetadata bool) (int, tools.Object) {
	if pageSize <= 0 {
		return http.StatusBadRequest, tools.Object{
			"error":   "INVALID_PAGE_SIZE",
			"message": "Page size must be greater than zero.",
		}
	}

	if page <= 0 {
		return http.StatusBadRequest, tools.Object{
			"error":   "INVALID_PAGE_NUMBER",
			"message": "Page number must be greater than zero.",
		}
	}

	var totalNotifications int64
	countQuery := repo.database.Model(&models.Notification{}).Where("user_id = ? and item_notification_id <> null", userID).Count(&totalNotifications)
	if countQuery.Error != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": countQuery.Error.Error(),
		}
	}
	totalPages := (totalNotifications + int64(pageSize) - 1) / int64(pageSize)

	var notifications []models.Notification
	query := repo.database.Model(&models.Notification{}).
	    Where("user_id = ? and item_notification_id IS NOT NULL", userID)

	if appendMetadata {
		query.Preload("ItemNotification.Item").Preload("ItemNotification.Item.Images")
	}

	query.Order("created_at desc").
		Limit(int(pageSize)).
		Offset(int((page - 1) * pageSize)).
		Find(&notifications)

	if query.Error != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": query.Error.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"page_size": pageSize,
		"page": page,
		"total_pages": totalPages,
		"notifications": notifications,
	}
}

func (repo *NotificationsRepository) GetReviewNotifications(userID uint, pageSize uint, page uint, appendMetadata bool) (int, tools.Object) {
	if pageSize <= 0 {
		return http.StatusBadRequest, tools.Object{
			"error":   "INVALID_PAGE_SIZE",
			"message": "Page size must be greater than zero.",
		}
	}

	if page <= 0 {
		return http.StatusBadRequest, tools.Object{
			"error":   "INVALID_PAGE_NUMBER",
			"message": "Page number must be greater than zero.",
		}
	}

	var totalNotifications int64
	countQuery := repo.database.Model(&models.Notification{}).Where("user_id = ? and review_notification_id IS NOT NULL", userID).Count(&totalNotifications)
	if countQuery.Error != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": countQuery.Error.Error(),
		}
	}
	totalPages := (totalNotifications + int64(pageSize) - 1) / int64(pageSize)

	var notifications []models.Notification
	query := repo.database.Where("user_id = ? and review_notification_id IS NOT NULL", userID)

	if appendMetadata {
		query.Preload("ReviewNotification.Review").Preload("ReviewNotification.Review.User")
	}

	query.Order("created_at desc").
		Limit(int(pageSize)).
		Offset(int((page - 1) * pageSize)).
		Find(&notifications)

	if query.Error != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": query.Error.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"page_size": pageSize,
		"page": page,
		"total_pages": totalPages,
		"notifications": notifications,
	}
}