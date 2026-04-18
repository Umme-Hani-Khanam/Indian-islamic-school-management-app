import { Redirect } from 'expo-router';

export default function Index() {
  console.log("INDEX LOADED");
  return <Redirect href="/(public)/login" />;
}
