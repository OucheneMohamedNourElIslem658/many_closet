package hooks

import (
	"gorm.io/gorm"

	notificationsSockets "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/notifications/sockets"
	models "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/models"
	database "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/database"
)

func registerNotificationHooks() error {
	database := database.Instance

	if err := afterCreateNotification(database); err != nil {
		return err
	}
	if err := afterUpdateNotification(database); err != nil {
		return err
	}
	if err := afterDeleteNotification(database); err != nil {
		return err
	}
	return nil
}

func afterCreateNotification(database *gorm.DB) error {
	return database.Callback().Create().After("gorm:commit_or_rollback_transaction").Register("after_commit_notification", func(d *gorm.DB) {
		if notification, ok := d.Statement.Dest.(*models.Notification); ok {
			BroadcastTonotificationsSockets(notification)
		}
	})
}

func afterUpdateNotification(database *gorm.DB) error {
	return database.Callback().Update().After("gorm:commit_or_rollback_transaction").Register("after_commit_notification_update", func(d *gorm.DB) {
		if notification, ok := d.Statement.Dest.(*models.Notification); ok {
			BroadcastTonotificationsSockets(notification)
		}
	})
}

func afterDeleteNotification(database *gorm.DB) error {
	return database.Callback().Delete().After("gorm:commit_or_rollback_transaction").Register("after_commit_notification_delete", func(d *gorm.DB) {
		if notification, ok := d.Statement.Dest.(*models.Notification); ok {
			BroadcastTonotificationsSockets(notification)
		}
	})
}

func BroadcastTonotificationsSockets(notification *models.Notification)  {
	if notification.ItemNotificationID != nil {
		go notificationsSockets.BroadcastToItemsNotificationsSocket(nil, notification.UserID)
	}
	if notification.OrderNotificationID != nil {
		go notificationsSockets.BroadcastToOrdersNotificationsSocket(nil, notification.UserID)
	}
	if notification.ReviewNotificationID != nil {
		go notificationsSockets.BroadcastToReviewsNotificationsSocket(nil, notification.UserID)
	}
}