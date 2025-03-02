import { createRealmContext } from '@realm/react';
import { Note } from './models/Note';
import { Category } from './models/Category';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import Realm from 'realm';

const config = {
  schema: [Note, Category],
  schemaVersion: 2,
  onFirstOpen: (realm: Realm) => {
    // Check if categories already exist
    const existingCategories = realm.objects('Category');
    
    if (existingCategories.length === 0) {
      // Add default categories only if no categories exist
      realm.write(() => {
        DEFAULT_CATEGORIES.forEach(category => {
          realm.create('Category', {
            _id: category._id,
            name: category.name,
            color: category.color,
            isDefault: category.isDefault,
            createdAt: new Date(),
          });
        });
      });
    }
  },
};

export const RealmContext = createRealmContext(config); 