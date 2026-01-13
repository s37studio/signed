import { protectedProcedure, publicProcedure, router } from "../index";

import { leadController } from "../controllers/lead.controller";

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
});
export type AppRouter = typeof appRouter;
