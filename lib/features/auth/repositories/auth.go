package auth

import (
	"fmt"
	"mime/multipart"
	"net/http"
	"strings"

	gorm "gorm.io/gorm"

	authUtils "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/auth/utils"
	models "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/models"
	database "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/database"
	email "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/email"
	filestorage "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/services/file_storage"
	tools "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/tools"
)

type AuthRepository struct {
	database *gorm.DB
}

func NewAuthRepository() *AuthRepository {
	return &AuthRepository{
		database: database.Instance,
	}
}

func (authRepo *AuthRepository) RegisterWithEmailAndPassword(user models.User, profileImage multipart.File) (status int, result tools.Object) {
	// Validate inputs
	if err := (&user).ValidateRegistration(); err != nil {
		return http.StatusBadRequest, tools.Object{
			"error": err.Error(),
		}
	}

	database := authRepo.database
	// Check if email is in use:
	var exist bool
	err := database.Model(&models.User{}).Select("count(*) > 0").Where("email = ?", user.Email).Find(&exist).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error": "FINDING_USER_FAILED",
		}
	}
	if exist {
		return http.StatusBadRequest, tools.Object{
			"error": "EMAIL_ALREADY_IN_USE",
		}
	}

	// Get password hash and email:
	user.Password, err = authUtils.HashPassword(user.Password)
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error": "PASSWORD_HASH_FAILED",
		}
	}

	// Store profile image file:
	if profileImage != nil {
		profileImageName := strings.Split(user.Email, "@")[0]
		response, err := filestorage.UploadFile(
			profileImage,
			profileImageName,
			"/images/users",
		)
		if err != nil {
			return http.StatusInternalServerError, tools.Object{
				"error":   "INTERNAL_SERVER_ERROR",
				"message": err.Error(),
			}
		}

		userImage := models.Image{
			URL: response.Url,
			ImageKitID: response.FileId,
		}
		if err := database.Create(&userImage).Error; err != nil {
			return http.StatusInternalServerError, tools.Object{
				"error":   "INTERNAL_SERVER_ERROR",
				"message": err.Error(),
			}
		}
		user.ImageID = &userImage.ID
	}

	// Create User:
	err = database.Create(&user).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error": "USER_CREATION_FAILED",
		}
	}
	return http.StatusOK, tools.Object{
		"message": "USER_CREATED",
	}
}

func (authRepo *AuthRepository) LoginWithEmailAndPassword(user models.User) (status int, result tools.Object) {
	// Validate inputs
	if err := user.ValidateLogin(); err != nil {
		return http.StatusBadRequest, tools.Object{
			"error": err.Error(),
		}
	}
	database := authRepo.database
	password := user.Password
	email := user.Email

	// Check for email:
	var storedUser models.User
	err := database.Where("email = ?", email).First(&storedUser).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return http.StatusBadRequest, tools.Object{
				"error": "EMAIL_NOT_FOUND",
			}
		} else {
			return http.StatusInternalServerError, tools.Object{
				"error": "FINDING_USER_FAILED",
			}
		}
	}

	// Check password
	passwordMatches := authUtils.VerifyPasswordHash(password, storedUser.Password)
	if !passwordMatches {
		return http.StatusBadRequest, tools.Object{
			"error": "INCORRECT_PASSWORD",
		}
	}

	// Check email verification
	if disabled := storedUser.Disabled != nil && *storedUser.Disabled; disabled {
		return http.StatusBadRequest, tools.Object{
			"error": "USER_DISABLED",
		}
	}

	// Check email verification
	if emailVerified := storedUser.EmailVerified != nil && *storedUser.EmailVerified; !emailVerified {
		return http.StatusBadRequest, tools.Object{
			"error": "UNVERIFIED_EMAIL",
		}
	}

	// Generating and sending idToken
	idToken, err := authUtils.CreateIdToken(
		storedUser.ID,
		storedUser.Email,
		*storedUser.EmailVerified,
		storedUser.IsAdmin,
		*storedUser.Disabled,
	)
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error": "GENERATING_IDTOKEN_FAILED",
		}
	}
	return http.StatusOK, tools.Object{
		"idToken": idToken,
	}
}

