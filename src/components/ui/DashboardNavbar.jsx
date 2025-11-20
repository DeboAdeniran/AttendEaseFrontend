import React from "react";
import { User, ChevronDown, Bell, Search } from "lucide-react";
import Logo from "../../assets/dashLogo.svg?react";
import Dashboard from "../../assets/Dashboard.svg?react";
import { useAuth } from "../../context/AuthContext";
const DashboardNavbar = ({ userAvatar, onMenuToggle }) => {
  const { user } = useAuth();

  const firstName = user?.profile?.first_name || user?.first_name;
  const lastName = user?.profile?.last_name || user?.last_name;

  const userName = `${lastName} ${firstName}`;
  const userEmail = user?.email || "";

  return (
    <nav
      className="border-b sticky top-0 z-30"
      style={{
        backgroundColor: "#1d1e21",
        borderColor: "#1d1e21",
      }}
    >
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Left: Menu Button (Mobile) + Dashboard Title */}
        <div className="flex items-center gap-3 md:gap-2">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: "transparent",
              color: "#838383",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(51, 84, 244, 0.1)";
              e.currentTarget.style.color = "#3354f4";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#838383";
            }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            <Dashboard />
            <Logo />
          </div>
        </div>

        {/* Right: User Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications */}
          <button
            className="p-2 rounded-lg transition-colors relative"
            style={{
              backgroundColor: "transparent",
              color: "#838383",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(51, 84, 244, 0.1)";
              e.currentTarget.style.color = "#3354f4";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#838383";
            }}
          >
            <Bell className="w-5 h-5" />
            {/* Notification badge */}
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ backgroundColor: "#3354f4" }}
            />
          </button>

          {/* User Profile */}
          <button
            className="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-2 rounded-xl transition-all"
            style={{
              backgroundColor: "rgba(51, 84, 244, 0.1)",
              border: "1px solid rgba(51, 84, 244, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(51, 84, 244, 0.15)";
              e.currentTarget.style.borderColor = "rgba(51, 84, 244, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(51, 84, 244, 0.1)";
              e.currentTarget.style.borderColor = "rgba(51, 84, 244, 0.2)";
            }}
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "#3354f4",
                border: "2px solid rgba(51, 84, 244, 0.3)",
              }}
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
              )}
            </div>

            {/* User Info - Hidden on mobile */}
            <div className="hidden sm:block text-left">
              <p className="text-white text-sm">{userName}</p>
              <p className="text-text-grey text-xs">{userEmail}</p>
            </div>

            {/* Dropdown Icon - Hidden on mobile */}
            <ChevronDown className="hidden sm:block w-4 h-4 text-text-grey" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
