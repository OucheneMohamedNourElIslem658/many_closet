package models

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type Review struct {
	ID                  uint                 `gorm:"primaryKey" json:"id"`
	CreatedAt           time.Time            `json:"created_at"`
	UpdatedAt           time.Time            `json:"updated_at"`
	DeletedAt           gorm.DeletedAt       `gorm:"index" json:"deleted_at"`
	Comment             string               `json:"comment"`
	Rate                *uint                `json:"rate"`
	UserID              uint                 `json:"user_id"`
	User                *User                `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"user,omitempty"`
	ItemID              uint                 `json:"item_id"`
	Item                *Item                `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"item,omitempty"`
	ReviewNotifications []ReviewNotification `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"review_notifications,omitempty"`
}

func (review *Review) ValidateCreate() error {
	if review.ItemID == 0 {
		return errors.New("INDEFINED_ITEM_ID")
	}
	if review.UserID == 0 {
		return errors.New("INDEFINED_USER_ID")
	}
	if review.Comment == "" {
		return errors.New("INDEFINED_COMMENT")
	}
	if review.Rate == nil {
		defaultValue := uint(0)
		review.Rate = &defaultValue
	}
	return nil
}
