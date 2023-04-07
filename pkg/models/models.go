package models

import (
	"errors"
	"fmt"
	"log"
	"time"

	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"

	"github.com/san-tosh/golang-password-manager-wails/pkg/config"
	"gorm.io/gorm"
)

var DB *gorm.DB

type User struct {
	ID            uint   `gorm:"primaryKey"`
	Email         string `json:"email" validate:"email,required"`
	Passphrase    string `json:"passphrase" validate:"required,min=8,max=30"`
	Token         string `json:"token"`
	Refresh_Token string `json:"refresh_token"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

type Secret struct {
	ID               uint `gorm:"primaryKey"`
	UserID           uint
	IdentifierName   string `json:"identifierName" validate:"required,min=8,max=30"`
	Password         string `json:"password" validate:"required,min=8,max=330"`
	PasswordStrength string `json:"passwordStrength" validate:"required"`
	URL              string `json:"url" validate:"required,url"`
	Note             string `json:"note" validate:"required,min=8,max=200"`
	CreatedAt        time.Time
	UpdatedAt        time.Time
}

type Keys struct {
	ID         uint   `gorm:"primaryKey"`
	PrivateKey string `json:"privateKey"`
	PublicKey  string `json:"publicKey"`
}

func init() {
	config.Connect()
	DB = config.GetDB()
	DB.AutoMigrate(&User{}, &Secret{}, &Keys{})
}

func (u *User) CreateUser() *User {
	DB.Create(&u)
	return u
}

func (u *User) IsEmailUnique() bool {
	var count int64
	DB.Model(&User{}).Where("email = ?", u.Email).Count(&count)
	return count <= 0
}

func (u *Secret) IsIdentifierUnique() bool {
	var count int64
	DB.Model(&Secret{}).Where("identifier_name = ?", u.IdentifierName).Count(&count)
	return count <= 0
}

func (u *Secret) IsIdentifierUniqueExceptId(id uint) bool {
	var count int64
	result := DB.Model(&Secret{}).Where("identifier_name = ?", u.IdentifierName).Where(
		"id != ?", id).Count(&count)
	if result.Error != nil {
		log.Println(result.Error)
	}
	return count <= 0
}

func GetSecretsByUserID(userID uint) ([]Secret, error) {
	var secrets []Secret
	result := DB.Where("user_id = ?", userID).Order("created_at desc").Find(&secrets)
	if result.Error != nil {
		return secrets, errors.New("get all secrets by user id query failed")
	}
	return secrets, nil
}

func GetUserByToken(token string) (User, error) {
	var user User
	result := DB.Where("token = ?", token).First(&user)
	if result.Error != nil {
		return user, errors.New("get user id by token query failed")
	}
	return user, nil
}

func DeleteSecret(secret Secret) error {
	result := DB.Unscoped().Delete(&secret)
	if result.Error != nil {
		return errors.New("get user id by token query failed")
	}
	return nil
}

func GetSecretByIdentifierName(identifierName string) (Secret, error) {
	var secret Secret
	result := DB.Where("identifier_name = ?", identifierName).First(&secret)
	if result.Error != nil {
		return secret, result.Error
	}
	return secret, nil
}

func GetSecretByIdentifierNameAndUserId(identifierName string, userID uint) (Secret, error) {
	var secret Secret
	result := DB.Where("identifier_name = ?", identifierName).Where("user_id = ?", userID).First(&secret)
	if result.Error != nil {
		return secret, result.Error
	}
	return secret, nil
}

func SeedPairKeys() {
	bitSize := 4096
	// Generate RSA key.
	key, err := rsa.GenerateKey(rand.Reader, bitSize)
	if err != nil {
		panic(err)
	}
	// Extract public component.
	pub := key.Public()

	// Encode private key to PKCS#1 ASN.1 PEM.
	keyPEM := pem.EncodeToMemory(
		&pem.Block{
			Type:  "RSA PRIVATE KEY",
			Bytes: x509.MarshalPKCS1PrivateKey(key),
		},
	)

	// Encode public key to PKCS#1 ASN.1 PEM.
	pubPEM := pem.EncodeToMemory(
		&pem.Block{
			Type:  "RSA PUBLIC KEY",
			Bytes: x509.MarshalPKCS1PublicKey(pub.(*rsa.PublicKey)),
		},
	)

	keys := Keys{
		PrivateKey: string(keyPEM),
		PublicKey:  string(pubPEM),
	}

	var count int64
	DB.Model(&Keys{}).Count(&count)
	fmt.Println("cout", count)
	if count == 0 {
		result := DB.Create(&keys)
		if result.Error != nil {
			panic("Error creation during key generate")
		}
	}
}
