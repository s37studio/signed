import { protectedProcedure, publicProcedure, router } from "../index";

import { leadController } from "../controllers/lead.controller";
import { proposalController } from "../controllers/proposal.controller";
import { proposalViewController } from "../controllers/proposal-view.controller";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  lead: leadController,
  proposal: proposalController,
  proposalView: proposalViewController,
});
export type AppRouter = typeof appRouter;
