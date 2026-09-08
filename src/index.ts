import { requireOptionalNativeModule } from 'expo';

export type FieldStatus =
  | 'ok' | 'no_data' | 'permission_denied' | 'provider_unavailable'
  | 'unexpected_response' | 'query_failed';
export type FieldResult =
  | { status: 'ok'; value: string }
  | { status: Exclude<FieldStatus, 'ok'>; value: null };
export interface DeviceIdentity {
  serialNumber: FieldResult;
  wifiMac: FieldResult;
  bluetoothMac: FieldResult;
}
interface NativeApi { getIdentityAsync(): Promise<DeviceIdentity> }

/** False on iOS, web and builds without this native module (including Expo Go). */
export function isAvailable(): boolean {
  return requireOptionalNativeModule<NativeApi>('ZebraOemInfo') !== null;
}

/** Reads identifiers without enabling radios, caching values or sending data. */
export async function getIdentityAsync(): Promise<DeviceIdentity> {
  const native = requireOptionalNativeModule<NativeApi>('ZebraOemInfo');
  if (!native) {
    throw new Error('Zebra OEMInfo requires an Android native build containing expo-zebra-oeminfo. Rebuild the app after installation; Expo Go is not supported.');
  }
  return native.getIdentityAsync();
}
