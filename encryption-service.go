package main

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"errors"
	"io"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v3/pkg/application"
	"golang.org/x/crypto/pbkdf2"
)

type EncryptionService struct{}

func NewEncryptionService() *EncryptionService {
	return &EncryptionService{}
}

const KeySize = 32 // 32 bytes = AES-256
const SaltSize = 16
const Iterations = 100_000 // PBKDF2 iterations

func deriveKey(password string, salt []byte) []byte {
	return pbkdf2.Key([]byte(password), salt, Iterations, KeySize, sha256.New)
}

func (e *EncryptionService) EncryptFileAES256GCM(password, inputPath, outputPath string) error {
	plaintext, err := os.ReadFile(inputPath)
	if err != nil {
		return err
	}

	salt := make([]byte, SaltSize)
	if _, err := io.ReadFull(rand.Reader, salt); err != nil {
		return err
	}

	key := deriveKey(password, salt)

	block, err := aes.NewCipher(key)
	if err != nil {
		return err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return err
	}

	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return err
	}

	ciphertext := gcm.Seal(nil, nonce, plaintext, nil)
	finalCiphertext := append(salt, nonce...)
	finalCiphertext = append(finalCiphertext, ciphertext...)

	filename := filepath.Base(inputPath)
	outputFile := filepath.Join(outputPath, "encrypted_"+filename)

	err = os.WriteFile(outputFile, finalCiphertext, 0644)
	if err != nil {
		return err
	}

	return nil
}

func (e *EncryptionService) DecryptFileAES256GCM(password, inputFile, outputPath string) error {
	ciphertextWithMetadata, err := os.ReadFile(inputFile)
	if err != nil {
		return err
	}

	if len(ciphertextWithMetadata) < SaltSize+12 {
		return errors.New("ciphertext too short")
	}

	salt := ciphertextWithMetadata[:SaltSize]
	nonce := ciphertextWithMetadata[SaltSize : SaltSize+12]
	ciphertext := ciphertextWithMetadata[SaltSize+12:]

	key := deriveKey(password, salt)

	block, err := aes.NewCipher(key)
	if err != nil {
		return err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return err
	}

	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return errors.New("decryption failed: incorrect password or corrupted data")
	}

	filename := filepath.Base(inputFile)
	outputFile := filepath.Join(outputPath, "decrypted_"+filename)

	err = os.WriteFile(outputFile, plaintext, 0644)
	if err != nil {
		return err
	}

	return nil
}

func (e *EncryptionService) GetFilePath() string {
	dialog := application.OpenFileDialog()

	dialog.SetTitle("Select File")
	if path, err := dialog.PromptForSingleSelection(); err == nil {
		return path
	}

	return ""
}

func (e *EncryptionService) GetOutputPath() string {
	dialog := application.OpenFileDialog().CanChooseDirectories(true)
	dialog.SetTitle("Select the output path")
	if path, err := dialog.PromptForSingleSelection(); err == nil {
		return path
	}

	return ""
}
