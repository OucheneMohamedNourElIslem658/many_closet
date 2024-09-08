package main

import (
	chargily "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/chargily"
	database "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/database"
	email "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/email"
)

func init() {
	database.Init()
	email.Init()
	chargily.Init()
}

func main() {
	server := NewServer("127.0.0.1:8000")
	server.RunServer()
}
