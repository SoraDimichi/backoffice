import { AuthForm } from "./components/form";
import { UserInterface } from "./components/ui";
import { useUser } from "./context";

function App() {
  const { userLoaded } = useUser();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {userLoaded ? <UserInterface /> : <AuthForm />}
      </div>
    </div>
  );
}

export default App;