func (authRepo *AuthRepository) Authorization(authorization string) (status int, result tools.Object) {
	// Validate authorization:
	if authorization == "" {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_AUTHORIZATION",
		}
	}

	// Validate idToken:
	idToken := authorization[len("Bearer "):]
	claims, err := authUtils.VerifyToken(idToken)
	if err != nil || claims["disabled"] == true {
		return http.StatusUnauthorized, tools.Object{
			"error": "UNAUTHORIZED",
		}
	}

	return http.StatusOK, tools.Object{
		"email":         claims["email"],
		"id":            claims["id"],
		"emailVerified": claims["emailVerified"],
		"isAdmin":       claims["isAdmin"],
		"disabled":      claims["disabled"],
		"idToken":       idToken,
	}
}

func (authRepo *AuthRepository) AuthorizationWithEmailVerification(emailVerified bool) (status int, result tools.Object) {
	if !emailVerified {
		return http.StatusUnauthorized, tools.Object{
			"error": "UNAUTHORIZED",
		}
	}

	return http.StatusOK, nil
}

func (authRepo *AuthRepository) AuthorizationWithAdminCheck(isAdmin bool) (status int, result tools.Object) {
	if !isAdmin {
		fmt.Println("unhothorized")
		return http.StatusUnauthorized, tools.Object{
			"error": "UNAUTHORIZED",
		}
	}

	return http.StatusOK, nil
}

func (authRepo *AuthRepository) SendEmailVerificationLink(toEmail string, url string) (status int, result tools.Object) {
	// Validate toEmail:
	if toEmail == "" {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_ID",
		}
	}

	// generating id Token:
	idToken, err := authUtils.CreateIdToken(0, toEmail, false, false, false)
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error": "GENERATING_IDTOKEN_FAILED",
		}
	}

	// Sending email:
	verificationLink := url + "/" + idToken
	message := fmt.Sprintf("Subject: Email verification link!\nThis is email verification link from kinema\n%v\nif you do not have to do with it dont browse it!", verificationLink)

	err = email.SendEmailMessage(toEmail, message)

	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "SENDING_EMAIL_FAILED",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"message": "VERIFICATION_LINK_SENT",
	}
}

func (authRepo *AuthRepository) VerifyEmail(email string) (status int, result tools.Object) {
	// Validate id:
	if email == "" {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_EMAIL",
		}
	}

	database := authRepo.database

	// Updating user:
	var user models.User
	err := database.Where("email = ?", email).First(&user).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error": "FINDING_USER_FAILED",
		}
	}

	if *user.EmailVerified {
		return http.StatusBadRequest, tools.Object{
			"error": "USER_ALREADY_VERIFIED",
		}
	}

	err = database.Model(&models.User{}).Where("email = ?", email).Update("email_verified", true).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "UPDATING_USER_FAILED",
			"message": err.Error(),
		}
	}

	return http.StatusOK, tools.Object{
		"message": "USER_VERIFIED",
	}
}

func (authRepo *AuthRepository) ResetPassword(email string, newPassword string) (status int, result tools.Object) {
	// Validate id:
	if email == "" {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_EMAIL",
		}
	}

	database := authRepo.database

	// Hashing password:
	newPasswordHash, err := authUtils.HashPassword(newPassword)
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error": "PASSWORD_HASH_FAILED",
		}
	}

	// Updating user:
	err = database.Model(&models.User{}).Where("email = ?", email).Update("password", newPasswordHash).Error
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error": "UPDATING_USER_FAILED",
		}
	}

	return http.StatusOK, tools.Object{
		"message": "PASSWORD_CHANGED",
	}
}

func (authRepo *AuthRepository) SendPasswordResetLink(toEmail string, url string) (status int, result tools.Object) {
	// Validate toEmail:
	if toEmail == "" {
		return http.StatusBadRequest, tools.Object{
			"error": "INDEFINED_ID",
		}
	}

	// generating id Token:
	idToken, err := authUtils.CreateIdToken(0, toEmail, false, false, false)
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error": "GENERATING_IDTOKEN_FAILED",
		}
	}

	// Sending email:
	resetLink := url + "/" + idToken
	message := fmt.Sprintf("Subject: Password reset link!\nThis is password reset link from kinema\n%v\nif you do not have to do with it dont browse it!", resetLink)
	err = email.SendEmailMessage(toEmail, message)

	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error": "SENDING_EMAIL_FAILED",
		}
	}

	return http.StatusOK, tools.Object{
		"message": "RESET_PASSWORD_LINK_SENT",
	}
}
