package models

import (
	"time"

	"gorm.io/gorm"
)

type OrderNotification struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	Title       string         `json:"title"`
	Description string         `json:"description"`
	OrderID     uint           `json:"order_id"`
}

type ItemNotification struct {
	ID              uint           `gorm:"primaryKey" json:"id"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	Title           string         `json:"title"`
	Description     string         `json:"description"`
	ItemID          uint           `json:"item_id"`
}

type ReviewNotification struct {
	ID              uint           `gorm:"primaryKey" json:"id"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	Title           string         `json:"title"`
	Description     string         `json:"description"`
	ReviewID        uint           `json:"review_id"`
}