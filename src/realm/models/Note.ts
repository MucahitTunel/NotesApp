import { Realm } from '@realm/react';

export class Note extends Realm.Object {
  _id!: string;
  title!: string;
  content!: string;
  importance!: number;
  createdAt!: Date;

  static schema = {
    name: 'Note',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      title: 'string',
      content: 'string',
      importance: 'int',
      createdAt: 'date',
    },
  };
} 