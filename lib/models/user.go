package models

import (
	"errors"
	"time"

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
	Reviews       []Review       `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"reviews,omitempty"`
	Orders        []Order        `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"orders,omitempty"`
	Notifications []Notification `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"notifications,omitempty"`
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
