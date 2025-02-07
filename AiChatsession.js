const AiChatsession = {
  sendMessage: async (message) => {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({ response: { text: () => "This is a mocked AI response" } }),
        1000
      )
    );
  },
};

export default AiChatsession;
"use client";
import { AiChatSession } from "../../../configs/AiModal";
import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { JsonForms } from "../../../configs/schema";
import moment from "moment";
import { db } from "../../../configs/index";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";