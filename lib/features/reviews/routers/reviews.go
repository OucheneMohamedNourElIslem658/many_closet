package reviews

import (
	"net/http"

	authMiddlewares "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/auth/middlewares"
	reviewsControllers "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/reviews/controllers"
	tools "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/tools"
)

type ReviewsRouter struct {
	Router            *http.ServeMux
	reviewsController *reviewsControllers.ReviewsController
	authMiddlewares   *authMiddlewares.AuthMiddlewares
}

func NewReviewsRouter() *ReviewsRouter {
	return &ReviewsRouter{
		Router:            http.NewServeMux(),
		reviewsController: reviewsControllers.NewReviewsController(),
		authMiddlewares:   authMiddlewares.NewAuthMiddlewares(),
	}
}

func (reviewsRouter *ReviewsRouter) RegisterRoutes() {
	router := reviewsRouter.Router
	reviewsController := reviewsRouter.reviewsController
	authMiddlewares := reviewsRouter.authMiddlewares

	authorizationWithEmailVerification := tools.MiddlewareChain(
		authMiddlewares.Authorization,
		authMiddlewares.AuthorizationWithEmailVerification,
	)

	router.HandleFunc("GET /{id}", authorizationWithEmailVerification(http.HandlerFunc(reviewsController.GetReview)))
	router.HandleFunc("GET /search", authorizationWithEmailVerification(http.HandlerFunc(reviewsController.GetReviews)))
	router.HandleFunc("GET /create", authorizationWithEmailVerification(http.HandlerFunc(reviewsController.CreateReview)))
	router.HandleFunc("DELETE /delete/{id}", authorizationWithEmailVerification(http.HandlerFunc(reviewsController.DeleteReview)))
	router.HandleFunc("PUT /update/{id}", authorizationWithEmailVerification(http.HandlerFunc(reviewsController.UpdateReview)))
}
