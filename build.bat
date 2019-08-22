REM keytool -genkey -v -keystore jcocmusic.keystore -alias solman_manunggal -keyalg RSA -keysize 2048 -validity 10000
DEL jcocmusic.apk
ionic cordova build android --prod --release --verbose
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore jcocmusic.keystore platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk solman_manunggal
zipalign -v 4 platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk jcocmusic.apk
