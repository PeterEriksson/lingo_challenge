"use client";

//NOT IN USE

import openai from "@/lib/chatgpt";
import React from "react";
import useSWR from "swr";
import Select from "react-select";

//helper fcn
const fetchModels = () => fetch("api/get/engines").then((res) => res.json());

function ModelSelection() {
  const { data: models, isLoading } = useSWR("models", fetchModels);
  const { data: model, mutate: setModel } = useSWR("model", {
    fallbackData: "gpt-3.5-turbo", //S build: 'text-davinci-003
  });

  return (
    <div className="mt-2">
      <Select
        className="mt-2"
        options={models?.modelOptions}
        defaultValue={model}
        placeholder={model}
        isSearchable
        isLoading={isLoading}
        menuPosition="fixed"
        //classNames={{
        //control: (state) => "bg-[#434654] border-[#434654]",
        //}}
        onChange={(e) => setModel(e.value)}
      />
    </div>
  );
}

export default ModelSelection;
