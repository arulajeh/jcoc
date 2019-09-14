# start--mobile-apps
# signed APK Release

##keytool -genkey -v -keystore jcoc-music.keystore -alias jcoc-music -keyalg RSA -keysize 2048 -validity 10000
###password : jcoc-music
###first & last name : jcoc-music
###Organization : Solman Manunggal Informatika
###City : Jakarta Pusat
###Province : DKI Jakarta
###post : 10220

##jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore jcoc-music.keystore app-release.apk jcoc-music
## zipalign -v 4 app-release.apk jcoc-music.apk
### cd C:\Users\AL\AppData\Local\Android\Sdk\build-tools\28.0.3
####  zipalign -v 4 E:\Bagus\Solman\STTI\start-mobile-apps\app-release.apk E:\Bagus\Solman\STTI\start-mobile-apps\jcoc-music.apk