package hooks

import (
	"gorm.io/gorm"

	analyticsSockets "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/analytics/sockets"
	models "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/models"
	database "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/database"
)

func registerReviewHooks() error {
	database := database.Instance

	if err := afterCreateReview(database); err != nil {
		return err
	}
	// if err := afterUpdateReview(database); err != nil {
	// 	return err
	// }
	if err := afterDeleteReview(database); err != nil {
		return err
	}
	return nil
}

func afterCreateReview(database *gorm.DB) error {
	return database.Callback().Create().After("gorm:commit_or_rollback_transaction").Register("after_commit_review", func(d *gorm.DB) {
		if review, ok := d.Statement.Dest.(*models.Review); ok {
			notificationsRepository.CreateReviewNotification(review.ID, "review_created")
			go analyticsSockets.BroadcastToActiveUsersSocket(nil)
		}
	})
}

// func afterUpdateReview(database *gorm.DB) error {
// 	return database.Callback().Update().After("gorm:commit_or_rollback_transaction").Register("after_commit_review_update", func(d *gorm.DB) {
// 		if _, ok := d.Statement.Dest.(*models.Review); ok {

// 		}
// 	})
// }

func afterDeleteReview(database *gorm.DB) error {
	return database.Callback().Delete().After("gorm:commit_or_rollback_transaction").Register("after_commit_review_delete", func(d *gorm.DB) {
		if _, ok := d.Statement.Dest.(*models.Review); ok {
			go analyticsSockets.BroadcastToActiveUsersSocket(nil)
		}
	})
}