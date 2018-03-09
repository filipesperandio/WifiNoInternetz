js = $(shell find . ! -path "./node_modules/*" ! -path "./tmp/*" -type f -name '*.js')
html = $(shell find . ! -path "./node_modules/*" ! -path "./tmp/*" -type f -name '*.html')

app_name = WifiNoInternetz.app
app_out = "tmp/WifiNoInternetz-darwin-x64/$(app_name)"

node_modules: package.json
	yarn install
	touch $@

start: node_modules
	electron .

$(app_out): node_modules $(js) $(html)
	rm -rf $@
	electron-packager ./ --platform=darwin --arch=x64 --out=tmp --icon=./icon.icns --overwrite

package: $(app_out)

.PHONY: clean
clean:
	rm -rf tmp

.PHONY: uninstall
uninstall:
	rm -rf /Applications/$(app_name)

.PHONY: install
install: clean uninstall $(app_out)
	cp -rf $(app_out) /Applications/

tmp/$(app_name).dmg: $(app_out)
	rm -f $@
	electron-installer-dmg $(app_out) tmp/$(app_name) --overwrite --icon-size=150 --icon=orig/green.png

installer: tmp/$(app_name).dmg
