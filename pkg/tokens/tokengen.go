package token

import (
	"log"
	"os"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/san-tosh/golang-password-manager-wails/pkg/models"
)

type SignedDetails struct {
	Email string
	Uid   string
	jwt.StandardClaims
}

var SECRET_KEY = os.Getenv("SECRET_LOVE")

func TokenGenerator(email string, uid string) (signedtoken string, signedrefreshtoken string, err error) {
	claims := &SignedDetails{
		Email: email,
		Uid:   uid,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Local().Add(time.Hour * time.Duration(24)).Unix(),
		},
	}
	refreshclaims := &SignedDetails{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Local().Add(time.Hour * time.Duration(168)).Unix(),
		},
	}
	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(SECRET_KEY))
	if err != nil {
		return "", "", err
	}
	refreshtoken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshclaims).SignedString([]byte(SECRET_KEY))
	if err != nil {
		log.Panicln(err)
		return
	}
	return token, refreshtoken, err
}

func UpdateAllTokens(signedtoken string, signedrefreshtoken string, userid uint) models.User {
	var user models.User

	userFind := models.DB.Where("id = ?", userid).First(&user)
	if userFind.Error != nil {
		log.Panic(userFind.Error)
	}
	user.Token = signedtoken
	user.Refresh_Token = signedrefreshtoken
	updated_at, _ := time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
	user.UpdatedAt = updated_at
	models.DB.Save(&user)
	return user
}

func ValidateToken(signedtoken string) (claims *SignedDetails, msg string) {
	token, err := jwt.ParseWithClaims(signedtoken, &SignedDetails{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SECRET_KEY), nil
	})

	if err != nil {
		msg = err.Error()
		return
	}
	claims, ok := token.Claims.(*SignedDetails)
	if !ok {
		msg = "Token is invalid"
		return
	}
	if claims.ExpiresAt < time.Now().Local().Unix() {
		msg = "Token is expired"
		return
	}
	return claims, msg
}
