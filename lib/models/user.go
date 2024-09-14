package models

import (
	"errors"
	"time"

	filestorage "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/file_storage"
	"gorm.io/gorm"
)

type User struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	Email         string         `gorm:"unique;not null" json:"email"`
	Password      string         `json:"password"`
	FullName      string         `gorm:"not null" json:"full_name"`
	EmailVerified *bool          `json:"email_verified"`
	Disabled      *bool          `json:"disabled"`
	IsAdmin       bool           `gorm:"not null" json:"is_admin"`
	ImageID       *uint           `json:"image_id"`
	Image         *Image         `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"image,omitempty"`
	Reviews       []Review       `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"reviews,omitempty"`
	Orders        []Order        `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"orders,omitempty"`
}

type Image struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	URL        string         `json:"url"`
	ImageKitID string         `json:"image_kit_id"`
}

func (image *Image) BeforeDelete(tx *gorm.DB) error {
	if image != nil {
		err := filestorage.DeleteFile(image.ImageKitID)
		if err != nil {
			return err
		}
	}
	return nil
}

func (user *User) ValidateRegistration() error {
	if user.Email == "" {
		return errors.New("EMAIL_UNDEFINED")
	}
	if user.Password == "" {
		return errors.New("PASSWORD_UNDEFINED")
	}
	if user.FullName == "" {
		return errors.New("FULLNAME_UNDEFINED")
	}

	if user.EmailVerified == nil {
		defaultValue := false
		user.EmailVerified = &defaultValue
	}

	if user.Disabled == nil {
		defaultValue := false
		user.Disabled = &defaultValue
	}

	return nil
}

func (user User) ValidateLogin() error {
	if user.Email == "" {
		return errors.New("EMAIL_UNDEFINED")
	}
	if user.Password == "" {
		return errors.New("PASSWORD_UNDEFINED")
	}
	return nil
}

func (user User) ValidateUpdate() error {
	if user.ID == 0 {
		return errors.New("ID_UNDEFINED")
	}
	if user.FullName == "" {
		return errors.New("FULLNAME_UNDEFINED")
	}
	return nil
}
