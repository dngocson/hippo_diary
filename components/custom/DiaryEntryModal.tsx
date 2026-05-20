import React, { useState, useEffect, useRef } from "react";
import { Text, TextInput, View } from "react-native";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { useModalContext } from "./ModalContext";

interface DiaryEntryModalProps {
  isOpen: boolean;
  selectedDate: string;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
}

export function DiaryEntryModal({
  isOpen,
  selectedDate,
  onClose,
  onSave,
}: DiaryEntryModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const isMountedRef = useRef(true);
  const { setIsAnyModalOpen } = useModalContext();

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setContent("");
      setIsAnyModalOpen(true);
    }
  }, [isOpen, setIsAnyModalOpen]);

  useEffect(() => {
    return () => {
      // Cleanup khi component unmount
      isMountedRef.current = false;
      setIsAnyModalOpen(false);
    };
  }, [setIsAnyModalOpen]);

  const handleSave = () => {
    if (!isMountedRef.current) return;

    onSave(title, content);

    if (isMountedRef.current) {
      setTitle("");
      setContent("");
    }
    onClose();
  };

  const handleClose = () => {
    if (!isMountedRef.current) return;

    if (isMountedRef.current) {
      setTitle("");
      setContent("");
    }
    setIsAnyModalOpen(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalBackdrop
        focusable
        onPress={handleClose}
        style={{ pointerEvents: "auto" }}
      />
      <ModalContent
        className="bg-warning-400"
        style={{ pointerEvents: "auto" }}
      >
        <ModalHeader className="flex-col items-start gap-0.5">
          <Heading>New Diary Entry</Heading>
          <Text style={{ fontSize: 12 }}>{selectedDate}</Text>
        </ModalHeader>
        <ModalBody className="mb-4 gap-3"></ModalBody>
        <ModalFooter className="flex-col items-start gap-2">
          <Button onPress={handleSave} className="w-full">
            <ButtonText>Save</ButtonText>
          </Button>
          <Button variant="outline" className="w-full" onPress={handleClose}>
            <ButtonText>Cancel</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
