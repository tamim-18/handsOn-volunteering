"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HandHeart, 
  Home, 
  Calendar, 
  Users, 
  HelpCircle, 
  Award,
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Events", href: "/dashboard/events", icon: Calendar },
  { name: "Teams", href: "/dashboard/teams", icon: Users },
  { name: "Help Requests", href: "/dashboard/help-requests", icon: HelpCircle },
  { name: "Impact", href: "/dashboard/impact", icon: Award },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 z-50 flex w-72 flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-card px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center gap-2">
            <HandHeart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">HandsOn</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted"
                          )}
                        >
                          <item.icon className="h-6 w-6 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <Link
                  href="/auth"
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold text-muted-foreground hover:bg-muted"
                >
                  <LogOut className="h-6 w-6 shrink-0" />
                  Logout
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <main className="pl-72">
        <div className="px-8 py-6">{children}</div>
      </main>
    </div>
  );
}