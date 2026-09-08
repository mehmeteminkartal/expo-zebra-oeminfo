# expo-zebra-oeminfo

Read a Zebra Android device's serial number, Wi-Fi MAC address and Bluetooth MAC address from React Native using OEMInfo.

## Requirements

- A Zebra Android device with OEMInfo.
- An Expo SDK 56 project, or a React Native project with Expo Modules configured.
- Device authorization for your application's package name and signing certificate.
- A native Android build. Expo Go is not supported.

## Installation

```sh
npx expo install expo-zebra-oeminfo
```

Rebuild your Android app after installation:

```sh
npx expo run:android
```

EAS Build can also produce the new Android build. Installing the package through an OTA update alone is insufficient.

**Autolinking is included.** The package supplies its own Android manifest with the OEMInfo read permission and provider visibility declarations. No manual linking, Gradle changes, application manifest changes or `app.json` plugin entry are needed in an Expo project.

## StageNow setup

Create an AccessMgr step for each service below:

| Field | Service Identifier |
| --- | --- |
| Serial number | `content://oem_info/oem.zebra.secure/build_serial` |
| Wi-Fi MAC | `content://oem_info/oem.zebra.secure/wifi_mac` |
| Bluetooth MAC | `content://oem_info/oem.zebra.secure/bt_mac` |

For every step, set:

- **Service Access Action:** `Allow Caller to Call Service`
- **Caller Package Name:** your application's Android package name
- **Caller Signature:** your application's signing certificate

Apply the profile to each device. Development and production builds signed with different certificates need separate authorization. Use the consuming application's identity here, rather than this library's Kotlin namespace.

## Usage

```ts
import { getIdentityAsync } from 'expo-zebra-oeminfo';

const identity = await getIdentityAsync();

if (identity.serialNumber.status === 'ok') {
  const serialNumber = identity.serialNumber.value;
}

if (identity.wifiMac.status === 'ok') {
  const wifiMac = identity.wifiMac.value;
}

if (identity.bluetoothMac.status === 'ok') {
  const bluetoothMac = identity.bluetoothMac.value;
}
```

### `getIdentityAsync(): Promise<DeviceIdentity>`

Returns `serialNumber`, `wifiMac` and `bluetoothMac`. Each field has its own result:

```ts
type FieldResult =
  | { status: 'ok'; value: string }
  | {
      status:
        | 'no_data'
        | 'permission_denied'
        | 'provider_unavailable'
        | 'unexpected_response'
        | 'query_failed';
      value: null;
    };
```

| Status | Meaning |
| --- | --- |
| `ok` | A valid value was returned. |
| `no_data` | OEMInfo returned no rows, an empty value or an invalid identifier. |
| `permission_denied` | Android raised a security exception. |
| `provider_unavailable` | The OEMInfo provider could not be resolved. |
| `unexpected_response` | The response did not contain the expected field. |
| `query_failed` | Another error occurred while querying the provider. |

MAC addresses use uppercase, colon-separated notation. Placeholder addresses such as `02:00:00:00:00:00` are returned as `no_data`.

Bluetooth must be enabled to read its MAC address. Empty results can also indicate missing authorization or unavailable device data; `no_data` does not identify a single cause. Preserve previously saved identifiers when a later read returns no data.

The promise rejects if the native module or React context is unavailable. Individual provider query failures are returned as field statuses.

### `isAvailable(): boolean`

Checks whether the native module is present in the current build. It does not check device compatibility or StageNow authorization. Returns `false` on builds without the native module, including Expo Go, iOS and web.

## Example app

From the package root:

```sh
npm install
npm run build
cd example
npm install
npm run android
```

Authorize the example's package, `expo.modules.zebraoeminfo.example`, and its signing certificate in StageNow before reading identifiers.

## Development

```sh
npm run build
npm pack --dry-run
```

To try an unpublished version in another app, run `npm pack` and install the resulting `.tgz` file in that app, then rebuild Android.

The initial release targets Expo SDK 56. The Android example was built and tested on Zebra TC21 / Android 13: serial number, Wi-Fi MAC and Bluetooth MAC were returned successfully through the React Native API. A clean tarball installation was also built with default Expo configuration. Missing StageNow authorization, Bluetooth disabled and provider visibility failures returned field statuses without crashing. TC27 package-level testing is pending.

## Privacy

Identifiers are read only when `getIdentityAsync()` is called. The library does not log, store or transmit them, and does not enable device radios. Your application controls storage and reporting.

## Documentation

- [Zebra OEMInfo](https://techdocs.zebra.com/oeminfo/consume/)
- [Expo Autolinking](https://docs.expo.dev/modules/autolinking/)

## License

MIT. This is an independent project, not an official Zebra SDK.
