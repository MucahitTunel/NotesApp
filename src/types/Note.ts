export type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  importance: 1 | 2 | 3 | 4 | 5;
  category?: {
    _id: string;
    name: string;
    color: string;
    isDefault: boolean;
  } | null;
}; 