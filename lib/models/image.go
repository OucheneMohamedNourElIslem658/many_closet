package models

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type Image struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	URL       string         `json:"url,omitempty"`
}

type ItemImage struct {
	Image
	Item   *Item `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"item,omitempty"`
	ItemID uint  `json:"item_id"`
}

type UserImage struct {
	Image
	User   *User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"user,omitempty"`
	UserID uint  `json:"user_id"`
}

func (image *Image) ValidateCreate() error {
	if image.URL == "" {
		return errors.New("INDEFINED_URL")
	}
	return nil
}