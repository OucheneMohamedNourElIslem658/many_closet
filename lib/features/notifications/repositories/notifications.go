package notifications

import (
	"github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/database"
	"gorm.io/gorm"
)

type NotificationsRepository struct {
	database *gorm.DB
}

func NewNotificationsRepository() *NotificationsRepository {
	return &NotificationsRepository{
		database: database.Instance,
	}
}