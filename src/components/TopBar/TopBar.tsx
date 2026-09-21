import "./TopBar.css";

interface TopBarProps {
  siteName: string;
  navLinks?: string[];
}

export const TopBar = ({ siteName, navLinks = ["Index", "Contact"] }: TopBarProps) => (
  <header className="top-bar">
    <div className="top-bar__name">{siteName}</div>
    <nav className="top-bar__nav">
      {navLinks.map((link) => (
        <a key={link} href={`#${link.toLowerCase()}`} className="top-bar__link">
          {link}
        </a>
      ))}
    </nav>
  </header>
);
