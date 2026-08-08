import categories from "./categories.js";

export function getCategory(extension) {
    
  extension = extension.toLowerCase();

  for (const category in categories) {
    if (categories[category].includes(extension)) {
      return category;
    }
  }

  return "Others";
}

