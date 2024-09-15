package users

import (
	"math"
	"net/http"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	models "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/models"
	database "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/database"
	tools "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/tools"
)

type UsersRepository struct {
	database *gorm.DB
}

func NewUsersRepository() *UsersRepository {
	return &UsersRepository{
		database: database.Instance,
	}
}

func (usersRepository *UsersRepository) GetUser(id uint, appendWith string) (status int, result tools.Object) {
	if id == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_ID",
		}
	}

	database := usersRepository.database
	query := database.Model(&models.User{})

	validExtentions := tools.GetValidExtentions(appendWith, "reviews", "orders")
	for _, extention := range validExtentions {
		query.Preload(extention)
	}

	var user models.User
	err := query.Where("id = ?", id).First(&user).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return http.StatusBadRequest, tools.Object{
				"error": "USER_NOT_FOUND",
			}
		}

		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"user": user,
	}
}

func (usersRepository *UsersRepository) UpdateProfile(user models.User) (status int, result tools.Object) {
	if err := user.ValidateUpdate(); err != nil {
		return http.StatusBadRequest, tools.Object{
			"error": err.Error(),
		}
	}

	database := usersRepository.database

	var existingProfile models.User
	err := database.Where("id = ?", user.ID).First(&existingProfile).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return http.StatusBadRequest, tools.Object{
				"error": "USER_NOT_FOUND",
			}
		}

		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	if user.FullName != "" {
		existingProfile.FullName = user.FullName
	}

	err = database.Save(&existingProfile).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"message": "USER_UPDATED",
	}
}

func (usersRepository *UsersRepository) UpdateUser(user models.User) (status int, result tools.Object) {
	if user.ID == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_ID",
		}
	}

	database := usersRepository.database

	var existingProfile models.User
	err := database.Where("id = ?", user.ID).Preload("Image").First(&existingProfile).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return http.StatusBadRequest, tools.Object{
				"error": "USER_NOT_FOUND",
			}
		}

		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	if user.FullName != "" {
		existingProfile.FullName = user.FullName
	}

	if user.EmailVerified != nil {
		existingProfile.EmailVerified = user.EmailVerified
	}

	if user.Disabled != nil {
		existingProfile.Disabled = user.Disabled
	}

	err = database.Save(&existingProfile).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"message": "USER_UPDATED",
	}
}

func (usersRepository *UsersRepository) DeleteUser(id uint) (status int, result tools.Object) {
	if id == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_ID",
		}
	}

	database := usersRepository.database

	var user models.User
	err := database.Where("id = ?", id).Preload("Image").First(&user).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return http.StatusBadRequest, tools.Object{
				"error": "USER_NOT_FOUND",
			}
		}

		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	// // Delete image:
	// if user.ImageID != nil && *user.ImageID != 0 {
	// 	deleteResult := database.Unscoped().Where("id = ?", user.ImageID).Delete(&models.Image{})
	// 	err = deleteResult.Error
	// 	if err != nil {
	// 		return http.StatusInternalServerError, tools.Object{
	// 			"error":   "INTERNAL_SERVER_ERROR",
	// 			"message": err.Error(),
	// 		}
	// 	}
	// 	err = filestorage.DeleteFile(user.Image.ImageKitID)
	// 	if err != nil {
	// 		return http.StatusInternalServerError, tools.Object{
	// 			"error":   "INTERNAL_SERVER_ERROR",
	// 			"message": err.Error(),
	// 		}
	// 	}
	// }

	deleteResult := database.Unscoped().Where("id = ?", id).Delete(&user)
	err = deleteResult.Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"message": "USER_DELETED",
	}
}

func (usersRepository *UsersRepository) GetUsers(currentUserID uint, pageSize uint, page uint, orderBy string, desc bool) (status int, result tools.Object) {
	database := usersRepository.database

	if pageSize == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_PAGE_SIZE",
		}
	}

	var totalRecords int64
	database.Model(&models.User{}).Count(&totalRecords)
	totalPages := int(math.Ceil(float64(totalRecords) / float64(pageSize)))

	if page < 1 || page > uint(totalPages) {
		return http.StatusBadRequest, tools.Object{
			"error": "INVALID_PAGE",
		}
	}

	validFilters := tools.GetValidFilters(orderBy, "full_name", "creation_time")

	offset := (page - 1) * pageSize

	query := database.Model(&models.User{})

	var users []models.User
	query.Limit(int(pageSize)).Offset(int(offset))

	for _, filter := range validFilters {
		query.Order(clause.OrderByColumn{
			Column: clause.Column{Name: filter},
			Desc:   desc,
		})
	}

	err := query.Where("id <> ?", currentUserID).Find(&users).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"count":       len(users),
		"page":        page,
		"page_size":   pageSize,
		"total_pages": totalPages,
		"users":       users,
	}
}
