package auth

import (
	"context"
	"encoding/json"
	"net/http"

	authRepositories "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/auth/repositories"
	"github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/tools"
)

type AuthMiddlewares struct {
	authRepo *authRepositories.AuthRepository
}

func NewAuthMiddlewares() *AuthMiddlewares {
	return &AuthMiddlewares{
		authRepo: authRepositories.NewAuthRepository(),
	}
}

func (authMiddlewares *AuthMiddlewares) Authorization(next http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authorization := r.Header.Get("Authorization")
		authRepo := authMiddlewares.authRepo

		status, result := authRepo.Authorization(authorization)
		if status == http.StatusOK {
			context := context.WithValue(r.Context(), "auth", result)
			r = r.WithContext(context)
			next.ServeHTTP(w, r)
			return
		}

		w.WriteHeader(status)
		reponse, _ := json.Marshal(result)
		w.Write(reponse)
	}
}

func (authMiddlewares *AuthMiddlewares) AuthorizationWithEmailVerification(next http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authRepo := authMiddlewares.authRepo
		auth, _ := r.Context().Value("auth").(tools.Object)
		emailVerified := auth["emailVerified"].(bool)
		status, result := authRepo.AuthorizationWithEmailVerification(emailVerified)

		if status == http.StatusOK {
			next.ServeHTTP(w, r)
			return
		}

		w.WriteHeader(status)
		reponse, _ := json.Marshal(result)
		w.Write(reponse)
	}
}

func (authMiddlewares *AuthMiddlewares) AuthorizationWithAdminCheck(next http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authRepo := authMiddlewares.authRepo
		auth, _ := r.Context().Value("auth").(tools.Object)
		emailVerified := auth["isAdmin"].(bool)
		status, result := authRepo.AuthorizationWithAdminCheck(emailVerified)

		if status == http.StatusOK {
			next.ServeHTTP(w, r)
			return
		}

		w.WriteHeader(status)
		reponse, _ := json.Marshal(result)
		w.Write(reponse)
	}
}
