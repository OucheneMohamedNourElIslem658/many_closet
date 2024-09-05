package models

import (
	"time"

	"gorm.io/gorm"
)

type Order struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	Purchases     []Purchase     `gorm:"foreignKey:OrderID" json:"purchases,omitempty"`
	Price         uint           `json:"price"`
	Currency      string         `json:"currency"`
	TransactionID uint           `json:"transaction_id"`
	Transaction   *Transaction   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"transaction,omitempty"`
	UserID        uint           `json:"user_id"`
	User          *User          `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"user,omitempty"`
}

type Purchase struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	OrderID   uint           `json:"order_id"`
	ItemID    uint           `json:"item_id"`
	Item      *Item           `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"item,omitempty"`
	Count     uint           `json:"count"`
}

type Transaction struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}
