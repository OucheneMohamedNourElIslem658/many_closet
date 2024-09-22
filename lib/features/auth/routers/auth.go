package auth

import (
	"net/http"

	authControllers "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/auth/controllers"
	authMiddlewares "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/auth/middlewares"
)

type AuthRouter struct {
	Router          *http.ServeMux
	authController  *authControllers.AuthController
	authMiddlewares *authMiddlewares.AuthMiddlewares
}

func NewAuthRouter() *AuthRouter {
	return &AuthRouter{
		Router:          http.NewServeMux(),
		authController:  authControllers.Newcontroller(),
		authMiddlewares: authMiddlewares.NewAuthMiddlewares(),
	}
}

func (authRouter *AuthRouter) RegisterRoutes() {
	router := authRouter.Router
	authController := authRouter.authController

	router.HandleFunc("POST /registerWithEmailAndPassword", authController.RegisterWithEmailAndPassword)
	router.HandleFunc("POST /loginWithEmailAndPassword", authController.LoginWithEmailAndPassword)
	router.HandleFunc("POST /sendEmailVerificationLink", authController.SendEmailVerificationLink)
	router.HandleFunc("GET /serveEmailVerificationTemplate/{idToken}", authController.ServeEmailVerificationTemplate)
	router.HandleFunc("GET /verifyEmail/{idToken}", authController.VerifyEmail)
	router.HandleFunc("POST /sendPasswordResetLink", authController.SendPasswordResetLink)
	router.HandleFunc("GET /serveResetPasswordForm/{idToken}", authController.ServeResetPasswordForm)
	router.HandleFunc("POST /resetPassword/{idToken}", authController.ResetPassword)
	router.HandleFunc("GET /oauth/{provider}", authController.OAuth)
	router.HandleFunc("GET /oauth/{provider}/callback", authController.OAuthCallback)
}
