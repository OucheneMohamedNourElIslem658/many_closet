package analytics

import (
	"net/http"
	"time"

	"gorm.io/gorm"

	models "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/models"
	database "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/database"
	tools "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/tools"
)

type AnalyticsRepository struct {
	database *gorm.DB
}

func NewAnalyticsRepository() *AnalyticsRepository {
	return &AnalyticsRepository{
		database: database.Instance,
	}
}

func (analyticsRepository *AnalyticsRepository) TotalProducts() (int, tools.Object) {
	var count int64
	err := analyticsRepository.database.Model(&models.Item{}).Count(&count).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{"error": "INTERNAL_SERVER_ERROR", "message": err.Error()}
	}
	return http.StatusOK, tools.Object{"total_products": count}
}

func (analyticsRepository *AnalyticsRepository) ProductsBySales(count uint, asc bool) (int, tools.Object) {
	if count == 0 {
		count = 1
	}
	var results []struct {
		models.Item
		TotalSold uint        `json:"total_sold"`
	}

	sortOrder := "desc"
	if asc {
		sortOrder = "asc"
	}

	err := analyticsRepository.database.Model(&models.Purchase{}).
		Select("items.*, SUM(purchases.count) as total_sold").
		Joins("JOIN items ON purchases.item_id = items.id").
		Joins("JOIN orders ON purchases.order_id = orders.id").
		Where("orders.status = ?", "paid").
		Group("items.id").
		Order("total_sold " + sortOrder).
		Limit(int(count)).
		// Preload("ItemImages").  Example of preloading related data, adjust as needed
		Find(&results).Error

	if err != nil {
		return http.StatusInternalServerError, tools.Object{"error": "INTERNAL_SERVER_ERROR", "message": err.Error()}
	}

	products := make([]tools.Object, len(results))
	for i, result := range results {
		products[i] = tools.Object{
			"item":       result.Item,
			"total_sold": result.TotalSold,
		}
	}

	return http.StatusOK, tools.Object{
		"count":    count,
		"products": products,
	}
}

func (analyticsRepository *AnalyticsRepository) TotalOrders() (int, tools.Object) {
	var count int64
	err := analyticsRepository.database.Model(&models.Order{}).Count(&count).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{"error": "INTERNAL_SERVER_ERROR", "message": err.Error()}
	}
	return http.StatusOK, tools.Object{"total_orders": count}
}

func (analyticsRepository *AnalyticsRepository) OrdersByStatus() (int, tools.Object) {
	possibleStatuses := []string{"pendingAcceptance", "paid", "pendingPayment", "rejected", "accepted"}

	var result []struct {
		Status string `gorm:"column:status"`
		Count  int64  `gorm:"column:count"`
	}

	err := analyticsRepository.database.Model(&models.Order{}).
		Select("status, COUNT(*) as count").
		Group("status").
		Scan(&result).Error

	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": "Failed to fetch order counts",
		}
	}

	orderCounts := make(tools.Object)
	for _, entry := range result {
		orderCounts[entry.Status] = entry.Count
	}

	for _, status := range possibleStatuses {
		if _, exists := orderCounts[status]; !exists {
			orderCounts[status] = 0
		}
	}

	return http.StatusOK, orderCounts
}

