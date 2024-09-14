package hooks

import (
	"gorm.io/gorm"

	analyticsSockets "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/analytics/sockets"
	models "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/models"
	database "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/database"
)

func registerOrderHooks() error {
	database := database.Instance

	if err := afterCreateOrder(database); err != nil {
		return err
	}
	if err := afterUpdateOrder(database); err != nil {
		return err
	}
	if err := afterDeleteOrder(database); err != nil {
		return err
	}
	return nil
}

func afterCreateOrder(database *gorm.DB) error {
	return database.Callback().Create().After("gorm:commit_or_rollback_transaction").Register("after_commit_order", func(d *gorm.DB) {
		if _, ok := d.Statement.Dest.(*models.Order); ok {
			go analyticsSockets.BroadcastToActiveUsersSocket(nil)
			go analyticsSockets.BroadcastToTotalOrdersSocket(nil)
			go analyticsSockets.BroadcastToOrderTrendsSocket(nil)
			go analyticsSockets.BroadcastToOrdersByStatusSocket(nil)
		}
	})
}

func afterUpdateOrder(database *gorm.DB) error {
	return database.Callback().Update().After("gorm:commit_or_rollback_transaction").Register("after_commit_order_update", func(d *gorm.DB) {
		if order, ok := d.Statement.Dest.(*models.Order); ok {
			go analyticsSockets.BroadcastToOrdersByStatusSocket(nil)
			if order.Status == "paid" {
				go analyticsSockets.BroadcastToTotalRevenueSocket(nil)
				go analyticsSockets.BroadcastToProductsBySalesSocket(nil)
			}
		}
	})
}

func afterDeleteOrder(database *gorm.DB) error {
	return database.Callback().Delete().After("gorm:commit_or_rollback_transaction").Register("after_commit_order_delete", func(d *gorm.DB) {
		if _, ok := d.Statement.Dest.(*models.Order); ok {
			go analyticsSockets.BroadcastToActiveUsersSocket(nil)
			go analyticsSockets.BroadcastToTotalOrdersSocket(nil)
			go analyticsSockets.BroadcastToOrderTrendsSocket(nil)
			go analyticsSockets.BroadcastToOrdersByStatusSocket(nil)
		}
	})
}
