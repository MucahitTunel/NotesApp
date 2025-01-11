import { createRealmContext } from '@realm/react';
import { Note } from './models/Note';

export const RealmContext = createRealmContext({
  schema: [Note],
  schemaVersion: 1,
}); 