func (analyticsRepository *AnalyticsRepository) OrderTrends(period string) (int, tools.Object) {
	var err error
	now := time.Now()
	database := analyticsRepository.database

	switch period {
	case "daily":
		weekday := int(now.Weekday())
		if weekday == 0 {
			weekday = 7
		}
		startOfWeek := now.Add(-time.Hour * 24 * time.Duration(weekday-1))
		endOfWeek := startOfWeek.Add(24 * time.Hour * 7)
		var dailyCounts []struct {
			Date  time.Time `gorm:"column:date"`
			Count int64     `gorm:"column:count"`
		}
		err = database.Model(&models.Order{}).
			Select("date(created_at) as date, count(*) as count").
			Where("created_at >= ? AND created_at < ?", startOfWeek, endOfWeek).
			Group("date(created_at)").
			Scan(&dailyCounts).Error

		if err != nil {
			return http.StatusInternalServerError, tools.Object{
				"error":   "INTERNAL_SERVER_ERROR",
				"message": err.Error(),
			}
		}

		return http.StatusOK, tools.Object{
			"period": period,
			"counts": dailyCounts,
		}

	case "weekly":
		startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, time.Local)
		endOfMonth := startOfMonth.AddDate(0, 1, 0)
		var weeklyCounts []struct {
			Week  int `gorm:"column:week"`
			Count int64 `gorm:"column:count"`
		}
		err = database.Model(&models.Order{}).
			Select("extract(week from created_at) as week, count(*) as count").
			Where("created_at >= ? AND created_at < ?", startOfMonth, endOfMonth).
			Group("extract(week from created_at)").
			Scan(&weeklyCounts).Error

		if err != nil {
			return http.StatusInternalServerError, tools.Object{
				"error":   "INTERNAL_SERVER_ERROR",
				"message": err.Error(),
			}
		}

		return http.StatusOK, tools.Object{
			"period": period,
			"counts": weeklyCounts,
		}

	case "monthly":
		startOfYear := time.Date(now.Year(), time.January, 1, 0, 0, 0, 0, time.Local)
		endOfYear := time.Date(now.Year()+1, time.January, 1, 0, 0, 0, 0, time.Local)
		var monthlyCounts []struct {
			Month int `gorm:"column:month"`
			Count int64 `gorm:"column:count"`
		}
		err = database.Model(&models.Order{}).
			Select("extract(month from created_at) as month, count(*) as count").
			Where("created_at >= ? AND created_at < ?", startOfYear, endOfYear).
			Group("extract(month from created_at)").
			Scan(&monthlyCounts).Error

		if err != nil {
			return http.StatusInternalServerError, tools.Object{
				"error":   "INTERNAL_SERVER_ERROR",
				"message": err.Error(),
			}
		}

		return http.StatusOK, tools.Object{
			"period": period,
			"counts": monthlyCounts,
		}

	default:
		return http.StatusBadRequest, tools.Object{
			"error": "PERIOD_UNDEFINED",
		}
	}
}

func (analyticsRepository *AnalyticsRepository) TotalRevenue() (int, tools.Object) {
	var totalRevenue *float64

	err := analyticsRepository.database.Model(&models.Purchase{}).
		Select("SUM(purchases.count * items.price)").
		Joins("JOIN orders ON purchases.order_id = orders.id").
		Joins("JOIN items ON purchases.item_id = items.id").
		Where("orders.status = ?", "paid").
		Row().
		Scan(&totalRevenue)
	if totalRevenue == nil {
		totalRevenue = new(float64)
		*totalRevenue = 0
	}
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"total_revenue": *totalRevenue,
		"currency": "dzd",
	}
}

func (analyticsRepository *AnalyticsRepository) TotalRegisteredUsers() (int, tools.Object) {
	var count int64
	err := analyticsRepository.database.Model(&models.User{}).Count(&count).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{"error": "INTERNAL_SERVER_ERROR", "message": err.Error()}
	}
	return http.StatusOK, tools.Object{"total_registered_users": count}
}

func (analyticsRepository *AnalyticsRepository) NewUsers(period string) (int, tools.Object) {
	var err error
	now := time.Now()
	database := analyticsRepository.database

	switch period {
	case "daily":
		weekday := int(now.Weekday())
		if weekday == 0 {
			weekday = 7
		}
		startOfWeek := now.Add(-time.Hour * 24 * time.Duration(weekday-1))
		endOfWeek := startOfWeek.Add(24 * time.Hour * 7)
		var dailyCounts []struct {
			Date  time.Time `gorm:"column:date"`
			Count int64     `gorm:"column:count"`
		}
		err = database.Model(&models.User{}).
			Select("date(created_at) as date, count(*) as count").
			Where("created_at >= ? AND created_at < ?", startOfWeek, endOfWeek).
			Group("date(created_at)").
			Scan(&dailyCounts).Error

		if err != nil {
			return http.StatusInternalServerError, tools.Object{
				"error": "INTERNAL_SERVER_ERROR",
				"message": err.Error(),
			}
		}

		return http.StatusOK, tools.Object{
			"period":  period,
			"counts": dailyCounts,
		}

	case "weekly":
		startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, time.Local)
		endOfMonth := startOfMonth.AddDate(0, 1, 0)
		var weeklyCounts []struct {
			Week  int `gorm:"column:week"`
			Count int64 `gorm:"column:count"`
		}
		err = database.Model(&models.User{}).
			Select("extract(week from created_at) as week, count(*) as count").
			Where("created_at >= ? AND created_at < ?", startOfMonth, endOfMonth).
			Group("extract(week from created_at)").
			Scan(&weeklyCounts).Error

		if err != nil {
			return http.StatusInternalServerError, tools.Object{
				"error": "INTERNAL_SERVER_ERROR",
				"message": err.Error(),
			}
		}

		return http.StatusOK, tools.Object{
			"period":  period,
			"counts": weeklyCounts,
		}

	case "monthly":
		startOfYear := time.Date(now.Year(), time.January, 1, 0, 0, 0, 0, time.Local)
		endOfYear := time.Date(now.Year()+1, time.January, 1, 0, 0, 0, 0, time.Local)
		var monthlyCounts []struct {
			Month int `gorm:"column:month"`
			Count int64 `gorm:"column:count"`
		}
		err = database.Model(&models.User{}).
			Select("extract(month from created_at) as month, count(*) as count").
			Where("created_at >= ? AND created_at < ?", startOfYear, endOfYear).
			Group("extract(month from created_at)").
			Scan(&monthlyCounts).Error

		if err != nil {
			return http.StatusInternalServerError, tools.Object{
				"error": "INTERNAL_SERVER_ERROR",
				"message": err.Error(),
			}
		}

		return http.StatusOK, tools.Object{
			"period":  period,
			"counts": monthlyCounts,
		}

	default:
		return http.StatusBadRequest, tools.Object{
			"error": "PERIOD_INDEFINED",
		}
	}
}

