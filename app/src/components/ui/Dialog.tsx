"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { CloseIcon } from "@/components/icons/CloseIcon";

interface DialogProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  hideFooter?: boolean;
  className?: string;
  onClose: () => void;
  onConfirm?: () => void;
}

export const Dialog = ({
  open,
  title,
  children,
  cancelText = "Cancel",
  confirmText = "Confirm",
  hideFooter = false,
  className,
  onClose,
  onConfirm,
}: DialogProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    }
    dialog.addEventListener("cancel", handleCancel);
    return () => {
      dialog.removeEventListener("cancel", handleCancel);
    }
  }, [onClose]);

  const handleClose = () => {
    onClose();
    ref.current?.close();
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === ref.current) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={handleBackdropClick}
      className={`m-auto w-full max-w-md rounded-xl border border-border bg-background p-6 text-foreground shadow-lg backdrop:bg-black/50 ${className ?? ""}`.trim()}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-lg font-bold">{title}</span>
        <IconButton onClick={handleClose} aria-label="Cerrar diálogo">
          <CloseIcon className="size-5" />
        </IconButton>
      </div>
      <div>{children}</div>
      {!hideFooter && (
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" color="default" onClick={handleClose}>
            {cancelText}
          </Button>
          <Button variant="solid" onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      )}
    </dialog>
  );
};
