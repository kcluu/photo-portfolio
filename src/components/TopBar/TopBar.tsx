import type { CategoryFilter } from "../../types";
import "./TopBar.css";

interface TopBarProps {
  siteName: string;
  navLinks?: string[];
  lightsOn: boolean;
  onToggleLights: () => void;
  categories: CategoryFilter[];
  categoryLabels: Record<CategoryFilter, string>;
  activeCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  activeLink: string | null;
  onOpenLink: (link: string) => void;
}

export const TopBar = ({
  siteName,
  navLinks = ["About", "Contact"],
  lightsOn,
  onToggleLights,
  categories,
  categoryLabels,
  activeCategory,
  onSelectCategory,
  activeLink,
  onOpenLink,
}: TopBarProps) => (
  <header className="top-bar">
    <div className="top-bar-name">{siteName}</div>

    <div className="top-bar-scroll">
      <div className="top-bar-categories">
        {categories.map((category) => {
          const isActive = category === activeCategory;
          return (
            <button
              key={category}
              type="button"
              className={`top-bar-category-tab ${isActive ? "top-bar-category-tab-active" : ""}`}
              onClick={() => onSelectCategory(category)}
            >
              <span className="top-bar-category-paren" aria-hidden="true">
                (
              </span>
              {categoryLabels[category]}
              <span className="top-bar-category-paren" aria-hidden="true">
                )
              </span>
            </button>
          );
        })}
      </div>

      <nav className="top-bar-nav">
        {navLinks.map((link) => (
          <button
            key={link}
            type="button"
            className={`top-bar-link ${link === activeLink ? "top-bar-link-active" : ""}`}
            onClick={() => onOpenLink(link)}
          >
            <span className="top-bar-link-paren" aria-hidden="true">
              (
            </span>
            {link}
            <span className="top-bar-link-paren" aria-hidden="true">
              )
            </span>
          </button>
        ))}
      </nav>
    </div>

    <button
      type="button"
      className={`top-bar-light-switch ${lightsOn ? "top-bar-light-switch-on" : ""}`}
      onClick={onToggleLights}
      aria-pressed={lightsOn}
      aria-label={lightsOn ? "Turn lights off" : "Turn lights on"}
    >
      <svg
        className="top-bar-light-switch-icon"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18h6" />
        <path d="M10 21h4" />
        <path d="M12 3a6 6 0 0 0-4 10.47c.6.55 1 1.32 1 2.15V16h6v-.38c0-.83.4-1.6 1-2.15A6 6 0 0 0 12 3Z" />
        <g className="top-bar-light-switch-rays">
          <path d="M12 0v2" />
          <path d="M6.5 1.5l1.5 2" />
          <path d="M17.5 1.5l-1.5 2" />
        </g>
      </svg>
    </button>
  </header>
);
