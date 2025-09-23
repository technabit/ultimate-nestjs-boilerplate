import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Queue } from '@technabit/nest-core';

// Define Bull Board features to expose for this app. Adjust per app needs.
export const bullBoardFeatures = (Object.values(Queue) as string[]).map(
  (name) => ({
    name,
    adapter: BullMQAdapter,
  }),
);

export default bullBoardFeatures;
