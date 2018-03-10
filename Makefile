js = $(shell find . ! -path "./node_modules/*" ! -path "./tmp/*" -type f -name '*.js')
html = $(shell find . ! -path "./node_modules/*" ! -path "./tmp/*" -type f -name '*.html')

node_modules: package.json
	yarn install
	touch $@

# Mac

app_out_dir = tmp/WifiNoInternetz-darwin-x64
app_name = WifiNoInternetz.app
app_out = "$(app_out_dir)/$(app_name)"

$(app_out): node_modules $(js) $(html)
	rm -rf $(app_out_dir)
	electron-packager ./ --platform=darwin --arch=x64 --out=tmp --icon=./icon.icns --overwrite

tmp/$(app_name).pkg: $(app_out)
	rm -f $@
	pkgbuild --root $(app_out_dir) --install-location /Applications --scripts ./scripts $@

package: $(app_out)

installer: tmp/$(app_name).pkg


# Windows

app_out_windows_dir = tmp/WifiNoInternetz-win32-ia32
app_out_windows = "$(app_out_windows_dir)/$(app_name).exe"

$(app_out_windows): node_modules $(js) $(html)
	rm -rf $(app_out_windows_dir)
	electron-packager ./ --platform=win32 --arch=ia32 --out=tmp --icon=./green.ico --overwrite

tmp/WifiNoInternetz-win32-ia32/installer/Setup.exe: $(app_out_windows)
	rm -f $@
	./winstaller.js

package.windows: $(app_out_windows)

installer.windows: tmp/WifiNoInternetz-win32-ia32/installer/Setup.exe

# DEV

.PHONY: start
start: node_modules
	electron .

.PHONY: clean
clean:
	rm -rf tmp

.PHONY: uninstall
uninstall:
	rm -rf /Applications/$(app_name)

.PHONY: install
install: clean uninstall $(app_out)
	cp -rf $(app_out) /Applications/
