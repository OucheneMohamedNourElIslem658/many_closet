package hooks

import notificationsRepositories "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/notifications/repositories"

var notificationsRepository notificationsRepositories.NotificationsRepository

func RegisterHooks() {
	notificationsRepository = *notificationsRepositories.NewNotificationsRepository()

	registerUserHooks()
	registerOrderHooks()
	registerReviewHooks()
	registerItemHooks()
	registerNotificationHooks()
}