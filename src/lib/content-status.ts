import type { Block } from "@/content/types";
export const draftAttr = (block: Pick<Block, "status">) => block.status === "draft" ? "draft" : undefined;
