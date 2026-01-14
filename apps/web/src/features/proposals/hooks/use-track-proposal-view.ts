import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";

import { trpc } from "@/utils/trpc";

export function useTrackProposalView(proposalId: string) {
  const viewIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const trackView = useMutation(trpc.proposalView.trackView.mutationOptions());
  const updateDuration = useMutation(
    trpc.proposalView.updateDuration.mutationOptions()
  );

  // Track view on mount
  useEffect(() => {
    if (!proposalId) return;
    
    const initTracking = async () => {
      try {
        const result = await trackView.mutateAsync({
          proposalId,
        });
        viewIdRef.current = result.id;
        startTimeRef.current = Date.now();
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    };

    initTracking();
  }, [proposalId]);

  // Update duration on unmount or visibility change
  useEffect(() => {
    const updateViewDuration = async () => {
      if (!viewIdRef.current) return;

      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      
      if (duration > 0) {
        try {
          await updateDuration.mutateAsync({
            viewId: viewIdRef.current,
            duration,
          });
        } catch (error) {
          console.error("Error updating duration:", error);
        }
      }
    };

    // Update on visibility change (tab switch)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateViewDuration();
      } else {
        // Reset start time when coming back
        startTimeRef.current = Date.now();
      }
    };

    // Update before unload
    const handleBeforeUnload = () => {
      updateViewDuration();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      updateViewDuration();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return {
    isTracking: !!viewIdRef.current,
  };
}
