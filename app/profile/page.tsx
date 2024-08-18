import { authOptions } from "@/auth";
import { UserIcon } from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth";

async function ProfilePage() {
  const session = await getServerSession(authOptions);
  return (
    <div className="">
      <div className=" m-4 flex items-center justify-between">
        <div className=" ">
          <div className="flex items-center space-x-1">
            <UserIcon className="w-4 h-4" />
            <h2 className="font-light text-sm">(sketch)</h2>
          </div>
          <h1 className="font-bold text-3xl">{session?.user?.name}</h1>
          <h3 className="text-xs mt-2">
            Languages
            <span className="text-xs font-light ml-3">🇩🇪 B2</span>
            <span className="text-xs font-light ml-3">🇫🇷 A1</span>
            <span className="text-xs font-light ml-3">🇪🇸 A2</span>
          </h3>
        </div>
        <div className="">
          <p className="text-lg font-semibold ">
            350 <span className="text-xs font-light">points</span>
          </p>
          <p className="text-lg font-semibold">
            4 <span className="text-xs font-light">topics</span>{" "}
          </p>
          <p className="text-lg font-semibold">
            3 <span className="text-xs font-light">streak record</span>{" "}
          </p>
        </div>
      </div>

      <div className="text-center space-x-6 flex justify-center mt-8">
        <h4>📝 Mistakes</h4>
        <h4>🎉 Completed</h4>
      </div>
    </div>
  );
}

export default ProfilePage;
