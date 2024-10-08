package main

import (
	"fmt"
	"net/http"

	analyticsRouters "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/analytics/routers"
	authRouters "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/auth/routers"
	notificationsRouters "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/notifications/routers"
	ordersRouters "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/orders/routers"
	productsRouters "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/products/routers"
	reviewsRouters "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/reviews/routers"
	usersRouters "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/users/routers"
	"github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/tools"
)

type Server struct {
	address string
}

func NewServer(address string) *Server {
	return &Server{
		address: address,
	}
}

func (server *Server) RunServer() {
	mainRouter := http.NewServeMux()

	v1 := http.NewServeMux()
	mainRouter.Handle("/api/v1/", http.StripPrefix("/api/v1", v1))

	v1.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.Error(w, "404 page not found", http.StatusNotFound)
			return
		}

		greeting := "<b> Welcome To Many_Closet API V1 </b>"
		w.Write([]byte(greeting))
	})

	usersRouter := usersRouters.NewUsersRouter()
	v1.Handle("/users/", http.StripPrefix("/users", usersRouter.Router))
	usersRouter.RegisterRoutes()

	authRouter := authRouters.NewAuthRouter()
	usersRouter.Router.Handle("/auth/", http.StripPrefix("/auth", authRouter.Router))
	authRouter.RegisterRoutes()

	productsRouter := productsRouters.NewProductsRouter()
	v1.Handle("/products/", http.StripPrefix("/products", productsRouter.Router))
	productsRouter.RegisterRoutes()

	reviewsRouter := reviewsRouters.NewReviewsRouter()
	v1.Handle("/reviews/", http.StripPrefix("/reviews", reviewsRouter.Router))
	reviewsRouter.RegisterRoutes()

	ordersRouter := ordersRouters.NewOrdersRouter()
	v1.Handle("/orders/", http.StripPrefix("/orders", ordersRouter.Router))
	ordersRouter.RegisterRoutes()

	analyticsRouter := analyticsRouters.NewAnalyticsRouter()
	v1.Handle("/analytics/", http.StripPrefix("/analytics", analyticsRouter.Router))
	analyticsRouter.RegisterRoutes()

	notificationsRouter := notificationsRouters.NewNotificationsRouter()
	v1.Handle("/notifications/", http.StripPrefix("/notifications", notificationsRouter.Router))
	notificationsRouter.RegisterRoutes()

	logger := tools.Logger(mainRouter)

	fmt.Printf("Listening and serving at %v\n", "http://"+server.address+"/api/v1/")
	err := http.ListenAndServe(server.address, logger)
	if err != nil {
		panic(err)
	}
}
