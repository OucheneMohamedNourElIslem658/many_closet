package customoauth

import (
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/facebook"
	"golang.org/x/oauth2/github"
	"golang.org/x/oauth2/google"
	"golang.org/x/oauth2/microsoft"

)

type Provider struct {
	Config     *oauth2.Config
	UserInfoURL string
	EmailInfoURL string
}

type Providers map[string]Provider

var Instance Providers

func Init() {
	Instance = Providers{
		"google": {
			Config: &oauth2.Config{
				ClientID:     envs.googleClientID,
				ClientSecret: envs.googleClientSecret,
				RedirectURL:  envs.callbackURL,
				Scopes:       []string{"https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"},
				Endpoint:     google.Endpoint,
			},
			UserInfoURL: "https://www.googleapis.com/oauth2/v2/userinfo?alt=json",
		},
		"github": {
			Config: &oauth2.Config{
				ClientID:     envs.githubClientID,
				ClientSecret: envs.githubClientSecret,
				RedirectURL:  "http://localhost:8000/api/v1/users/auth/oauth/github/callback",
				Scopes:       []string{"read:user", "user:email"},
				Endpoint:     github.Endpoint,
			},
			UserInfoURL: "https://api.github.com/user",
			EmailInfoURL: "https://api.github.com/user/emails",
		},
		"facebook": {
			Config: &oauth2.Config{
				ClientID:     envs.facebookClientID,
				ClientSecret: envs.facebookClientSecret,
				RedirectURL:  "http://localhost:8000/api/v1/users/auth/oauth/facebook/callback",
				Scopes:       []string{"public_profile", "email"},
				Endpoint:     facebook.Endpoint,
			},
			UserInfoURL: "https://graph.facebook.com/me?fields=id,name,email",
		},
		"microsoft": {
			Config: &oauth2.Config{
				ClientID:     envs.microsoftClientID,
				ClientSecret: envs.microsoftClientSecret,
				RedirectURL:  "http://localhost:8000/api/v1/users/auth/oauth/microsoft/callback",
				Scopes:       []string{"User.Read"},
				Endpoint:     microsoft.AzureADEndpoint("common"),
			},
			UserInfoURL: "https://graph.microsoft.com/v1.0/me",
		},
	}
}

func IsSupportedProvider(provider string) bool {
	_, exists := Instance[provider]
	return exists
}
