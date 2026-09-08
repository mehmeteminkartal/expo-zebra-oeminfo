import { useState } from 'react';
import { Button, ScrollView, Text } from 'react-native';
import { getIdentityAsync } from 'expo-zebra-oeminfo';

export default function App() {
  const [report, setReport] = useState('Press Read to query this device.');
  const [busy, setBusy] = useState(false);
  async function read() {
    setBusy(true);
    try { setReport(JSON.stringify(await getIdentityAsync(), null, 2)); }
    catch (error) { setReport(String(error)); }
    finally { setBusy(false); }
  }
  return <ScrollView contentContainerStyle={{ padding: 32, paddingTop: 64 }}>
    <Text style={{ fontSize: 24 }}>Zebra OEMInfo</Text>
    <Text>Authorize this example package and its signing certificate in StageNow first.</Text>
    <Button title={busy ? 'Reading…' : 'Read device identifiers'} disabled={busy} onPress={read} />
    <Text selectable>{report}</Text>
  </ScrollView>;
}
