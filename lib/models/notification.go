package models

import (
	"time"

	"gorm.io/gorm"
)

type Notification struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	Title       string         `json:"title"`
	Description string         `json:"description"`
	Seen        bool           `json:"seen"`
	About       string         `json:"about"`
	UserID      uint           `json:"user_id"`
	User        *User          `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"user,omitempty"`

	OrderNotification    *OrderNotification  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"order_metadata,omitempty"`
	ItemNotification     *ItemNotification   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"item_metadata,omitempty"`
	ReviewNotification   *ReviewNotification `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"review_metadata,omitempty"`
	OrderNotificationID  *uint               `json:"-"`
	ItemNotificationID   *uint               `json:"-"`
	ReviewNotificationID *uint               `json:"-"`
}

type OrderNotification struct {
	ID        uint   `gorm:"primaryKey" json:"-"`
	OrderID   uint   `json:"order_id"`
	Order     *Order `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"order,omitempty"`
	EventType string `json:"event_type"`
}

type ItemNotification struct {
	ID     uint   `gorm:"primaryKey" json:"-"`
	ItemID uint   `json:"item_id"`
	Item   *Item  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"item,omitempty"`
	Event  string `json:"event"`
}

type ReviewNotification struct {
	ID       uint    `gorm:"primaryKey" json:"-"`
	ReviewID uint    `json:"review_id"`
	Review   *Review `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"review,omitempty"`
	Event    string  `json:"event"`
}
