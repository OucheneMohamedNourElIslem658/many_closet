package main

import (
	hooks "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/hooks"
	chargily "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/chargily"
	customoauth "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/custom_oauth"
	database "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/database"
	email "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/email"
	filestorage "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/file_storage"
)

func init() {
	customoauth.Init()
	database.Init()
	email.Init()
	chargily.Init()
	filestorage.Init()

	hooks.RegisterHooks()
}

func main() {
	server := NewServer("127.0.0.1:8000")
	server.RunServer()
}
