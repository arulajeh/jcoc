# start--mobile-apps
# signed APK Release

## keytool -genkey -v -keystore jcoc-music.keystore -alias jcoc-music -keyalg RSA -keysize 2048 -validity 10000
### password : jcoc-music
### first & last name : jcoc-music
### Organization : Solman Manunggal Informatika
### City : Jakarta Pusat
### Province : DKI Jakarta
### post : 10220


## move E:\Bagus\Solman\heroku\jcocmusic\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk to root dir
## jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore jcoc-music.keystore app-release-unsigned.apk jcoc-music
## delete jcoc-music.apk if exists
### cd C:\Users\AL\AppData\Local\Android\Sdk\build-tools\28.0.3
####  zipalign -v 4 E:\Bagus\Solman\heroku\jcocmusic\app-release-unsigned.apk E:\Bagus\Solman\heroku\jcocmusic\jcoc-music.apk