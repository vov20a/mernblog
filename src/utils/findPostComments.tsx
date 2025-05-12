import { Dictionary, EntityId } from '@reduxjs/toolkit';
import { IComment } from '../types/IComment';

export const findPostComments = (
  entities: Dictionary<IComment> | undefined,
  ids: EntityId[] | undefined,
  id: string | undefined,
) => {
  const arr = [];
  for (const ID of ids ?? []) {
    if (entities && entities[ID]?.post === null) continue;
    if (entities && entities[ID]?.post._id === id) {
      arr.push(entities[ID]);
    }
  }
  return arr;
};
