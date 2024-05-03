"use client";
import { StoreModal } from "@/components/modals/store-modal";
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/ui/customModal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useHumanStore } from "@/hooks/useHuman";
import { SignIn, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import React, { useEffect } from "react";

type Props = {};

const Root = (props: Props) => {

  const onOpen = useStoreModal((state) => state.onOpen)
  const onClose = useStoreModal((state) => state.onClose)
  const isOpen = useStoreModal((state) => state.isOpen)

  useEffect(() =>{
    if(!isOpen) {
      onOpen()
    }
  }, [isOpen, onOpen])


  return null 
};

export default Root;
