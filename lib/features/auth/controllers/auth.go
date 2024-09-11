package auth

import (
	"encoding/json"
	"fmt"
	"net/http"
	"path/filepath"

	authRepositories "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/auth/repositories"
	models "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/models"
	tools "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/tools"
)

type AuthController struct {
	authRepository *authRepositories.AuthRepository
}

func Newcontroller() *AuthController {
	return &AuthController{
		authRepository: authRepositories.NewAuthRepository(),
	}
}

func (authcontroller *AuthController) RegisterWithEmailAndPassword(w http.ResponseWriter, r *http.Request) {
	var user models.User
	json.Unmarshal([]byte(r.FormValue("user")), &user)

	var status int
	var result tools.Object

	profileImage, _, _ := r.FormFile("image")

	authRepository := authcontroller.authRepository
	status, result = authRepository.RegisterWithEmailAndPassword(user, profileImage)

	w.WriteHeader(status)
	reponse, _ := json.Marshal(result)
	w.Write(reponse)
}

func (authcontroller *AuthController) LoginWithEmailAndPassword(w http.ResponseWriter, r *http.Request) {
	var user models.User
	json.NewDecoder(r.Body).Decode(&user)

	authRepository := authcontroller.authRepository
	status, result := authRepository.LoginWithEmailAndPassword(user)

	if status == http.StatusOK {
		idTokenCookie := &http.Cookie{
			Name:     "idToken",
			Value:    result["idToken"].(string),
			HttpOnly: true,
		}
		http.SetCookie(w, idTokenCookie)
		w.WriteHeader(status)
		return
	}
	w.WriteHeader(status)
	reponse, _ := json.Marshal(result)
	w.Write(reponse)
}

func (authcontroller *AuthController) SendEmailVerificationLink(w http.ResponseWriter, r *http.Request) {
	var body tools.Object
	json.NewDecoder(r.Body).Decode(&body)

	authRepository := authcontroller.authRepository

	email := body["email"].(string)
	hostURL := "http://" + r.Host + "/api/v1/users/auth/serveEmailVerificationTemplate"
	status, result := authRepository.SendEmailVerificationLink(email, hostURL)

	w.WriteHeader(status)
	reponse, _ := json.Marshal(result)
	w.Write(reponse)
}

func (authcontroller *AuthController) VerifyEmail(w http.ResponseWriter, r *http.Request) {
	var body tools.Object
	json.NewDecoder(r.Body).Decode(&body)

	authRepository := authcontroller.authRepository

	idToken := r.PathValue("idToken")
	authorization := fmt.Sprintf("Bearer %v", idToken)
	status, result := authRepository.Authorization(authorization)

	if status == http.StatusOK {
		email := result["email"].(string)
		status, result = authRepository.VerifyEmail(email)
	}

	w.WriteHeader(status)
	reponse, _ := json.Marshal(result)
	w.Write(reponse)
}

func (authcontroller *AuthController) SendPasswordResetLink(w http.ResponseWriter, r *http.Request) {
	var body tools.Object
	json.NewDecoder(r.Body).Decode(&body)

	authRepository := authcontroller.authRepository

	email := body["email"].(string)
	hostURL := "http://" + r.Host + "/api/v1/users/auth/serveResetPasswordForm"
	status, result := authRepository.SendPasswordResetLink(email, hostURL)

	w.WriteHeader(status)
	reponse, _ := json.Marshal(result)
	w.Write(reponse)
}

func (authcontroller *AuthController) ResetPassword(w http.ResponseWriter, r *http.Request) {
	var body tools.Object
	json.NewDecoder(r.Body).Decode(&body)

	authRepository := authcontroller.authRepository

	idToken := r.PathValue("idToken")
	authorization := fmt.Sprintf("Bearer %v", idToken)
	status, result := authRepository.Authorization(authorization)

	if status == http.StatusOK {
		email := result["email"].(string)
		newPassword := body["newPassword"].(string)
		status, result = authRepository.ResetPassword(email, newPassword)
	}

	w.WriteHeader(status)
	reponse, _ := json.Marshal(result)
	w.Write(reponse)
}

func (authcontroller *AuthController) ServeResetPasswordForm(w http.ResponseWriter, r *http.Request) {
	formPath, err := filepath.Abs("./features/auth/views/reset_password_form.html")
	if err != nil {
		http.Error(w, "ERROR_FINDING_HTML_FILE", 500)
		return
	}
	http.ServeFile(w, r, formPath)
}

func (authcontroller *AuthController) ServeEmailVerificationTemplate(w http.ResponseWriter, r *http.Request) {
	tmplPath, err := filepath.Abs("./features/auth/views/email_verification.html")
	if err != nil {
		http.Error(w, "ERROR_FINDING_HTML_FILE", 500)
		return
	}
	http.ServeFile(w, r, tmplPath)
}
