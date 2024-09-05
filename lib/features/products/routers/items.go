package products

import (
	"net/http"

	authMiddlewares "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/auth/middlewares"
	productsControllers "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/products/controllers"
	tools "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/tools"
)

type ProductsRouter struct {
	Router             *http.ServeMux
	productsController *productsControllers.ProductsController
	authMiddlewares    *authMiddlewares.AuthMiddlewares
}

func NewProductsRouter() *ProductsRouter {
	return &ProductsRouter{
		Router:             http.NewServeMux(),
		productsController: productsControllers.NewproductsController(),
		authMiddlewares:    authMiddlewares.NewAuthMiddlewares(),
	}
}

func (productsRouter *ProductsRouter) RegisterRoutes() {
	router := productsRouter.Router
	productsController := productsRouter.productsController
	authMiddlewares := productsRouter.authMiddlewares

	authorizationWithAdminCheck := tools.MiddlewareChain(
		authMiddlewares.Authorization,
		authMiddlewares.AuthorizationWithEmailVerification,
		authMiddlewares.AuthorizationWithAdminCheck,
	)

	authorizationWithEmailVerification := tools.MiddlewareChain(
		authMiddlewares.Authorization,
		authMiddlewares.AuthorizationWithEmailVerification,
	)

	collectionsRouter := http.NewServeMux()
	collectionsRouter.Handle("GET /search", authorizationWithEmailVerification(http.HandlerFunc(productsController.GetCollections)))
	collectionsRouter.HandleFunc("POST /create", authorizationWithAdminCheck(http.HandlerFunc(productsController.CreateCollection)))
	collectionsRouter.HandleFunc("PUT /update/{id}", authorizationWithAdminCheck(http.HandlerFunc(productsController.UpdateCollection)))
	collectionsRouter.HandleFunc("DELETE /delete/{id}", authorizationWithAdminCheck(http.HandlerFunc(productsController.DeleteCollection)))
	router.Handle("/collections/", http.StripPrefix("/collections", collectionsRouter))

	colorsRouter := http.NewServeMux()
	colorsRouter.HandleFunc("GET /search", authorizationWithEmailVerification(http.HandlerFunc(productsController.GetColors)))
	colorsRouter.HandleFunc("POST /create", authorizationWithAdminCheck(http.HandlerFunc(productsController.CreateColor)))
	colorsRouter.HandleFunc("PUT /update/{id}", authorizationWithAdminCheck(http.HandlerFunc(productsController.UpdateColor)))
	colorsRouter.HandleFunc("DELETE /delete/{id}", authorizationWithAdminCheck(http.HandlerFunc(productsController.DeleteColor)))
	router.Handle("/colors/", http.StripPrefix("/colors", colorsRouter))

	taillesRouter := http.NewServeMux()
	taillesRouter.HandleFunc("GET /search", authorizationWithEmailVerification(http.HandlerFunc(productsController.GetTailles)))
	taillesRouter.HandleFunc("POST /create", authorizationWithAdminCheck(http.HandlerFunc(productsController.CreateTaille)))
	taillesRouter.HandleFunc("PUT /update/{id}", authorizationWithAdminCheck(http.HandlerFunc(productsController.UpdateTaille)))
	taillesRouter.HandleFunc("DELETE /delete/{id}", authorizationWithAdminCheck(http.HandlerFunc(productsController.DeleteTaille)))
	router.Handle("/tailles/", http.StripPrefix("/tailles", taillesRouter))

	itemsRouter := http.NewServeMux()
	itemsRouter.HandleFunc("GET /search", authorizationWithEmailVerification(http.HandlerFunc(productsController.GetItems)))
	itemsRouter.HandleFunc("GET /{id}", authorizationWithEmailVerification(http.HandlerFunc(productsController.GetItem)))
	itemsRouter.HandleFunc("POST /create", authorizationWithAdminCheck(http.HandlerFunc(productsController.CreateItem)))
	itemsRouter.HandleFunc("PUT /update/{id}", authorizationWithAdminCheck(http.HandlerFunc(productsController.UpdateItem)))
	router.Handle("/items/", http.StripPrefix("/items", itemsRouter))
}
