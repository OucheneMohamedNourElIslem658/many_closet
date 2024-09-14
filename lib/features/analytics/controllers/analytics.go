package analytics

import (
	"net/http"

	analyticsRepositories "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/analytics/repositories"
	analyticsSockets "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/analytics/sockets"
)

type AnalyticsController struct {
	analyticsRepository *analyticsRepositories.AnalyticsRepository
	analyticsSocket     *analyticsSockets.AnalyticsSocketManager
}

func NewAnalyticsController() *AnalyticsController {
	analyticsSockets.Init()
	return &AnalyticsController{
		analyticsRepository: analyticsRepositories.NewAnalyticsRepository(),
		analyticsSocket:     analyticsSockets.Instance,
	}
}

func (analyticsController *AnalyticsController) TotalProductsSocket(w http.ResponseWriter, r *http.Request) {
	analyticsController.analyticsSocket.TotalProductsSocket.HandleRequest(w, r)
}

func (analyticsController *AnalyticsController) ProductsBySalesSocket(w http.ResponseWriter, r *http.Request) {
	analyticsController.analyticsSocket.ProductsBySalesSocket.HandleRequest(w, r)
}

func (analyticsController *AnalyticsController) TotalOrdersSocket(w http.ResponseWriter, r *http.Request) {
	analyticsController.analyticsSocket.TotalOrdersSocket.HandleRequest(w, r)
}

func (analyticsController *AnalyticsController) OrdersByStatusSocket(w http.ResponseWriter, r *http.Request) {
	analyticsController.analyticsSocket.OrdersByStatusSocket.HandleRequest(w, r)
}

func (analyticsController *AnalyticsController) OrderTrendsSocket(w http.ResponseWriter, r *http.Request) {
	analyticsController.analyticsSocket.OrderTrendsSocket.HandleRequest(w, r)
}

func (analyticsController *AnalyticsController) TotalRevenueSocket(w http.ResponseWriter, r *http.Request) {
	analyticsController.analyticsSocket.TotalRevenueSocket.HandleRequest(w, r)
}

func (analyticsController *AnalyticsController) TotalRegisteredUsersSocket(w http.ResponseWriter, r *http.Request) {
	analyticsController.analyticsSocket.TotalRegisteredUsersSocket.HandleRequest(w, r)
}

func (analyticsController *AnalyticsController) NewUsersSocket(w http.ResponseWriter, r *http.Request) {
	analyticsController.analyticsSocket.NewUsersSocket.HandleRequest(w, r)
}

func (analyticsController *AnalyticsController) ActiveUsersSocket(w http.ResponseWriter, r *http.Request) {
	analyticsController.analyticsSocket.ActiveUsersSocket.HandleRequest(w, r)
}