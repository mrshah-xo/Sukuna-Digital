"use client";

import { useState, createContext, useContext, useRef, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Home,
  BookOpen,
  Calendar,
  MessageSquare,
  User,
  Images,
  Menu,
  X,
  Settings,
} from "lucide-react";
import HomePage from "./components/HomePage";
import MemoryWall from "./components/MemoryWall";
import SukunaBook from "./components/SukunaBook";
import CalendarView from "./components/CalendarView";
import TeachersView from "./components/TeachersView";
import ProfileView from "./components/ProfileView";
import SettingsView from "./components/SettingsView";
import LibraryView from "./components/LibraryView";
import BusTrackView from "./components/BusTrackView";
import EvaluationReportView from "./components/EvaluationReportView";
import NotesMandir from "./components/NotesMandir";

export type TabType =
  | "home"
  | "sukuna-book"
  | "calendar"
  | "memory"
  | "profile"
  | "settings"
  | "library"
  | "bus-track"
  | "evaluation"
  | "notes-mandir"
  | "teachers";

const TAB_IDS: readonly TabType[] = [
  "home",
  "sukuna-book",
  "calendar",
  "memory",
  "profile",
  "settings",
  "library",
  "bus-track",
  "evaluation",
  "notes-mandir",
  "teachers",
];

const getTabFromParam = (tab: string | null): TabType => {
  return TAB_IDS.includes(tab as TabType) ? (tab as TabType) : "home";
};

interface ProfileData {
  name: string;
  studentId: string;
  class: string;
  rollNo: string;
  profilePicture: string;
  attendance: number;
  gpa: number;
  starPoints: number;
  dateOfBirth: string;
  bloodGroup: string;
  email: string;
  phone: string;
  address: string;
  showAcademicInfo: boolean;
}

interface ProfileContextType {
  profileData: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
}

const ProfileContext = createContext<
  ProfileContextType | undefined
>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error(
      "useProfile must be used within ProfileProvider",
    );
  }
  return context;
};

