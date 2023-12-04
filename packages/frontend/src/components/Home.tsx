import { useAuthenticator } from "@aws-amplify/ui-react";
import Homepage from "../pages/Homepage";
import NonuserHomepage from "../pages/NonuserHomepage";

function Home() {
  const { route } = useAuthenticator((context) => [context.route]);
  if (route === "idle") return <></>;
  if (route === "authenticated") return <Homepage />;
  return <NonuserHomepage />;
}
export default Home;
