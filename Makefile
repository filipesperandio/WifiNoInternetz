.PHONY: start install

start:
	yarn start

out/WifiNoInternetz-darwin-x64/WifiNoInternetz.app:
	yarn package

package: out/WifiNoInternetz-darwin-x64/WifiNoInternetz.app

clean:
	rm -rf out

uninstall:
	rm -rf /Applications/WifiNoInternetz.app

install: clean uninstall package
	cp -rf out/WifiNoInternetz-darwin-x64/WifiNoInternetz.app /Applications/