export default function App() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = getTabFromParam(searchParams.get("tab"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const mainRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => {
      const y = el.scrollTop;
      setHeaderVisible(y < lastScrollY.current || y < 10);
      lastScrollY.current = y;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Rahul Sharma",
    studentId: "SS2024001",
    class: "Class 10-A",
    rollNo: "12",
    profilePicture:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
    attendance: 94.5,
    gpa: 3.8,
    starPoints: 847,
    dateOfBirth: "January 15, 2010",
    bloodGroup: "O+",
    email: "rahul.sharma@sukunaschool.edu",
    phone: "+977 9841234567",
    address: "Kathmandu, Nepal",
    showAcademicInfo: true,
  });

  const updateProfile = (data: Partial<ProfileData>) => {
    setProfileData((prev) => ({ ...prev, ...data }));
  };

  const navigateToTab = (tab: TabType) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "home") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  // Bottom nav items (mobile — 5 max)
  const bottomNavItems = [
    { id: "home" as TabType, icon: Home, label: "Home" },
    {
      id: "sukuna-book" as TabType,
      icon: BookOpen,
      label: "SukunaBook",
    },
    { id: "memory" as TabType, icon: Images, label: "Memory" },
    {
      id: "calendar" as TabType,
      icon: Calendar,
      label: "Calendar",
    },
    { id: "profile" as TabType, icon: User, label: "Profile" },
  ];

  // Sidebar nav items (desktop — all sections)
  const sidebarNavItems = [
    { id: "home" as TabType, icon: Home, label: "Home" },
    {
      id: "sukuna-book" as TabType,
      icon: BookOpen,
      label: "Sukuna Book",
    },
    {
      id: "memory" as TabType,
      icon: Images,
      label: "Memory Wall",
    },
    {
      id: "calendar" as TabType,
      icon: Calendar,
      label: "Calendar",
    },
    { id: "profile" as TabType, icon: User, label: "Profile" },
    {
      id: "teachers" as TabType,
      icon: MessageSquare,
      label: "Connect with Teacher",
    },
    {
      id: "settings" as TabType,
      icon: Settings,
      label: "Settings",
    },
  ];

  // Hamburger menu items (mobile overflow)
  const mobileMenuItems = [
    ...bottomNavItems,
    {
      id: "teachers" as TabType,
      icon: MessageSquare,
      label: "Connect with Teacher",
    },
    {
      id: "settings" as TabType,
      icon: Settings,
      label: "Settings",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomePage onNavigate={navigateToTab} />;
      case "memory":
        return <MemoryWall />;
      case "sukuna-book":
        return <SukunaBook />;
      case "calendar":
        return <CalendarView />;
      case "profile":
        return <ProfileView />;
      case "settings":
        return <SettingsView />;
      case "library":
        return <LibraryView onBack={() => navigateToTab("home")} />;
      case "bus-track":
        return <BusTrackView onBack={() => navigateToTab("home")} />;
      case "evaluation":
        return <EvaluationReportView onBack={() => navigateToTab("home")} />;
      case "notes-mandir":
        return <NotesMandir onBack={() => navigateToTab("home")} />;
      case "teachers":
        return <TeachersView />;
      default:
        return <HomePage onNavigate={navigateToTab} />;
    }
  };

  return (
    <ProfileContext.Provider
      value={{ profileData, updateProfile }}
    >
      <div
        className="size-full flex flex-col md:flex-row"
        style={{
          backgroundColor: "#f5f5f7",
          fontFamily:
            '"SF Pro Text", "Inter", system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Desktop Sidebar — Apple global-nav style */}
        <aside
          className="hidden md:flex md:flex-col w-60 h-screen sticky top-0"
          style={{
            backgroundColor: "#000000",
            borderRight: "1px solid #1a1a1a",
          }}
        >
          {/* Logo */}
          <div
            className="p-5"
            style={{ borderBottom: "1px solid #1a1a1a" }}
          >
            <div className="flex items-center gap-3">
              <img
                src="/src/imports/ChatGPT_Image_May_15__2026__02_29_14_PM_Zawa-1.png"
                alt="Sukuna School Logo"
                className="size-9 object-contain"
              />
              <div>
                <h1
                  style={{
                    fontFamily:
                      '"SF Pro Display", "Inter", system-ui, -apple-system, sans-serif',
                    fontSize: "17px",
                    fontWeight: 600,
                    letterSpacing: "-0.374px",
                    color: "#ffffff",
                    lineHeight: 1.24,
                  }}
                >
                  Sukuna School
                </h1>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#7a7a7a",
                    letterSpacing: "-0.12px",
                  }}
                >
                  Digital Platform
                </p>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateToTab(item.id)}
                  className="w-full flex items-center gap-3 transition-all"
                  style={{
                    padding: "10px 12px",
                    borderRadius: "9999px",
                    backgroundColor: isActive
                      ? "#0066cc"
                      : "transparent",
                    color: isActive ? "#ffffff" : "#7a7a7a",
                    fontSize: "14px",
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: "-0.224px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "#1a1a1a";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "transparent";
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom profile hint */}
          <div
            className="p-4"
            style={{ borderTop: "1px solid #1a1a1a" }}
          >
            <button
              onClick={() => navigateToTab("profile")}
              className="w-full flex items-center gap-3 transition-all"
              style={{
                padding: "8px 12px",
                borderRadius: "9999px",
                backgroundColor:
                  activeTab === "profile"
                    ? "#0066cc"
                    : "transparent",
                color:
                  activeTab === "profile"
                    ? "#ffffff"
                    : "#cccccc",
                fontSize: "13px",
              }}
            >
              <div
                className="size-8 rounded-full overflow-hidden flex-shrink-0"
                style={{ border: "2px solid #333333" }}
              >
                <img
                  src={profileData.profilePicture}
                  alt="Profile"
                  className="size-full object-cover"
                />
              </div>
              <div className="text-left min-w-0">
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#ffffff",
                    lineHeight: 1.2,
                    letterSpacing: "-0.12px",
                  }}
                  className="truncate"
                >
                  {profileData.name}
                </p>
                <p
                  style={{ fontSize: "11px", color: "#7a7a7a" }}
                  className="truncate"
                >
                  {profileData.class}
                </p>
              </div>
            </button>
          </div>
        </aside>

        {/* Mobile Header — Apple black global-nav */}
        <header
          className="md:hidden flex items-center justify-between fixed top-0 left-0 right-0 z-50"
          style={{
            backgroundColor: "#000000",
            borderBottom: "1px solid #1a1a1a",
            height: "44px",
            padding: "0 16px",
            transform: headerVisible ? "translateY(0)" : "translateY(-100%)",
            transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div className="flex items-center gap-2">
            <img
              src="/src/imports/ChatGPT_Image_May_15__2026__02_29_14_PM_Zawa-1.png"
              alt="Sukuna School Logo"
              className="size-7 object-contain"
            />
            <span
              style={{
                fontFamily:
                  '"SF Pro Display", "Inter", system-ui, -apple-system, sans-serif',
                fontSize: "17px",
                fontWeight: 600,
                color: "#ffffff",
                letterSpacing: "-0.374px",
              }}
            >
              Sukuna School
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: "#ffffff", padding: "6px" }}
          >
            {mobileMenuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-40"
            style={{
              top: "44px",
              backgroundColor: "rgba(0,0,0,0.6)",
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="h-full p-3 space-y-0.5 overflow-y-auto [&::-webkit-scrollbar]:hidden"
              style={{
                width: "240px",
                backgroundColor: "#000000",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {mobileMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigateToTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 transition-all"
                    style={{
                      padding: "10px 14px",
                      borderRadius: "9999px",
                      backgroundColor: isActive
                        ? "#0066cc"
                        : "transparent",
                      color: isActive ? "#ffffff" : "#cccccc",
                      fontSize: "15px",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    <Icon size={19} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content */}
        <main
          ref={mainRef}
          className="flex-1 pb-20 md:pb-0 pt-[44px] md:pt-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ backgroundColor: "#f5f5f7" }}
        >
          {renderContent()}
        </main>

        {/* Mobile Bottom Navigation — Apple tab bar style */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around z-50"
          style={{
            backgroundColor: "rgba(255,255,255,0.92)",
            backdropFilter: "saturate(180%) blur(20px)",
            WebkitBackdropFilter: "saturate(180%) blur(20px)",
            borderTop: "1px solid #e0e0e0",
            height: "83px",
            paddingBottom: "20px",
            paddingTop: "10px",
          }}
        >
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateToTab(item.id)}
                className="flex flex-col items-center gap-0.5 flex-1 transition-all"
                style={{ minWidth: 0 }}
              >
                <Icon
                  size={24}
                  style={{
                    color: isActive ? "#0066cc" : "#7a7a7a",
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#0066cc" : "#7a7a7a",
                    letterSpacing: "-0.12px",
                    lineHeight: 1.2,
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </ProfileContext.Provider>
  );
}
