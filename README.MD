*ionic version : 5.2.7 
node version : 10.16.0 
npm version : 6.9.0 
cordova version: 9.0.0* 


## apk steps for build
```
ionic cordova build android --prod --release

cp platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk am-unsigned.apk

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ./../doc/alumnimatch.jks am-unsigned.apk alumnimatch

~/Library/Android/sdk/build-tools/30.0.1/zipalign -v 4 am-unsigned.apk am.apk

~/Library/Android/sdk/build-tools/30.0.1/apksigner verify am.apk
```