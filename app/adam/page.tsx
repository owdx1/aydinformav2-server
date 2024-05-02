"use client";
import { useHumanStore } from "@/hooks/useHuman";
import React from "react";

type Props = {};

const Adam = (props: Props) => {
  const adam = useHumanStore();

  return (
    <div>
      <div>{adam.name}</div>
    </div>
  );
};

export default Adam;
