"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  RiBook2Line,
  RiCalendarCheckLine,
  RiCalendarLine,
  RiCloseLine,
  RiDashboardLine,
  RiLogoutBoxRLine,
  RiMenuLine,
  RiSettings3Line,
} from "@remixicon/react";

import { logout } from "@/app/(dashboard)/dashboard/actions";

type Role = "student" | "teacher" | "admin";

const navigationByRole = {
  student: [
    { label: "Dashboard", href: "/dashboard/student", icon: RiDashboardLine },
    { label: "My Classes", href: "/dashboard/student#classes", icon: RiBook2Line },
    { label: "Attendance", href: "/dashboard/student#activity", icon: RiCalendarCheckLine },
    { label: "Timetable", href: "/dashboard/student#today", icon: RiCalendarLine },
    { label: "Settings", href: "/dashboard/student#profile", icon: RiSettings3Line },
  ],
  teacher: [
    { label: "Dashboard", href: "/dashboard/teacher", icon: RiDashboardLine },
    { label: "Create a class", href: "/dashboard/teacher/classes/new", icon: RiBook2Line },
    { label: "Profile", href: "/dashboard/teacher/profile", icon: RiSettings3Line },
  ],
  admin: [{ label: "Dashboard", href: "/dashboard/admin", icon: RiDashboardLine }],
} satisfies Record<Role, { label: string; href: string; icon: typeof RiDashboardLine }[]>;

function SidebarPanel({
  role,
  displayName,
  initials,
  close,
}: {
  role: Role;
  displayName: string;
  initials: string;
  close?: () => void;
}) {
  const portalLabel = role === "teacher" ? "Teacher portal" : role === "admin" ? "Admin portal" : "Student portal";

  return (
    <>
      <div className="flex items-center justify-between px-2">
        <Link href="/dashboard" onClick={close} className="text-lg font-semibold tracking-tight">
          Attendy
          <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {portalLabel}
          </span>
        </Link>
        {close && (
          <button
            type="button"
            onClick={close}
            aria-label="Close navigation"
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          >
            <RiCloseLine aria-hidden="true" className="size-5" />
          </button>
        )}
      </div>

      <p className="mb-2 mt-7 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground lg:mt-9">
        Menu
      </p>
      <nav aria-label="Dashboard navigation" className="grid grid-cols-1 gap-1">
        {navigationByRole[role].map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            onClick={close}
            aria-current={href === `/dashboard/${role}` ? "page" : undefined}
            className={`flex min-w-0 items-center gap-2.5 rounded-md px-2.5 py-2 text-xs transition-colors ${
              href === `/dashboard/${role}`
                ? "bg-primary/10 font-medium text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon aria-hidden="true" className="size-4" />
            <span className="truncate">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-border pt-5">
        <div className="flex items-center gap-3 px-2">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold">
            {initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-xs font-medium">{displayName}</span>
            <span className="block text-[11px] capitalize text-muted-foreground">{role}</span>
          </span>
        </div>
        <form action={logout} className="mt-3">
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <RiLogoutBoxRLine aria-hidden="true" className="size-4" />
            Log out
          </button>
        </form>
      </div>
    </>
  );
}

export default function ResponsiveDashboardNav({
  role,
  displayName,
}: {
  role: Role;
  displayName: string;
}) {
  const [open, setOpen] = useState(false);
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  useEffect(() => {
    if (!open) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card px-3 sm:px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-dashboard-sidebar"
          aria-label="Open navigation menu"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RiMenuLine aria-hidden="true" className="size-5" />
        </button>
        <Link href="/dashboard" className="min-w-0 truncate text-sm font-semibold tracking-tight">
          Attendy <span className="text-primary">·</span> {role} portal
        </Link>
      </header>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px] lg:hidden"
          />
          <aside
            id="mobile-dashboard-sidebar"
            aria-label={`${role} navigation`}
            className="fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col overflow-y-auto border-r border-border bg-card px-4 py-5 shadow-xl lg:hidden"
          >
            <SidebarPanel role={role} displayName={displayName} initials={initials} close={() => setOpen(false)} />
          </aside>
        </>
      )}

      <aside className="sticky top-0 hidden h-dvh min-h-0 flex-col border-r border-border bg-card px-5 py-6 lg:flex">
        <SidebarPanel role={role} displayName={displayName} initials={initials} />
      </aside>
    </>
  );
}
