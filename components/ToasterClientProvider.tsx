"use client";
import { Toaster } from "react-hot-toast";

function ToasterClientProvider() {
  return (
    <>
      <Toaster position="top-center" />
    </>
  );
}

export default ToasterClientProvider;
