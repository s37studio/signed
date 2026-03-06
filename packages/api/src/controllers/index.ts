import { publicProcedure, router } from "../index";

import { leadController } from "../controllers/lead.controller";
import { mcpKeyController } from "../controllers/mcp-key.controller";
import { organizationController } from "../controllers/organization.controller";
import { proposalController } from "../controllers/proposal.controller";
import { proposalViewController } from "../controllers/proposal-view.controller";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => "OK"),
  lead: leadController,
  proposal: proposalController,
  proposalView: proposalViewController,
  organization: organizationController,
  mcpKey: mcpKeyController,
});
export type AppRouter = typeof appRouter;
