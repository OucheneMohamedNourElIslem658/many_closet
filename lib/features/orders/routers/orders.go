package orders

import (
	"net/http"

	authMiddlewares "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/auth/middlewares"
	ordersControllers "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/orders/controllers"
	tools "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/tools"
)

type OrdersRouter struct {
	Router           *http.ServeMux
	ordersController *ordersControllers.OrdersController
	authMiddlewares  *authMiddlewares.AuthMiddlewares
}

func NewOrdersRouter() *OrdersRouter {
	return &OrdersRouter{
		Router:           http.NewServeMux(),
		ordersController: ordersControllers.NewOrdersController(),
		authMiddlewares:  authMiddlewares.NewAuthMiddlewares(),
	}
}

func (ordersRouter *OrdersRouter) RegisterRoutes() {
	router := ordersRouter.Router
	ordersController := ordersRouter.ordersController
	authMiddlewares := ordersRouter.authMiddlewares



	authorizationWithEmailVerification := tools.MiddlewareChain(
		authMiddlewares.Authorization,
		authMiddlewares.AuthorizationWithEmailVerification,
	)

	authorizationWithAdminCheck := tools.MiddlewareChain(
		authMiddlewares.Authorization,
		authMiddlewares.AuthorizationWithEmailVerification,
		authMiddlewares.AuthorizationWithAdminCheck,
	)

	router.HandleFunc("GET /search", authorizationWithEmailVerification(http.HandlerFunc(ordersController.GetOrders)))
	router.HandleFunc("GET /{id}", authorizationWithEmailVerification(http.HandlerFunc(ordersController.GetOrder)))
	router.HandleFunc("POST /create", authorizationWithEmailVerification(http.HandlerFunc(ordersController.CreateOrder)))
	router.HandleFunc("PUT /accept/{id}", authorizationWithAdminCheck(http.HandlerFunc(ordersController.AcceptOrder)))
	router.HandleFunc("PUT /reject/{id}", authorizationWithAdminCheck(http.HandlerFunc(ordersController.RejectOrder)))
	router.HandleFunc("DELETE /delete/{id}", authorizationWithEmailVerification(http.HandlerFunc(ordersController.DeleteOrder)))
	router.HandleFunc("POST /sendPaymentURL/{id}", authorizationWithAdminCheck(http.HandlerFunc(ordersController.SendPaymentURL)))
	router.HandleFunc("PUT /expirePaymentURL/{id}", authorizationWithAdminCheck(http.HandlerFunc(ordersController.ExpirePaymentURL)))
	router.HandleFunc("POST /paymentWebhook", ordersController.PaymentWebhook)
}
