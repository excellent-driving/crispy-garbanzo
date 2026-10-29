"use client";

import { useMemo, useState } from "react";

export type StudentRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  language: "EN" | "NL";
  courseAccess: boolean;
  /** Null: no package yet, so the student sees every module (as before packages decided this). */
  packageId: string | null;
  createdAt: string;
  bookingsCount: number;
  /** Lessons passed, per published module (same order as the modules prop). */
  completedPerModule: number[];
};

export type ModuleInfo = { title: string; total: number; packageIds: string[] };
export type PackageOption = { id: string; nameEn: string };

/** The student's own modules (same rule as lib/progress.ts) with their progress. */
function breakdown(student: StudentRow, modules: ModuleInfo[]) {
  const rows = modules
    .map((m, i) => ({ title: m.title, total: m.total, completed: student.completedPerModule[i] ?? 0, packageIds: m.packageIds }))
    .filter((m) => !student.packageId || m.packageIds.includes(student.packageId));
  return {
    rows,
    completed: rows.reduce((sum, m) => sum + m.completed, 0),
    total: rows.reduce((sum, m) => sum + m.total, 0),
  };
}

const avatarColors = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4"];
function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export function StudentsManager({
  initial,
  packages,
  modules,
}: {
  initial: StudentRow[];
  packages: PackageOption[];
  modules: ModuleInfo[];
}) {
  const [students, setStudents] = useState(initial);
  const [search, setSearch] = useState("");
  const [progressFor, setProgressFor] = useState<StudentRow | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(
    () => students.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())),
    [students, search]
  );

  async function update(student: StudentRow, change: Partial<Pick<StudentRow, "courseAccess" | "packageId">>) {
    setBusyId(student.id);
    const res = await fetch(`/api/admin/students/${student.id}/access`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(change),
    });
    setBusyId(null);
    if (res.ok) {
      setStudents((list) => list.map((s) => (s.id === student.id ? { ...s, ...change } : s)));
    }
  }

  return (
    <div>
      <div className="search-bar" style={{ marginBottom: 16 }}>
        <span aria-hidden="true">🔍</span> <input
          type="search"
          placeholder="Search students…"
          aria-label="Search students by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">No students found.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Contact</th>
                  <th>Bookings</th>
                  <th>Package</th>
                  <th>Progress</th>
                  <th>Course Access</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const progress = breakdown(s, modules);
                  // Opening the lessons waits for a package, so a new student never gets every module by accident.
                  const needsPackage = !s.courseAccess && !s.packageId;
                  return (
                  <tr key={s.id}>
                    <td>
                      <div className="student-cell">
                        <div className="student-avatar" style={{ background: avatarColors[i % avatarColors.length] }}>{initials(s.name)}</div>
                        <div style={{ fontWeight: 600, fontSize: "0.82rem" }}>{s.name}</div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: "0.8rem" }}>{s.email}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--gray-600)" }}>{s.phone || "—"}</div>
                    </td>
                    <td>{s.bookingsCount}</td>
                    <td>
                      <select
                        aria-label={`Package of ${s.name}`}
                        value={s.packageId ?? ""}
                        disabled={busyId === s.id}
                        onChange={(e) => update(s, { packageId: e.target.value || null })}
                        style={{ width: "auto", fontSize: "0.8rem", padding: "4px 8px" }}
                      >
                        <option value="">{s.courseAccess ? "No package" : "Choose…"}</option>
                        {packages.map((p) => (
                          <option key={p.id} value={p.id}>{p.nameEn}</option>
                        ))}
                      </select>
                      {!s.packageId && s.courseAccess && (
                        <div style={{ fontSize: "0.72rem", color: "var(--gray-600)", marginTop: 2 }}>Sees all modules</div>
                      )}
                    </td>
                    <td>{progress.completed}/{progress.total} lessons</td>
                    <td>
                      <span className={`badge ${s.courseAccess ? "badge-active" : "badge-inactive"}`}>
                        {s.courseAccess ? "Granted" : "Revoked"}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-sm btn-outline" onClick={() => setProgressFor(s)}>View Progress</button>
                        <button
                          className={`btn btn-sm ${s.courseAccess ? "btn-danger" : "btn-success"}`}
                          onClick={() => update(s, { courseAccess: !s.courseAccess })}
                          disabled={busyId === s.id || needsPackage}
                          title={needsPackage ? "Choose a package first" : undefined}
                        >
                          {s.courseAccess ? "Revoke Access" : "Grant Access"}
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {progressFor && (() => {
        const progress = breakdown(progressFor, modules);
        return (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={() => setProgressFor(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">{progressFor.name}&apos;s Progress</div>
            <div className="modal-sub">{progress.completed} of {progress.total} lessons completed overall.</div>
            {progress.rows.map((m) => (
              <div key={m.title} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: "var(--navy)" }}>{m.title}</span>
                  <span style={{ color: "var(--gray-600)" }}>{m.completed}/{m.total}</span>
                </div>
                <div style={{ height: 6, background: "var(--gray-100)", borderRadius: 100, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${m.total > 0 ? (m.completed / m.total) * 100 : 0}%`,
                      background: "var(--amber)",
                      borderRadius: 100,
                    }}
                  />
                </div>
              </div>
            ))}
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setProgressFor(null)}>Close</button>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
}
