import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Home,
  UtensilsCrossed,
  Stethoscope,
  Leaf,
  Droplets,
  Hand,
  HeartPulse,
  ShieldAlert,
  CalendarCheck,
  GraduationCap,
  BookOpen,
} from "lucide-react";

const sections = [
  { label: "Home", path: "/", icon: Home },
  { label: "Recipes", path: "/recipes", icon: UtensilsCrossed },
  { label: "Remedies", path: "/remedies", icon: Stethoscope },
  { label: "Herbs", path: "/herbs", icon: Leaf },
  { label: "Oils", path: "/oils", icon: Droplets },
  { label: "Acupressure", path: "/acupressure", icon: Hand },
  { label: "Prevention", path: "/prevention", icon: HeartPulse },
  { label: "Emergency", path: "/emergency", icon: ShieldAlert },
  { label: "Screening", path: "/screening", icon: CalendarCheck },
  { label: "Educational", path: "/educational", icon: GraduationCap },
  { label: "Narratives", path: "/narratives", icon: BookOpen },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-2">
          <Leaf className="h-7 w-7 text-sidebar-primary" />
          <span className="font-display text-lg font-bold text-sidebar-foreground">
            Wellness Bible
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sections.map((s) => (
                <SidebarMenuItem key={s.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      s.path === "/"
                        ? location.pathname === "/"
                        : location.pathname.startsWith(s.path)
                    }
                    tooltip={s.label}
                  >
                    <Link to={s.path}>
                      <s.icon className="h-4 w-4" />
                      <span>{s.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 text-xs text-sidebar-foreground/50 font-body">
        © {new Date().getFullYear()} Wellness Bible
      </SidebarFooter>
    </Sidebar>
  );
}
