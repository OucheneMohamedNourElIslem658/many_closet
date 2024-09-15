package hooks

import (
	"gorm.io/gorm"

	analyticsSockets "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/analytics/sockets"
	models "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/models"
	database "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/database"
)

func registerUserHooks() error {
	database := database.Instance

	if err := afterCreateUser(database); err != nil {
		return err
	}
	// if err := AfterUpdateUser(database); err != nil {
	// 	return err
	// }
	if err := afterDeleteUser(database); err != nil {
		return err
	}
	return nil
}

func afterCreateUser(database *gorm.DB) error {
	return database.Callback().Create().After("gorm:commit_or_rollback_transaction").Register("after_commit_user", func(d *gorm.DB) {
		if _, ok := d.Statement.Dest.(*models.User); ok {
			go analyticsSockets.BroadcastToTotalRegisteredUsersSocket(nil)
			go analyticsSockets.BroadcastToNewUsersSocket(nil)
			go analyticsSockets.BroadcastToActiveUsersSocket(nil)
		}
	})
}

// func AfterUpdateUser(database *gorm.DB) error {
// 	return database.Callback().Update().After("gorm:commit_or_rollback_transaction").Register("after_commit_user_update", func(d *gorm.DB) {
// 		if _, ok := d.Statement.Dest.(*models.User); ok {

// 		}
// 	})
// }


func afterDeleteUser(database *gorm.DB) error {
	return database.Callback().Delete().After("gorm:commit_or_rollback_transaction").Register("after_commit_user_delete", func(d *gorm.DB) {
		if _, ok := d.Statement.Dest.(*models.User); ok {
			go analyticsSockets.BroadcastToTotalRegisteredUsersSocket(nil)
			go analyticsSockets.BroadcastToNewUsersSocket(nil)
			go analyticsSockets.BroadcastToActiveUsersSocket(nil)
		}
	})
}
