package models

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type Order struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	Purchases     []Purchase     `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"purchases,omitempty"`
	IsAccepted    *bool          `json:"is_accepted"`
	TransactionID *uint          `json:"transaction_id"`
	Transaction   *Transaction   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"transaction,omitempty"`
	UserID        uint           `json:"user_id"`
	User          *User          `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"user,omitempty"`
}

type Purchase struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	OrderID   uint           `json:"order_id"`
	Order     *Order         `json:"order,omitempty"`
	ItemID    uint           `json:"item_id"`
	Item      *Item          `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"item,omitempty"`
	Count     uint           `json:"count"`
}

type Transaction struct {
	ID        string         `gorm:"primaryKey" json:"id"`
	Entity    string         `json:"entity"`
	LiveMode  bool           `json:"livemode"`
	Type      string         `json:"type"`
	Data      Checkout       `gorm:"embedded" json:"data"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

type Checkout struct {
	ID                        string    `json:"id"`
	Entity                    string    `json:"entity"`
	Fees                      int64     `json:"fees"`
	Amount                    int64     `json:"amount"`
	Locale                    string    `json:"locale"`
	Status                    string    `json:"status"`
	Metadata                  *string   `json:"metadata,omitempty"`
	CreatedAt                 time.Time `json:"created_at"`
	InvoiceID                 *string   `json:"invoice_id,omitempty"`
	UpdatedAt                 time.Time `json:"updated_at"`
	CustomerID                string    `json:"customer_id"`
	Description               *string   `json:"description,omitempty"`
	FailureURL                *string   `json:"failure_url,omitempty"`
	SuccessURL                string    `json:"success_url"`
	PaymentMethod             *string   `json:"payment_method,omitempty"`
	PaymentLinkID             *string   `json:"payment_link_id,omitempty"`
	PassFeesToCustomer        *bool     `json:"pass_fees_to_customer,omitempty"`
	ChargilyPayFeesAllocation string    `json:"chargily_pay_fees_allocation"`
	ShippingAddress           *string   `json:"shipping_address,omitempty"`
	CollectShippingAddress    bool      `json:"collect_shipping_address"`
	Discount                  *int64    `json:"discount,omitempty"`
	AmountWithoutDiscount     *int64    `json:"amount_without_discount,omitempty"`
	URL                       string    `json:"url"`
}

func (order *Order) VaidateCreate() error {
	if order.UserID == 0 {
		return errors.New("USER_ID_INDEFINED")
	}

	if order.IsAccepted == nil {
		defaultValue := false
		order.IsAccepted = &defaultValue
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
