package auth

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

var secretKey = []byte("mohamed")

func CreateIdToken(id uint, email string, emailVerified bool, isAdmin bool, disabled bool) (string, error) {
	jwtIdToken := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		jwt.MapClaims{
			"id":            id,
			"email":         email,
			"emailVerified": emailVerified,
			"isAdmin":       isAdmin,
			"disabled":      disabled,
			"exp":           time.Now().Add(time.Hour * 24).Unix(),
		},
	)

	idToken, err := jwtIdToken.SignedString(secretKey)
	return idToken, err
}

func VerifyToken(idToken string) (jwt.MapClaims, error) {
	jwtIdToken, err := jwt.Parse(idToken, func(t *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})

	if err != nil {
		return nil, err
	}

	if !jwtIdToken.Valid {
		return nil, errors.New("INVALID_TOKEN")
	}

	claims, _ := jwtIdToken.Claims.(jwt.MapClaims)

	return claims, nil
}
