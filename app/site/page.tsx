import Bounties from "@/components/Bounties";
import Image from "next/image";

export default function Home() {
  return (
    <main className="">
      <section className="h-full w-full pt-25 mt-25 md:mt-1 relative flex  md:p-20 p-5  md:pt-20 md:flex-row flex-col">
       <div className="w-full">
        <Bounties/>
       </div>
       <div className="md:w-[800px] w-full border-l-2 border-gray-200 h-screen p-5">
        Hi
       </div>

      </section>
    </main>
  );
}
