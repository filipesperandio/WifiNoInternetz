js = $(shell find . ! -path "./node_modules/*" ! -path "./tmp/*" -type f -name '*.js')
html = $(shell find . ! -path "./node_modules/*" ! -path "./tmp/*" -type f -name '*.html')

app_out_dir = tmp/WifiNoInternetz-darwin-x64
app_name = WifiNoInternetz.app
app_out = "$(app_out_dir)/$(app_name)"

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

tmp/$(app_name).pkg: $(app_out)
	rm -f $@
	pkgbuild --root $(app_out_dir) --install-location /Applications --scripts ./scripts $@

installer: tmp/$(app_name).pkg
