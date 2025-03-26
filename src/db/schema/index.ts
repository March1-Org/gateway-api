import { spreads } from 'utils/spread';

import { usersTable } from './users';

export const schema = { usersTable };

export type Schema = typeof schema;

export const schemaBodies = {
  insert: spreads(schema, 'insert'),
  select: spreads(schema, 'select'),
  update: spreads(schema, 'update'),
};

export type SchemaBodies = typeof schemaBodies;