func (analyticsRepository *AnalyticsRepository) ActiveUsers(totalDays int, count uint) (int, tools.Object) {
	if totalDays <= 0 {
		return http.StatusBadRequest, tools.Object{"error": "UNDEFINED_TOTAL_DAYS"}
	}
	if count == 0 {
		return http.StatusBadRequest, tools.Object{"error": "UNDEFINED_COUNT"}
	}

	// Subquery for counting orders
	subOrderQuery := analyticsRepository.database.
		Table("orders").
		Select("user_id, COUNT(orders.id) as order_count").
		Where("status = 'paid' AND updated_at >= ?", time.Now().AddDate(0, 0, -totalDays)).
		Group("user_id")

	// Subquery for counting reviews
	subReviewQuery := analyticsRepository.database.
		Table("reviews").
		Select("user_id, COUNT(reviews.id) as review_count").
		Where("created_at >= ?", time.Now().AddDate(0, 0, -totalDays)).
		Group("user_id")

	var results []struct {
		UserID      uint        `json:"user_id"`
		models.User
		OrderCount  int64       `json:"order_count"`
		ReviewCount int64       `json:"review_count"`
	}

	// Main query to fetch users and their activity
	err := analyticsRepository.database.
		Table("users").
		Select("users.id as user_id, users.*, COALESCE(sub_order.order_count, 0) as order_count, COALESCE(sub_review.review_count, 0) as review_count").
		Joins("LEFT JOIN (?) as sub_order ON sub_order.user_id = users.id", subOrderQuery).
		Joins("LEFT JOIN (?) as sub_review ON sub_review.user_id = users.id", subReviewQuery).
		Order("order_count DESC, review_count DESC").
		Limit(int(count)).
		Find(&results).Error

	if err != nil {
		return http.StatusInternalServerError, tools.Object{"error": "INTERNAL_SERVER_ERROR", "message": err.Error()}
	}

	// Preparing final response
	activeUsers := make([]tools.Object, len(results))
	for i, activity := range results {
		activeUsers[i] = tools.Object{
			"user_id":      activity.UserID,
			"user": tools.Object{
				"id":         activity.User.ID,
				"user":      activity.User,
			},
			"order_count":  activity.OrderCount,
			"review_count": activity.ReviewCount,
		}
	}

	return http.StatusOK, tools.Object{
		"total_days":   totalDays,
		"count":        count,
		"active_users": activeUsers,
	}
}

func (analyticsRepository *AnalyticsRepository) AverageProductRating() (int, tools.Object) {
	var avgRating *float64

	err := analyticsRepository.database.Model(&models.Item{}).
		Select("AVG(rate)").
		Row().
		Scan(&avgRating)
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}

	if avgRating == nil {
		avgRating = new(float64)
		*avgRating = 0
	}

	return http.StatusOK, tools.Object{
		"average_product_rating": *avgRating,
	}
}