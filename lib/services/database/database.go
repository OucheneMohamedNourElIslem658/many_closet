package database

import (
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	models "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/models"
)

var Instance *gorm.DB

func Init() {
	dsn := envs.getDatabaseDSN()

	var err error
	Instance, err = gorm.Open(mysql.Open(dsn))
	if err != nil {
		log.Fatal(err.Error())
	}

	err = migrateTables()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Database connected succesfully!")
}

func migrateTables() error {
	err := Instance.AutoMigrate(
		&models.User{},
		&models.Item{},
		&models.ItemImage{},
		&models.ItemNotification{},
		&models.Color{},
		&models.ItemColor{},
		&models.Taille{},
		&models.ItemTaille{},
		&models.Collection{},
		&models.ItemCollection{},
		&models.Review{},
		&models.ReviewNotification{},
		&models.Purchase{},
		&models.Order{},
		&models.OrderNotification{},
	)
	if err != nil {
		return err
	}
	return nil
}