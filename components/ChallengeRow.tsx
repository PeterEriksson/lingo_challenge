import { db } from "@/firebase";
import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import { deleteDoc, doc, DocumentData } from "firebase/firestore";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

type Props = {
  id: string;
  challenge: DocumentData;
};

function ChallengeRow({ id, challenge }: Props) {
  //highlight active chat ->
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [active, setActive] = React.useState(false);
  const [rowPressed, setRowPressed] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!pathname) return;
    setActive(pathname.includes(id));
  }, [pathname]);

  const removeChallenge = async () => {
    await deleteDoc(doc(db, "users", session?.user?.email!, "challenges", id));
    router.replace("/");
  };

  return (
    <Link
      onMouseDown={() => setRowPressed(true)}
      onMouseUpCapture={() => setRowPressed(false)}
      onMouseLeave={() => setRowPressed(false)}
      href={`/challenge/${id}`}
      className={`challengeRow justify-center group ${
        pathname.includes(id) ? "" : "hover:bg-gray-100/80"
      }  ${active && "bg-gray-200/80"} transition duration-150 ease-in ${
        rowPressed && "!bg-gray-300"
      } `}
    >
      {challenge?.data().completed ? (
        <>
          {["Ok", "Good", "Gut"].includes(challenge?.data().grade) ? (
            <CheckIcon className="h-5 w-5 text-gray-600/80 " />
          ) : (
            <XMarkIcon className="h-5 w-5 text-gray-600/80 " />
          )}
          <p className="flex-1   !truncate text-gray-800/60   ">
            {challenge?.data().title}
          </p>
        </>
      ) : (
        <>
          <PencilSquareIcon className="h-5 w-5 text-gray-600 " />
          <p className="flex-1   !truncate text-gray-800/90 font-semibold  ">
            {challenge?.data().title}
          </p>
        </>
      )}
      {/* display language emoji only - temp solution */}
      <p>{challenge?.data().language?.split(" ").pop()}</p>
      <TrashIcon
        onClick={removeChallenge}
        className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:text-gray-700 hover:!text-red-700"
      />
    </Link>
  );
}

export default ChallengeRow;
