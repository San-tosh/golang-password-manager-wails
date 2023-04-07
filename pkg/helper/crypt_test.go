package helper

import (
	"fmt"
	"testing"
)

func TestCrypt(t *testing.T) {
	var (
		password = "Nepal@123"
		data     = "secret"
	)

	encryptedData := EncryptDataWithPassword(password, data)
	fmt.Println(encryptedData)

	decryptedData := DecryptDataWithPassword(password, encryptedData)
	if decryptedData != data {
		t.Error("Encryption and Decryption value does not match.")
	}
	fmt.Println(decryptedData)
}
