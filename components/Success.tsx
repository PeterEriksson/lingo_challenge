"use client";
import React from "react";
import styles from "../app/main.module.css";

type Props = {
  grade: string;
};

function Success({ grade }: Props) {
  return (
    <>
      <div
        className={`${styles.checkmark} $/{styles.celebrate} text-green-500 border-2 px-4 rounded-full border-green-500 mt-2`}
      >
        ✓
      </div>
      <p className=" text-green-500 mt-[4px]">{grade}</p>
    </>
  );
}

export default Success;
