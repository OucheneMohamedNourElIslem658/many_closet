package users

import (
	"net/http"

	authMiddlewares "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/auth/middlewares"
	usersController "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/users/controllers"
	tools "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/tools"
)

type UsersRouter struct {
	Router          *http.ServeMux
	usersController *usersController.UsersController
	authMiddlewares *authMiddlewares.AuthMiddlewares
}

func NewUsersRouter() *UsersRouter {
	return &UsersRouter{
		Router:          http.NewServeMux(),
		usersController: usersController.NewUsersController(),
		authMiddlewares: authMiddlewares.NewAuthMiddlewares(),
	}
}

func (usersRouter *UsersRouter) RegisterRoutes() {
	router := usersRouter.Router
	usersController := usersRouter.usersController
	authMiddlewares := usersRouter.authMiddlewares

	authorizationWithEmailVerification := tools.MiddlewareChain(
		authMiddlewares.Authorization,
		authMiddlewares.AuthorizationWithEmailVerification,
	)

	authorizationWithAdminCheck := tools.MiddlewareChain(
		authMiddlewares.Authorization,
		authMiddlewares.AuthorizationWithEmailVerification,
		authMiddlewares.AuthorizationWithAdminCheck,
	)

	router.Handle("GET /search", authorizationWithAdminCheck(http.HandlerFunc(usersController.GetUsers)))
	router.Handle("GET /{id}", authorizationWithAdminCheck(http.HandlerFunc(usersController.GetUser)))
	router.Handle("DELETE /delete/{id}", authorizationWithAdminCheck(http.HandlerFunc(usersController.DeleteUser)))
	router.Handle("PUT /update/{id}", authorizationWithAdminCheck(http.HandlerFunc(usersController.UpdateUser)))

	profileRouter := http.NewServeMux()
	router.Handle("GET /profile", authorizationWithEmailVerification(http.HandlerFunc(usersController.GetProfile)))
	profileRouter.Handle("PUT /", authorizationWithEmailVerification(http.HandlerFunc(usersController.UpdateProfile)))
	router.Handle("/profile/", http.StripPrefix("/profile", profileRouter))
}
