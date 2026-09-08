# Release verification

## 0.1.0

Environment: Expo SDK 56, React Native 0.85.3, Zebra TC21, Android 13.

- TypeScript compilation passed.
- Installed npm tarball in a separate clean Expo project with the default Metro configuration.
- Android release build and lintVital passed.
- Expo Autolinking registered ZebraOemInfoModule.
- Merged application manifest included OEMInfo read permission and provider visibility without app configuration.
- Authorized package: serial, Wi-Fi MAC and Bluetooth MAC returned ok.
- Bluetooth disabled: serial and Wi-Fi remained ok; Bluetooth returned no_data. Original radio state restored.
- Separate unauthorized package: every field returned no_data.
- Provider visibility removed only in temporary test app manifest: every field returned provider_unavailable. This exercises provider resolution failure; it is not a physical non-Zebra device test.
- npm tarball inspected: no native build caches, keys or device identifiers.

Not yet verified: TC27 package integration, physical non-Zebra devices, Expo versions outside SDK 56.

For local Android builds using a recent JDK that reports restricted native access during CMake setup, JAVA_TOOL_OPTIONS=--enable-native-access=ALL-UNNAMED was needed on the test machine.
