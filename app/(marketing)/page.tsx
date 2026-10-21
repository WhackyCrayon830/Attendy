import Link from "next/link";
import { RiArrowRightLine, RiCalendarCheckLine, RiLineChartLine, RiQrCodeLine } from "@remixicon/react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-1 flex-col bg-background">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight">Attendy<span className="text-primary">.</span></Link>
      </header>

      <section className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500" /> Attendance, made clearer
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Beyond the<br className="hidden sm:block" /> roll call.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
            Keep classes organized and attendance easy to understand. Students see their progress; teachers can bring their classes together in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Get started <RiArrowRightLine aria-hidden="true" className="size-4" />
            </Link>
            <Link href="/login" className="inline-flex h-10 items-center rounded-md border border-border bg-card px-4 text-sm font-medium hover:bg-muted">
              Log in
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">New here? Your account starts with student access.</p>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-5 rounded-[2rem] bg-primary/5 blur-2xl" aria-hidden="true" />
          <div className="relative rounded-2xl border border-border bg-card p-5 shadow-xl shadow-foreground/5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Student overview</p>
                <h2 className="mt-1 text-lg font-semibold">Your attendance, at a glance</h2>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">On track</span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border p-4">
                <p className="text-[11px] text-muted-foreground">Overall attendance</p>
                <p className="mt-2 text-2xl font-semibold">87%</p>
                <div className="mt-3 h-1.5 rounded-full bg-muted"><div className="h-full w-[87%] rounded-full bg-primary" /></div>
              </div>
              <div className="rounded-xl border border-border p-4">
                <p className="text-[11px] text-muted-foreground">Classes attended</p>
                <p className="mt-2 text-2xl font-semibold">42 <span className="text-sm font-normal text-muted-foreground">/ 48</span></p>
                <p className="mt-2 text-[10px] text-muted-foreground">Across your subjects</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium">Attendance activity</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">A year of steady progress</p>
                </div>
                <RiLineChartLine aria-hidden="true" className="size-4 text-primary" />
              </div>
              <div className="mt-4 grid grid-flow-col grid-rows-7 gap-1" aria-hidden="true">
                {Array.from({ length: 84 }, (_, index) => {
                  const level = (index * 7 + Math.floor(index / 4)) % 5;
                  const color = ["bg-muted", "bg-emerald-200 dark:bg-emerald-950", "bg-emerald-300 dark:bg-emerald-800", "bg-emerald-500 dark:bg-emerald-600", "bg-emerald-700 dark:bg-emerald-400"][level];
                  return <span key={index} className={`aspect-square rounded-[2px] ${color}`} />;
                })}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-muted/60 p-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-card text-primary"><RiCalendarCheckLine aria-hidden="true" className="size-4" /></span>
              <span className="flex-1"><span className="block text-xs font-medium">Next class</span><span className="mt-0.5 block text-[10px] text-muted-foreground">Your schedule lives on your dashboard</span></span>
              <RiQrCodeLine aria-hidden="true" className="size-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-4 text-center text-[11px] text-muted-foreground">
        Attendy · Attendance made easier to follow
      </footer>
    </main>
  );
}
