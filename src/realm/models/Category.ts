import { Realm } from '@realm/react';

export class Category extends Realm.Object {
  _id!: string;
  name!: string;
  color!: string;
  isDefault!: boolean;
  createdAt!: Date;

  static schema = {
    name: 'Category',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      name: 'string',
      color: 'string',
      isDefault: 'bool',
      createdAt: 'date',
    },
  };
} 