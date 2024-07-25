import { Redirect } from "expo-router";
import useAsyncStorage from "@/hooks/useAuth";
import Welcome from "@/components/sections/Welcome";

const App = () => {
  // hooks
  const [user, loading] = useAsyncStorage("@user");
  if (!loading && user) {
    return <Redirect href="/home" />;
  }
  return <Welcome />;
};

export default App;
