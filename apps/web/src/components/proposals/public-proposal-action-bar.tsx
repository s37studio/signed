"use client";

import { useState } from "react";
import { AcceptProposalModal } from "./accept-proposal-modal";
import { RequestRevisionModal } from "./request-revision-modal";
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

type PublicProposalActionBarProps = {
  token: string;
  status: string;
  onSuccess?: () => void;
};

export function PublicProposalActionBar({
  token,
  status,
  onSuccess,
}: PublicProposalActionBarProps) {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);

  const isModalOpen = showAcceptModal || showRevisionModal;

  const handleOpenAcceptModal = () => {
    setShowRevisionModal(false);
    setShowAcceptModal(true);
  };

  const handleOpenRevisionModal = () => {
    setShowAcceptModal(false);
    setShowRevisionModal(true);
  };

  const handleCloseModals = () => {
    setShowAcceptModal(false);
    setShowRevisionModal(false);
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-auto max-w-[90vw]">
        <motion.div
          layout
          initial={false}
          animate={{
            width: isModalOpen ? "auto" : "auto",
            borderRadius: 9999,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="flex items-center gap-2 p-1.5 bg-white backdrop-blur-xl shadow-lg shadow-zinc-900/5 overflow-hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isModalOpen ? (
              <motion.button
                key="close"
                initial={{ opacity: 0, scale: 0.8, rotate: -90, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.8, rotate: 90, filter: "blur(4px)" }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={handleCloseModals}
                className="flex items-center justify-center w-10 h-10 bg-white border border-zinc-200 text-zinc-900 rounded-full hover:bg-zinc-50 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.div
                key="actions"
                initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex items-center gap-2"
              >
                <button
                  onClick={handleOpenRevisionModal}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-900 text-sm font-medium rounded-full hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-200 whitespace-nowrap"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>Request Revision</span>
                </button>
                <button
                  onClick={handleOpenAcceptModal}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-full hover:bg-zinc-800 transition-all duration-200 whitespace-nowrap"
                >
                  <CheckIcon className="w-4 h-4" />
                  <span>Approve</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AcceptProposalModal
        token={token}
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        onSuccess={onSuccess}
      />

      <RequestRevisionModal
        token={token}
        isOpen={showRevisionModal}
        onClose={() => setShowRevisionModal(false)}
        onSuccess={onSuccess}
      />
    </>
  );
}
