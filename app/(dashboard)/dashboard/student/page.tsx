import { and, asc, eq, gte, inArray, lt } from "drizzle-orm";
import {
  RiArrowUpLine,
  RiCalendarLine,
  RiCheckLine,
  RiQrCodeLine,
  RiTimeLine,
} from "@remixicon/react";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { attendanceRecords, classSessions, enrollments, subjects } from "@/db/schema";
import { getCurrentUser, getDisplayName } from "@/lib/auth/current-user";

export const instant = false;

const timeZone = "Asia/Kolkata";
const qrPattern = [
  "1111010011111",
  "1011011010111",
  "1111010011111",
  "0000010100000",
  "1110101110101",
  "1010100010100",
  "1110111011101",
  "0010001010010",
  "1111011110111",
  "1010010010101",
  "1111011010111",
  "0000100101000",
  "1111010111101",
];

function dateKey(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function dayBoundary(key: string) {
  return new Date(`${key}T00:00:00+05:30`);
}

function addDays(key: string, count: number) {
  const date = new Date(`${key}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + count);
  return date.toISOString().slice(0, 10);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

function attendancePercent(attended: number, total: number) {
  return total ? Math.round((attended / total) * 100) : 0;
}

function MetricCard({ label, value, note, positive }: {
  label: string;
  value: string;
  note: string;
  positive?: boolean;
}) {
  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-[27px]">{value}</p>
      <p className={`mt-1.5 text-[11px] ${positive ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"}`}>
        {note}
      </p>
    </article>
  );
}

function activityColor(count: number) {
  if (count === 0) return "bg-muted";
  if (count === 1) return "bg-emerald-200 dark:bg-emerald-950";
  if (count === 2) return "bg-emerald-300 dark:bg-emerald-800";
  if (count === 3) return "bg-emerald-500 dark:bg-emerald-600";
  return "bg-emerald-700 dark:bg-emerald-400";
}

export default async function StudentDashboardPage() {
  const user = await getCurrentUser("/dashboard/student");
  if (user.role !== "student") redirect("/dashboard");
  if (!user.profileCompletedAt) redirect("/dashboard/student/profile");

  const now = new Date();
  const today = dateKey(now);
  const tomorrow = addDays(today, 1);
  const yearAgo = addDays(today, -363);
  const [enrolledSubjects, records] = await Promise.all([
    db
      .select({ id: subjects.id, name: subjects.name, code: subjects.code, room: subjects.room })
      .from(enrollments)
      .innerJoin(subjects, eq(enrollments.subjectId, subjects.id))
      .where(eq(enrollments.studentId, user.id))
      .orderBy(asc(subjects.name)),
    db
      .select({
        subjectId: classSessions.subjectId,
        status: attendanceRecords.status,
        markedAt: attendanceRecords.markedAt,
        sessionId: attendanceRecords.sessionId,
      })
      .from(attendanceRecords)
      .innerJoin(classSessions, eq(attendanceRecords.sessionId, classSessions.id))
      .where(eq(attendanceRecords.studentId, user.id)),
  ]);

  const subjectIds = enrolledSubjects.map((subject) => subject.id);
  const todaySessions = subjectIds.length
    ? await db
        .select({
          id: classSessions.id,
          subjectId: classSessions.subjectId,
          subjectName: subjects.name,
          startsAt: classSessions.startsAt,
          endsAt: classSessions.endsAt,
          room: classSessions.room,
          subjectRoom: subjects.room,
        })
        .from(classSessions)
        .innerJoin(subjects, eq(classSessions.subjectId, subjects.id))
        .where(
          and(
            inArray(classSessions.subjectId, subjectIds),
            gte(classSessions.startsAt, dayBoundary(today)),
            lt(classSessions.startsAt, dayBoundary(tomorrow)),
          ),
        )
        .orderBy(asc(classSessions.startsAt))
    : [];

  const attendedCount = records.filter((record) => record.status !== "absent").length;
  const totalRecords = records.length;
  const percentage = attendancePercent(attendedCount, totalRecords);
  const activityCounts = new Map<string, number>();
  for (const record of records) {
    if (record.status === "absent" || dateKey(record.markedAt) < yearAgo) continue;
    const key = dateKey(record.markedAt);
    activityCounts.set(key, (activityCounts.get(key) ?? 0) + 1);
  }

  const presentDays = new Set(activityCounts.keys());
  let streak = 0;
  let streakDate = presentDays.has(today) ? today : addDays(today, -1);
  while (presentDays.has(streakDate)) {
    streak += 1;
    streakDate = addDays(streakDate, -1);
  }

  const days = Array.from({ length: 364 }, (_, index) => {
    const key = addDays(today, index - 363);
    return { key, count: activityCounts.get(key) ?? 0 };
  });
  const leadingHeatmapCells = new Date(`${days[0].key}T00:00:00Z`).getUTCDay();
  const heatmapCells = [
    ...Array.from({ length: leadingHeatmapCells }, () => null),
    ...days,
  ];
  const marksBySession = new Map(records.map((record) => [record.sessionId, record.status]));
  const subjectStats = enrolledSubjects.map((subject) => {
    const subjectRecords = records.filter((record) => record.subjectId === subject.id);
    const attended = subjectRecords.filter((record) => record.status !== "absent").length;
    return {
      ...subject,
      percentage: attendancePercent(attended, subjectRecords.length),
      total: subjectRecords.length,
    };
  });

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1440px] space-y-5">
      <header className="flex min-w-0 flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.13em] text-muted-foreground">Student overview</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Welcome back, {user.displayName ?? getDisplayName(user.email)}. Here&apos;s your attendance overview.</p>
        </div>
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{formatDate(now)}</p>
      </header>

      <section aria-label="Attendance summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Overall attendance"
          value={`${percentage}%`}
          note={totalRecords ? (percentage >= 75 ? "Above required 75%" : "Below required 75%") : "No attendance recorded yet"}
          positive={percentage >= 75 && totalRecords > 0}
        />
        <MetricCard label="Classes attended" value={`${attendedCount} / ${totalRecords}`} note={totalRecords - attendedCount + " classes missed"} />
        <MetricCard label="Active subjects" value={String(enrolledSubjects.length)} note="Current enrollment" />
        <MetricCard label="Current streak" value={`${streak} ${streak === 1 ? "day" : "days"}`} note={streak ? "Keep it going" : "Your next class starts a streak"} positive={streak > 0} />
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <article id="today" className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="mb-3">
            <h2 className="text-sm font-semibold">Today&apos;s classes</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Your schedule for today</p>
          </div>
          {todaySessions.length ? (
            <ul className="divide-y divide-border">
              {todaySessions.map((session) => {
                const status = marksBySession.get(session.id);
                const isOver = session.endsAt < now;
                const label = status === "present" || status === "late"
                  ? status === "late" ? "Present · late" : "Present"
                  : status === "absent" ? "Absent" : isOver ? "Awaiting record" : "Upcoming";
                return (
                  <li key={session.id} className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-3 py-3 first:pt-1 last:pb-1 sm:grid-cols-[68px_minmax(0,1fr)_110px]">
                    <time className="text-[11px] text-muted-foreground">{formatTime(session.startsAt)}</time>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold">{session.subjectName}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{session.room ?? session.subjectRoom ?? "Room not set"}</p>
                    </div>
                    <span className={`text-right text-[10px] font-medium ${status === "present" || status === "late" ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"}`}>
                      {label}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex min-h-36 flex-col items-center justify-center rounded-lg border border-dashed border-border px-4 text-center">
              <RiCalendarLine aria-hidden="true" className="size-5 text-muted-foreground" />
              <p className="mt-2 text-xs font-medium">No classes scheduled today</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Your enrolled classes will appear here.</p>
            </div>
          )}
        </article>

        <article className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div>
            <h2 className="text-sm font-semibold">QR attendance</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Check in when your teacher shares a class QR code.</p>
          </div>
          <div className="mx-auto mt-4 grid size-32 grid-cols-[repeat(13,minmax(0,1fr))] gap-0.5 rounded-lg border border-border bg-background p-2" aria-hidden="true">
            {qrPattern.join("").split("").map((pixel, index) => (
              <span key={index} className={pixel === "1" ? "rounded-[1px] bg-foreground" : ""} />
            ))}
          </div>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground">
            <RiQrCodeLine aria-hidden="true" className="size-4" />
            QR check-in is coming soon
          </p>
          <button type="button" disabled className="mt-3 flex h-8 w-full items-center justify-center gap-2 rounded-md bg-primary text-xs font-medium text-primary-foreground opacity-60">
            <RiQrCodeLine aria-hidden="true" className="size-4" /> Scan QR
          </button>
        </article>
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <article id="classes" className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Subject-wise attendance</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Track your progress across subjects</p>
          </div>
          {subjectStats.length ? (
            <ul className="space-y-4">
              {subjectStats.map((subject) => (
                <li key={subject.id}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-[11px]">
                    <span className="truncate font-medium">{subject.name}</span>
                    <span>{subject.total ? `${subject.percentage}%` : "—"}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-foreground transition-[width]" style={{ width: `${subject.percentage}%` }} />
                  </div>
                  {!subject.total && <p className="mt-1 text-[10px] text-muted-foreground">No classes recorded yet</p>}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex min-h-36 min-w-0 flex-col items-center justify-center rounded-lg border border-dashed border-border px-4 text-center">
              <p className="text-xs font-medium">No subjects yet</p>
              <p className="mt-1 w-full max-w-sm break-words text-[11px] text-muted-foreground">Your class enrollments will appear here once they have been added.</p>
            </div>
          )}
        </article>

        <article id="activity" className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold">Attendance activity</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Your check-ins over the past year</p>
            </div>
            {attendedCount > 0 && <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400"><RiArrowUpLine aria-hidden="true" className="size-3" /> {attendedCount} attended</span>}
          </div>
          <div className="overflow-x-auto pb-1">
            <div className="grid w-max grid-flow-col grid-rows-7 gap-px sm:gap-0.5 lg:gap-1" role="img" aria-label="Attendance activity heatmap for the last 52 weeks. Darker squares represent more attended classes.">
              {heatmapCells.map((day, index) => (
                <span
                  key={day?.key ?? `padding-${index}`}
                  title={day ? `${day.key}: ${day.count} ${day.count === 1 ? "class" : "classes"} attended` : undefined}
                  className={`size-[6px] rounded-[2px] sm:size-[8px] lg:size-[11px] ${activityColor(day?.count ?? 0)}`}
                />
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Less</span>
            <div className="flex items-center gap-1" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((level) => <span key={level} className={`size-[10px] rounded-[2px] ${activityColor(level)}`} />)}
            </div>
            <span>More</span>
          </div>
          <p className="mt-4 flex min-w-0 flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
            <RiTimeLine aria-hidden="true" className="size-3" />
            <span className="min-w-0 break-words">{records.filter((record) => dateKey(record.markedAt) >= yearAgo).length} attendance records in the past year</span>
            {attendedCount > 0 && <RiCheckLine aria-hidden="true" className="ml-auto size-3 text-emerald-600" />}
          </p>
        </article>
      </section>
    </div>
  );
}
