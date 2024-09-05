package reviews

import (
	"math"
	"net/http"
	"strings"

	"github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/models"
	"github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/database"
	"github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/tools"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type ReviewsRepository struct {
	database *gorm.DB
}

func NewReviewsRepository() *ReviewsRepository {
	return &ReviewsRepository{
		database: database.Instance,
	}
}

func (reviewsRepository *ReviewsRepository) CreateReview(review models.Review) (status int, result tools.Object) {
	if err := review.ValidateCreate(); err != nil {
		return http.StatusBadRequest, tools.Object{
			"error": err.Error(),
		}
	}

	database := reviewsRepository.database

	var userExists bool
	err := database.Model(&models.User{}).Select("count(*) > 0").Where("id = ?", review.UserID).Scan(&userExists).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}
	if !userExists {
		return http.StatusBadRequest, tools.Object{
			"error": "USER_NOT_FOUND",
		}
	}

	var itemExists bool
	err = database.Model(&models.Item{}).Select("count(*) > 0").Where("id = ?", review.ItemID).Scan(&itemExists).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}
	if !itemExists {
		return http.StatusBadRequest, tools.Object{
			"error": "ITEM_NOT_FOUND",
		}
	}

	err = database.Create(&review).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"error": "REVIEW_CREATED",
	}
}

func (reviewsRepository *ReviewsRepository) DeleteReview(id uint) (status int, result tools.Object) {
	if id == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_ID",
		}
	}

	database := reviewsRepository.database

	deleteResult := database.Unscoped().Where("id = ?", id).Delete(&models.Review{})
	err := deleteResult.Error
	affectedRows := deleteResult.RowsAffected

	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	if affectedRows == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "REVIEW_NOT_FOUND",
		}
	}

	return http.StatusOK, tools.Object{
		"error": "REVIEW_DELETED",
	}
}

func (reviewsRepository *ReviewsRepository) UpdateReview(review models.Review) (status int, result tools.Object) {
	if review.ID == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_ID",
		}
	}

	database := reviewsRepository.database

	var storedReview models.Review
	err := database.Where("id = ?", review.ID).First(&storedReview).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return http.StatusBadRequest, tools.Object{
				"error": "REVIEW_NOT_FOUND",
			}
		}

		return http.StatusBadRequest, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	if review.Comment != "" {
		storedReview.Comment = review.Comment
	}

	if review.Rate != nil {
		storedReview.Rate = review.Rate
	}

	err = database.Save(&storedReview).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"error": "REVIEW_UPDATED",
	}
}

func (reviewsRepository *ReviewsRepository) GetReview(id uint, appendWith string) (status int, result tools.Object) {
	if id == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_ID",
		}
	}

	database := reviewsRepository.database
	query := database.Model(&models.Review{})

	validExtentions := getValidExtentions(appendWith)
	for _, extention := range validExtentions {
		query.Preload(extention)
	}

	var review models.Review
	err := query.Where("id = ?", id).First(&review).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return http.StatusBadRequest, tools.Object{
				"error": "REVIEW_NOT_FOUND",
			}
		}

		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"review": review,
	}
}

func (reviewsRepository *ReviewsRepository) GetReviews(pageSize uint, page uint, appendWith string, orderBy string, desc bool, userID uint, itemID uint) (status int, result tools.Object) {
	database := reviewsRepository.database

	if pageSize == 0 {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_PAGE_SIZE",
		}
	}

	var totalRecords int64
	database.Model(&models.Review{}).Count(&totalRecords)
	totalPages := int(math.Ceil(float64(totalRecords) / float64(pageSize)))

	if page < 1 || page > uint(totalPages) {
		return http.StatusBadRequest, tools.Object{
			"error": "INVALID_PAGE",
		}
	}

	validExtentions := getValidExtentions(appendWith)
	validFilters := getValidFilters(orderBy)

	offset := (page - 1) * pageSize

	query := database.Model(&models.Review{})

	if userID != 0 {
		query = query.Joins("JOIN users ON users.id = reviews.user_id").
			Where("users.id = ?", userID)
	}

	if itemID != 0 {
		query = query.Joins("JOIN items ON items.id = reviews.item_id").
			Where("items.id = ?", itemID)
	}

	var reviews []models.Review
	query.Limit(int(pageSize)).Offset(int(offset))

	for _, extention := range validExtentions {
		query.Preload(extention)
	}

	for _, filter := range validFilters {
		query.Order(clause.OrderByColumn{
			Column: clause.Column{Name: filter},
			Desc:   desc,
		})
	}

	err := query.Find(&reviews).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"count":       len(reviews),
		"page":        page,
		"page_size":   pageSize,
		"total_pages": totalPages,
		"reviews":     reviews,
	}
}

func getValidExtentions(appendWith string) []string {
	extentions := strings.Split(appendWith, ",")
	validExtentions := make([]string, 0)
	for _, extention := range extentions {
		extention = strings.ToLower(extention)
		isExtentionValid := extention == "user" ||
			extention == "item"
		if isExtentionValid {
			extention = strings.ToUpper(string(extention[0])) + extention[1:]
			validExtentions = append(validExtentions, extention)
		}
	}
	return validExtentions
}

func getValidFilters(orderBy string) []string {
	filter := strings.Split(orderBy, ",")
	validFilters := make([]string, 0)
	for _, filter := range filter {
		filter = strings.ToLower(filter)
		isFilterValid := filter == "rate" ||
			filter == "creation_time"
		if isFilterValid {
			if filter == "creation_time" {
				filter = "created_at"
			}
			validFilters = append(validFilters, filter)
		}
	}
	return validFilters
}
