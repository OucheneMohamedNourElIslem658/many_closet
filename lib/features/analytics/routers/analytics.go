package analytics

import (
	"net/http"

	analyticsControllers "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/analytics/controllers"
	authMiddlewares "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/auth/middlewares"
	tools "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/tools"
)

type AnalyticsRouter struct {
	Router              *http.ServeMux
	analyticsController *analyticsControllers.AnalyticsController
	authMiddlewares     *authMiddlewares.AuthMiddlewares
}

func NewAnalyticsRouter() *AnalyticsRouter {
	return &AnalyticsRouter{
		Router:              http.NewServeMux(),
		analyticsController: analyticsControllers.NewAnalyticsController(),
		authMiddlewares:     authMiddlewares.NewAuthMiddlewares(),
	}
}

func (analyticsRouter *AnalyticsRouter) RegisterRoutes() {
	router := analyticsRouter.Router
	analyticsController := analyticsRouter.analyticsController
	authMiddlewares := analyticsRouter.authMiddlewares

	// authorizationWithEmailVerification := tools.MiddlewareChain(
	// 	authMiddlewares.Authorization,
	// 	authMiddlewares.AuthorizationWithEmailVerification,
	// )

	authorizationWithAdminCheck := tools.MiddlewareChain(
		authMiddlewares.Authorization,
		authMiddlewares.AuthorizationWithEmailVerification,
		authMiddlewares.AuthorizationWithAdminCheck,
	)

	socketsRouter := http.NewServeMux()
	socketsRouter.HandleFunc("GET /totalRegisteredUsers", authorizationWithAdminCheck(http.HandlerFunc(analyticsController.TotalRegisteredUsersSocket)))
	socketsRouter.HandleFunc("GET /newUsers", authorizationWithAdminCheck(http.HandlerFunc(analyticsController.NewUsersSocket)))
	socketsRouter.HandleFunc("GET /activeUsers", authorizationWithAdminCheck(http.HandlerFunc(analyticsController.ActiveUsersSocket)))
	socketsRouter.HandleFunc("GET /totalOrders", authorizationWithAdminCheck(http.HandlerFunc(analyticsController.TotalOrdersSocket)))
	socketsRouter.HandleFunc("GET /totalRevenue", authorizationWithAdminCheck(http.HandlerFunc(analyticsController.TotalRevenueSocket)))
	socketsRouter.HandleFunc("GET /orderTrends", authorizationWithAdminCheck(http.HandlerFunc(analyticsController.OrderTrendsSocket)))
	socketsRouter.HandleFunc("GET /ordersByStatus", authorizationWithAdminCheck(http.HandlerFunc(analyticsController.OrdersByStatusSocket)))
	socketsRouter.HandleFunc("GET /totalProductsSocket", authorizationWithAdminCheck(http.HandlerFunc(analyticsController.TotalProductsSocket)))
	socketsRouter.HandleFunc("GET /productsBySalesSocket", authorizationWithAdminCheck(http.HandlerFunc(analyticsController.ProductsBySalesSocket)))
	router.Handle("/sockets/", http.StripPrefix("/sockets", socketsRouter))
}
