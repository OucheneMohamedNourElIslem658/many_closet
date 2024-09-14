package models

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type Order struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	Purchases  []Purchase     `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"purchases,omitempty"`
	Status     string         `gorm:"default:'pendingAcceptance'" json:"status"`
	CheckoutID *string        `gorm:"type:varchar(36)" json:"checkout_id"`
	UserID     uint           `json:"user_id"`
	User       *User          `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"user,omitempty"`
}

type Purchase struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	OrderID   uint           `json:"order_id"`
	Order     *Order         `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"order,omitempty"`
	ItemID    uint           `json:"item_id"`
	Item      *Item          `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"item,omitempty"`
	Count     uint           `json:"count"`
}

func (order *Order) VaidateCreate() error {
	if order.UserID == 0 {
		return errors.New("USER_ID_INDEFINED")
	}

	if order.Purchases == nil || len(order.Purchases) == 0 {
		return errors.New("PURCHASES_INDEFINED")
	} else {
		for _, purchase := range order.Purchases {
			err := purchase.VaidateCreate()
			if err != nil {
				return err
			}
		}
		return nil
	}
}

func (purchase *Purchase) VaidateCreate() error {
	if purchase.ItemID == 0 {
		return errors.New("ITEM_ID_INDEFINED")
	}
	if purchase.Count == 0 {
		return errors.New("ITEM_COUNT_INDEFINED")
	}
	return nil
}
