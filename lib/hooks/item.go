package hooks

import (
	"gorm.io/gorm"

	analyticsSockets "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/analytics/sockets"
	models "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/models"
	database "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/database"
)


func registerItemHooks() error {
	database := database.Instance

	if err := afterCreateItem(database); err != nil {
		return err
	}
	// if err := afterUpdateItem(database); err != nil {
	// 	return err
	// }
	if err := afterDeleteItem(database); err != nil {
		return err
	}
	return nil
}

func afterCreateItem(database *gorm.DB) error {
	return database.Callback().Create().After("gorm:commit_or_rollback_transaction").Register("after_commit_item_create", func(d *gorm.DB) {
		if item, ok := d.Statement.Dest.(*models.Item); ok {
			go notificationsRepository.CreateItemNotification(nil, item.ID, "item_creation")
			go analyticsSockets.BroadcastToTotalProductsSocket(nil)
			go analyticsSockets.BroadcastToProductsBySalesSocket(nil)
		}
	})
}

// func afterUpdateItem(database *gorm.DB) error {
// 	return database.Callback().Update().After("gorm:commit_or_rollback_transaction").Register("after_commit_item_update", func(d *gorm.DB) {
// 		if _, ok := d.Statement.Dest.(*models.Item); ok {
// 		}
// 	})
// }

func afterDeleteItem(database *gorm.DB) error {
	return database.Callback().Delete().After("gorm:commit_or_rollback_transaction").Register("after_commit_item_delete", func(d *gorm.DB) {
		if _, ok := d.Statement.Dest.(*models.Item); ok {
			go analyticsSockets.BroadcastToTotalProductsSocket(nil)
			go analyticsSockets.BroadcastToProductsBySalesSocket(nil)
		}
	})
}
