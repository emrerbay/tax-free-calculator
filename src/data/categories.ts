export type Category = {
  id: string;
  name: string;
  icon: string;
};

export const categories: Category[] = [
  { id: "food", name: "Food & Drinks", icon: "🍽️" },
  { id: "tech", name: "Technology", icon: "💻" },
  { id: "fashion", name: "Fashion", icon: "👕" },
  { id: "transport", name: "Transportation", icon: "🚆" },
  { id: "beauty", name: "Beauty & Health", icon: "💄" },
  { id: "gifts", name: "Gifts & Souvenirs", icon: "🎁" },
  { id: "entertainment", name: "Entertainment", icon: "🎭" },
  { id: "other", name: "Other", icon: "📦" },
];
