package models

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type Item struct {
	ID              uint           `gorm:"primaryKey" json:"id"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	Name            string         `gorm:"unique;not null" json:"name"`
	Images          []ItemImage    `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"images,omitempty"`
	Price           uint           `json:"price"`
	Currency        string         `json:"currency"`
	Sold            uint           `json:"sold"`
	Description     string         `json:"description"`
	ChargilyPriceID string         `json:"chargily_price_id"`
	Colors          []Color        `gorm:"many2many:item_colors;" json:"colors,omitempty"`
	Tailles         []Taille       `gorm:"many2many:item_tailles;" json:"tailles,omitempty"`
	Stock           uint           `json:"stock"`
	SKU             string         `json:"sku"`
	Rate            *float64       `json:"rate"`
	Collections     []Collection   `gorm:"many2many:item_collections;" json:"collections,omitempty"`
	Reviews         []Review       `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"reviews,omitempty"`
}

type Color struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	Name      string         `gorm:"unique;not null" json:"name"`
	Items     []Item         `gorm:"many2many:item_colors;" json:"items,omitempty"`
}

type ItemColor struct {
	ItemID  uint  `gorm:"primaryKey" json:"item_id"`
	ColorID uint  `gorm:"primaryKey" json:"color_id"`
	Item    Item  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;foreignKey:ItemID" json:"item"`
	Color   Color `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;foreignKey:ColorID" json:"color"`
}

type Taille struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	Name      string         `gorm:"unique;not null" json:"name"`
	Items     []Item         `gorm:"many2many:item_tailles;" json:"items,omitempty"`
}

type ItemTaille struct {
	ItemID   uint   `gorm:"primaryKey" json:"item_id"`
	TailleID uint   `gorm:"primaryKey" json:"taille_id"`
	Item     Item   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;foreignKey:ItemID" json:"item"`
	Taille   Taille `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;foreignKey:TailleID" json:"taille"`
}

type Collection struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	Name      string         `gorm:"unique;not null" json:"name"`
	Items     []Item         `gorm:"many2many:item_collections;" json:"items,omitempty"`
}

type ItemCollection struct {
	ItemID       uint       `gorm:"primaryKey" json:"item_id"`
	CollectionID uint       `gorm:"primaryKey" json:"collection_id"`
	Item         Item       `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;foreignKey:ItemID" json:"item"`
	Collection   Collection `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;foreignKey:CollectionID" json:"collection"`
}

func (collection Collection) ValidateUpdate() error {
	if collection.ID == 0 {
		return errors.New("INDEFINED_ID")
	}
	if collection.Name == "" {
		return errors.New("INDEFINED_NAME")
	}
	return nil
}

func (color Color) ValidateUpdate() error {
	if color.ID == 0 {
		return errors.New("INDEFINED_ID")
	}
	if color.Name == "" {
		return errors.New("INDEFINED_NAME")
	}
	return nil
}

func (taille Taille) ValidateUpdate() error {
	if taille.ID == 0 {
		return errors.New("INDEFINED_ID")
	}
	if taille.Name == "" {
		return errors.New("INDEFINED_NAME")
	}
	return nil
}

func (item Item) ValidateCreate() error {
	if item.Name == "" {
		return errors.New("INDEFINED_NAME")
	}
	if item.Price == 0 {
		return errors.New("INDEFINED_PRICE")
	}
	if item.Currency == "" {
		return errors.New("INDEFINED_CURRENCY")
	}
	if item.SKU == "" {
		return errors.New("INDEFINED_SKU")
	}
	if len(item.Collections) != 0 {
		for _, collection := range item.Collections {
			if collection.ID <= 0 {
				return errors.New("INDEFINED_ID")
			}
		}
	}
	if len(item.Images) != 0 && item.Images != nil {
		for _, image := range item.Images {
			image.ValidateCreate()
		}
	}
	if len(item.Collections) != 0 && item.Collections != nil {
		for _, collection := range item.Collections {
			if collection.ID <= 0 {
				return errors.New("INDEFINED_ID")
			}
		}
	}
	return nil
}
