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
