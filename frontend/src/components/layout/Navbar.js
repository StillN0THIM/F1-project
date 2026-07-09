import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { path: "/",          label: "Home" },
  { path: "/standings", label: "Standings" },
  { path: "/calendar",  label: "Calendar" },
  { path: "/news",      label: "News" },
];
// Defined outside the component so it doesn't re-create on every render

function Navbar() {
  const location = useLocation();
  // useLocation tells us the current URL so we can highlight the active link

  return (
    <nav className="bg-surface border-b border-white/10 sticky top-0 z-50">
      {/* sticky top-0 keeps the navbar visible as you scroll */}
      <div className="max-w-7xl mx-auto px-4 flex items-center h-16">

        {/* Logo */}
        <Link to="/" className="font-display text-2xl font-bold tracking-widest text-white uppercase mr-10">
          F1 <span className="text-f1red">Dashboard</span>
        </Link>

        {/* Nav links */}
        <div className="flex gap-1">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm font-medium uppercase tracking-wider transition-colors
                  ${isActive
                    ? "text-white border-b-2 border-f1red"
                    : "text-muted hover:text-white"
                  }`}
                  // Active page gets a red underline, inactive pages are muted
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;