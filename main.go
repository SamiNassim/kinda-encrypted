package main

import (
	"embed"
	_ "embed"
	"fmt"
	"log"
	"runtime"

	"github.com/wailsapp/wails/v3/pkg/application"
)

// Wails uses Go's `embed` package to embed the frontend files into the binary.
// Any files in the frontend/dist folder will be embedded into the binary and
// made available to the frontend.
// See https://pkg.go.dev/embed for more information.

//go:embed all:frontend/dist
var assets embed.FS

// main function serves as the application's entry point. It initializes the application, creates a window,
// and starts a goroutine that emits a time-based event every second. It subsequently runs the application and
// logs any error that might occur.
func main() {

	// Create a new Wails application by providing the necessary options.
	// Variables 'Name' and 'Description' are for application metadata.
	// 'Assets' configures the asset server with the 'FS' variable pointing to the frontend files.
	// 'Bind' is a list of Go struct instances. The frontend has access to the methods of these instances.
	// 'Mac' options tailor the application when running an macOS.
	app := application.New(application.Options{
		Name:        "KindaEncrypted",
		Description: "A simple encryption app using AES-256-GCM",
		Services: []application.Service{
			application.NewService(&EncryptionService{}),
		},
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
	})

	// Create a new window with the necessary options.
	// 'Title' is the title of the window.
	// 'Mac' options tailor the window when running on macOS.
	// 'BackgroundColour' is the background colour of the window.
	// 'URL' is the URL that will be loaded into the webview.
	app.NewWebviewWindowWithOptions(application.WebviewWindowOptions{
		Title: "KindaEncrypted",
		Mac: application.MacWindow{
			InvisibleTitleBarHeight: 50,
			Backdrop:                application.MacBackdropTranslucent,
			TitleBar:                application.MacTitleBarHiddenInset,
		},
		BackgroundColour:           application.NewRGB(27, 38, 54),
		URL:                        "/",
		DefaultContextMenuDisabled: true,
		DevToolsEnabled:            false,
	})

	menu := app.NewMenu()

	if runtime.GOOS == "darwin" {
		menu.AddRole(application.AppMenu)
	}

	// Add standard menus
	fileMenu := menu.AddSubmenu("File")
	fileMenu.Add("Encrypt file")
	fileMenu.AddRole(application.CloseWindow)
	menu.AddRole(application.EditMenu).Add("Encrypt").OnClick(func(ctx *application.Context) { fmt.Println("Clicked") })
	menu.AddRole(application.WindowMenu).Add("Encrypt").OnClick(func(ctx *application.Context) { fmt.Println("Clicked") })

	app.SetMenu(menu)
	// Run the application. This blocks until the application has been exited.
	err := app.Run()

	// If an error occurred while running the application, log it and exit.
	if err != nil {
		log.Fatal(err)
	}
}
