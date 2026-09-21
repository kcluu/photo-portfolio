import type { CategoryFilter } from "../../types";
import "./CategoryTabs.css";

interface CategoryTabsProps {
  categories: CategoryFilter[];
  labels: Record<CategoryFilter, string>;
  activeCategory: CategoryFilter;
  accentColor: string;
  onSelect: (category: CategoryFilter) => void;
}

export const CategoryTabs = ({
  categories,
  labels,
  activeCategory,
  accentColor,
  onSelect,
}: CategoryTabsProps) => (
  <div className="category-tabs">
    {categories.map((category) => {
      const isActive = category === activeCategory;
      return (
        <button
          key={category}
          type="button"
          className="category-tabs__tab"
          style={{
            color: isActive ? accentColor : undefined,
            borderBottomColor: isActive ? accentColor : "transparent",
          }}
          onClick={() => onSelect(category)}
        >
          {labels[category]}
        </button>
      );
    })}
  </div>
);
