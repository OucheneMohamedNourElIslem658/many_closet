package notifications

import (
	"net/http"

	authMiddlewares "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/auth/middlewares"
	notificationsControllers "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/notifications/controllers"
	tools "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/tools"
)

type NotificationsRouter struct {
	Router                  *http.ServeMux
	notificationsController *notificationsControllers.NotificationsController
	authMiddlewares         *authMiddlewares.AuthMiddlewares
}

func NewNotificationsRouter() *NotificationsRouter {
	return &NotificationsRouter{
		Router:                  http.NewServeMux(),
		notificationsController: notificationsControllers.NewNotificationsController(),
		authMiddlewares:         authMiddlewares.NewAuthMiddlewares(),
	}
}

func (notificationsRouter *NotificationsRouter) RegisterRoutes() {
	router := notificationsRouter.Router
	notificationsController := notificationsRouter.notificationsController
	authMiddlewares := notificationsRouter.authMiddlewares

	authorizationWithEmailVerification := tools.MiddlewareChain(
		authMiddlewares.Authorization,
		authMiddlewares.AuthorizationWithEmailVerification,
	)

	// authorizationWithAdminCheck := tools.MiddlewareChain(
	// 	authMiddlewares.Authorization,
	// 	authMiddlewares.AuthorizationWithEmailVerification,
	// 	authMiddlewares.AuthorizationWithAdminCheck,
	// )

	socketsRouter := http.NewServeMux()
	socketsRouter.HandleFunc("GET /orders", authorizationWithEmailVerification(http.HandlerFunc(notificationsController.GetOrderNotifications)))
	socketsRouter.HandleFunc("GET /items", authorizationWithEmailVerification(http.HandlerFunc(notificationsController.GetItemNotifications)))
	socketsRouter.HandleFunc("GET /reviews", authorizationWithEmailVerification(http.HandlerFunc(notificationsController.GetReviewNotifications)))
	router.Handle("/sockets/", http.StripPrefix("/sockets", socketsRouter))

	router.HandleFunc("PUT /update/{id}", authorizationWithEmailVerification(http.HandlerFunc(notificationsController.UpdateNotification)))
	router.HandleFunc("DELETE /delete/{id}", authorizationWithEmailVerification(http.HandlerFunc(notificationsController.DeleteNotification)))
}