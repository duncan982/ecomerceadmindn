// "use client";
import { useSession, signIn, signOut } from "next-auth/react";
export default function Login() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="bg-blue-900 w-screen min-h-screen flex items-center">
        <div className="text-center w-full ">
          <button
            onClick={() => {
              signIn("google");
            }}
            className="bg-white p-2 px-4 rounded-lg text-black"
          >
            Login in with Google
          </button>
        </div>
      </div>
    );
  }

  return <div>logged in {session.user.email}</div>;
}
