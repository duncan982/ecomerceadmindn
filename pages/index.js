import Layout from "../components/Layout";
import { useSession } from "next-auth/react";
import Image from "next/image";

const Home = () => {
  const { data: session } = useSession();
  console.log(session);
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h1>
          Hello, <b>{session?.user?.name}</b>
        </h1>

        <div className="flex bg-grey-300 gap-1 text-black rounded-lg overflow-hidden">
          <Image
            src={session?.user?.image}
            alt=""
            width={100}
            height={100}
            className="w-6 h-6"
          ></Image>
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
