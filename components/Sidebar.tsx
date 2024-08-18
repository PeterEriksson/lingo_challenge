"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import ChallengeRow from "./ChallengeRow";
import ModelSelection from "./ModelSelection";
import Link from "next/link";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/solid";
import Loading from "./Loading";
import { HomeIcon, UserIcon } from "@heroicons/react/24/outline";
import { HomeIcon as HomeIconSolid } from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";

function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [challenges, loading, error] = useCollection(
    session &&
      query(
        collection(db, "users", session.user?.email!, "challenges"),
        orderBy("createdAt", "asc")
      )
  );

  return (
    <div className="p-2 flex flex-col h-full ">
      <Link className="my-3 mx-auto relative group" href={`/`}>
        {/* hover -> css-tooltip */}
        <h2 className="opacity-0 transition duration-500 group-hover:opacity-85 absolute -top-5 z-50 -left-[8px] text-xxs py-0.5 px-1 bg-gray-300 rounded-sm text-white ">
          Home
        </h2>

        {pathname == "/" ? (
          <HomeIconSolid className="h-5 w-5  " />
        ) : (
          <HomeIcon className="h-5 w-5  " />
        )}
      </Link>

      <hr className="bg-gray-300 w-full mb-3" />

      <div className="flex-1">
        {/* <NewChallenge /> */}

        {challenges?.empty && (
          <p className="text-xs opacity-50">
            Your challenges will be displayed here..
          </p>
        )}

        <div className="flex flex-col space-y-2 my-2">
          {loading && (
            <div className="text-center ">
              <Loading />
            </div>
          )}

          {challenges?.docs.map((challenge) => (
            <ChallengeRow
              key={challenge.id}
              id={challenge.id}
              challenge={challenge}
            />
          ))}
        </div>
      </div>

      {session && (
        <div className="flex justify-between items-center">
          <ArrowLeftEndOnRectangleIcon
            className="h-8 w-8 text-gray-700 hover:opacity-100 opacity-60 cursor-pointer"
            onClick={() => {
              signOut({ callbackUrl: "http://localhost:3000/" }); //(we need '=>' to get around typescript)
            }}
          />
          {/* <Link
            href={`/profile`}
            className=" relative cursor-pointer opacity-60 hover:opacity-100"
          >
            <UserIcon className="w-7 h-7" />
          </Link> */}
        </div>
      )}
    </div>
  );
}

export default Sidebar;
