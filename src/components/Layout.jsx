import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { 
  LayoutDashboard, 
  Package, 
  LogOut, 
  Moon, 
  Sun,
  Menu,
  X,
  User
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Layout({ children }) {
  const { user, logout, isManager } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    ...(isManager() ? [{ to: "/", icon: LayoutDashboard, label: "Dashboard" }] : []),
    { to: "/products", icon: Package, label: "Products" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b z-40 px-4 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Package className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">CMS</span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-card border-r z-50 transform transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 px-4 flex items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-sm">Commodities</h1>
                <p className="text-xs text-muted-foreground">Management System</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User & Actions */}
          <div className="p-4 border-t space-y-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>

            {/* User Info */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>

            {/* Logout */}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start gap-3"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
