package email

import (
	"os"

	"github.com/joho/godotenv"
)

type config struct {
	email     string
	password string
}

var mailerConfig = initAPI()

func initAPI() config {
	godotenv.Load()
	return config{
		email:     os.Getenv("EMAIL"),
		password: os.Getenv("PASSWORD"),
	}
}