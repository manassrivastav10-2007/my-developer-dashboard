import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import {
  LayoutDashboard, Building2, Users, UserCheck, CalendarCheck, ShoppingCart,
  Wallet, FileBarChart, Bell, Search, Moon, Sun, LogOut, ChevronDown, ChevronRight,
  CheckCircle2, XCircle, Clock, AlertTriangle, Plus, Download, Filter, Camera,
  MapPin, Phone, TrendingUp, TrendingDown, ShieldCheck, Settings as SettingsIcon,
  Menu, X, ArrowUpRight, IndianRupee, PieChart as PieChartIcon, Building,
  ClipboardList, Truck, BadgeCheck, BadgeAlert, BadgeX, Star, ChevronLeft,
  Server, Database, Activity, RefreshCw, UserCircle2, MoreHorizontal, CircleDot,
} from "lucide-react";

/* ======================================================================
   THEME
====================================================================== */
const THEME = {
  light: {
    bg: "#F4F6FA", surface: "#FFFFFF", surface2: "#EEF1F6", surface3: "#E4E9F1",
    border: "#DEE4ED", text: "#0F1729", textSoft: "#5B6472", textFaint: "#8A93A3",
    accent: "#2F5FE0", accentSoft: "#E8EEFE", accent2: "#0EA5A5",
    success: "#16A34A", successSoft: "#E7F8ED", warning: "#D97706", warningSoft: "#FDF1E0",
    danger: "#DC2626", dangerSoft: "#FCE9E9", info: "#6366F1", infoSoft: "#ECEBFE",
    shadow: "0 1px 2px rgba(15,23,41,0.04), 0 8px 24px -12px rgba(15,23,41,0.10)",
  },
  dark: {
    bg: "#080D18", surface: "#0F1626", surface2: "#141D31", surface3: "#1B2740",
    border: "#232F49", text: "#E7ECF3", textSoft: "#93A1B7", textFaint: "#5C6A82",
    accent: "#5B85F5", accentSoft: "#16213A", accent2: "#2DD4CF",
    success: "#34D178", successSoft: "#132A1D", warning: "#F0A93B", warningSoft: "#2E2213",
    danger: "#F0554F", dangerSoft: "#301718", info: "#8A8DF7", infoSoft: "#20213D",
    shadow: "0 1px 2px rgba(0,0,0,0.3), 0 12px 30px -12px rgba(0,0,0,0.55)",
  },
};

const fmtINR = (n) =>
  "₹" + Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });
const fmtNum = (n) => Number(n).toLocaleString("en-IN");
const pad = (n) => String(n).padStart(2, "0");
const fmtDate = (d) => `${pad(d.getDate())} ${d.toLocaleString("en-IN", { month: "short" })} ${d.getFullYear()}`;
const fmtTime = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };
const uid = (p = "id") => p + "_" + Math.random().toString(36).slice(2, 9);

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
const rnd = seededRandom(42);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

/* ======================================================================
   MOCK DATA
====================================================================== */
const COMPANY_NAMES = ["Nova Foods Pvt Ltd", "Bluepeak Distributors", "Ganga Traders", "Sunrise Beverages", "Metro FMCG Co."];
const FIRST = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Rohit", "Kavita", "Suresh", "Neha", "Arjun", "Pooja", "Manoj", "Divya", "Karan"];
const LAST = ["Sharma", "Verma", "Gupta", "Singh", "Yadav", "Mishra", "Patel", "Reddy", "Nair", "Chauhan"];
const CITIES = ["Faizabad", "Lucknow", "Ayodhya", "Gorakhpur", "Kanpur", "Varanasi", "Prayagraj"];
const PRODUCTS = ["Cooking Oil 5L", "Rice Bag 25kg", "Wheat Flour 10kg", "Soft Drink Crate", "Biscuit Carton", "Tea Powder 1kg", "Detergent 5kg", "Spice Combo Pack"];

function makeName() { return `${pick(FIRST)} ${pick(LAST)}`; }
function makePhone() { return "9" + Math.floor(100000000 + rnd() * 899999999); }

const companies = COMPANY_NAMES.map((name, i) => ({
  id: "co_" + i,
  name,
  contact: makePhone(),
  city: pick(CITIES),
  createdAt: daysAgo(300 - i * 30),
}));

const employees = Array.from({ length: 18 }).map((_, i) => {
  const name = makeName();
  const status = i < 13 ? "approved" : i < 16 ? "pending" : "rejected";
  return {
    id: "emp_" + i,
    name,
    email: name.toLowerCase().replace(" ", ".") + "@fieldstaff.in",
    phone: makePhone(),
    companyId: status === "approved" ? pick(companies).id : null,
    role: "Field Sales Executive",
    status,
    joinedAt: daysAgo(280 - i * 12),
    avatarSeed: i,
  };
});
const approvedEmployees = employees.filter((e) => e.status === "approved");

const customers = Array.from({ length: 46 }).map((_, i) => {
  const emp = pick(approvedEmployees);
  const total = Math.round(8000 + rnd() * 90000);
  const paid = Math.round(total * (0.3 + rnd() * 0.65));
  return {
    id: "cust_" + i,
    name: makeName() + (rnd() > 0.5 ? " Kirana Store" : " General Store"),
    phone: makePhone(),
    address: `${Math.ceil(rnd() * 90)} Market Road, ${pick(CITIES)}`,
    companyId: emp.companyId,
    employeeId: emp.id,
    totalPurchase: total,
    paid,
    pending: total - paid,
    lastVisit: daysAgo(Math.floor(rnd() * 30)),
    orderFrequency: pick(["Weekly", "Bi-Weekly", "Monthly"]),
  };
});

const ORDER_STATUSES = ["Delivered", "Pending", "Cancelled"];
const orders = Array.from({ length: 140 }).map((_, i) => {
  const cust = pick(customers);
  const orderDate = daysAgo(Math.floor(rnd() * 90));
  const deliveryDate = new Date(orderDate); deliveryDate.setDate(deliveryDate.getDate() + 3 + Math.floor(rnd() * 5));
  const value = Math.round(1500 + rnd() * 18000);
  const status = rnd() > 0.82 ? "Cancelled" : rnd() > 0.35 ? "Delivered" : "Pending";
  return {
    id: "ord_" + i,
    customerId: cust.id,
    customerName: cust.name,
    companyId: cust.companyId,
    employeeId: cust.employeeId,
    product: pick(PRODUCTS),
    qty: 1 + Math.floor(rnd() * 40),
    value,
    orderDate,
    deliveryDate,
    status,
    notes: rnd() > 0.7 ? "Customer requested morning delivery" : "",
  };
});

const collections = [];
orders.forEach((o) => {
  if (o.status === "Delivered" && rnd() > 0.25) {
    collections.push({
      id: "col_" + collections.length,
      orderId: o.id,
      customerId: o.customerId,
      customerName: o.customerName,
      amount: Math.round(o.value * (0.5 + rnd() * 0.5)),
      date: daysAgo(Math.floor(rnd() * 60)),
      method: pick(["Cash", "UPI", "Bank Transfer", "Cheque"]),
      employeeId: o.employeeId,
    });
  }
});

const attendanceRecords = [];
approvedEmployees.forEach((emp) => {
  for (let d = 0; d < 30; d++) {
    const day = daysAgo(d);
    if (day.getDay() === 0) continue; // Sunday off
    const roll = rnd();
    const status = roll > 0.9 ? "Absent" : roll > 0.75 ? "Late" : "Present";
    attendanceRecords.push({
      id: uid("att"),
      employeeId: emp.id,
      date: day,
      status,
      checkIn: status === "Absent" ? null : status === "Late" ? "10:4" + Math.floor(rnd() * 9) : "09:2" + Math.floor(rnd() * 9),
      checkOut: status === "Absent" ? null : "18:1" + Math.floor(rnd() * 9),
      photo: true,
      notes: "",
    });
  }
});

const monthlyExpenses = [
  { label: "Employee Salaries", amount: 420000 },
  { label: "Fuel & Travel", amount: 68000 },
  { label: "Warehouse Rent", amount: 55000 },
  { label: "Logistics", amount: 41000 },
  { label: "Misc. Operations", amount: 22000 },
];

const agencies = [
  { id: "ag_1", name: "Prime Distribution Agency", owner: "Rajesh Tiwari", plan: "Enterprise", status: "Active", employees: 18, companies: 5, renewsOn: "12 Sep 2026" },
  { id: "ag_2", name: "Northline Trade Partners", owner: "Sarita Kapoor", plan: "Growth", status: "Active", employees: 42, companies: 9, renewsOn: "03 Aug 2026" },
  { id: "ag_3", name: "Eastward Supply Co.", owner: "Imran Sheikh", plan: "Starter", status: "Trial", employees: 6, companies: 2, renewsOn: "22 Jul 2026" },
  { id: "ag_4", name: "Vindhya Retail Network", owner: "Ompal Singh", plan: "Growth", status: "Past Due", employees: 27, companies: 6, renewsOn: "01 Jul 2026" },
];

/* ======================================================================
   DERIVED FINANCIALS
====================================================================== */
function useFinancials(data) {
  return useMemo(() => {
    const { orders, collections, expenses } = data;
    const totalOrders = orders.length;
    const delivered = orders.filter((o) => o.status === "Delivered");
    const pendingOrders = orders.filter((o) => o.status === "Pending");
    const cancelled = orders.filter((o) => o.status === "Cancelled");
    const totalSales = orders.reduce((s, o) => s + o.value, 0);
    const deliveredValue = delivered.reduce((s, o) => s + o.value, 0);
    const collected = collections.reduce((s, c) => s + c.amount, 0);
    const pendingCollection = deliveredValue - collected > 0 ? deliveredValue - collected : 0;
    const outstanding = pendingCollection; // amount owed in market
    const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
    const grossProfit = collected - 0; // simplistic: revenue realized
    const netProfit = collected - totalExpense;
    const margin = collected > 0 ? (netProfit / collected) * 100 : 0;

    return {
      totalOrders, deliveredCount: delivered.length, pendingCount: pendingOrders.length,
      cancelledCount: cancelled.length, totalSales, deliveredValue, collected,
      pendingCollection, outstanding, totalExpense, grossProfit, netProfit, margin,
    };
  }, [data]);
}

function buildTrend(orders, collections, days = 14) {
  const arr = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = daysAgo(i);
    const key = fmtDate(day);
    const dayOrders = orders.filter((o) => fmtDate(o.orderDate) === key);
    const dayCollections = collections.filter((c) => fmtDate(c.date) === key);
    arr.push({
      day: `${pad(day.getDate())}/${pad(day.getMonth() + 1)}`,
      sales: dayOrders.reduce((s, o) => s + o.value, 0),
      collected: dayCollections.reduce((s, c) => s + c.amount, 0),
    });
  }
  return arr;
}

/* ======================================================================
   PRIMITIVE UI
====================================================================== */
function useT() {
  // placeholder to keep theme access terse inside components via context-free prop drilling
}

const Card = ({ t, children, style, className = "", pad3 = true }) => (
  <div
    className={`rounded-xl ${pad3 ? "p-4" : ""} ${className}`}
    style={{ background: t.surface, border: `1px solid ${t.border}`, boxShadow: t.shadow, ...style }}
  >
    {children}
  </div>
);

const Pill = ({ t, tone = "info", children, icon: Icon }) => {
  const map = {
    success: [t.success, t.successSoft], warning: [t.warning, t.warningSoft],
    danger: [t.danger, t.dangerSoft], info: [t.info, t.infoSoft], accent: [t.accent, t.accentSoft],
    neutral: [t.textSoft, t.surface3],
  };
  const [fg, bg] = map[tone] || map.info;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ color: fg, background: bg }}
    >
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};

function statusTone(status) {
  const s = status.toLowerCase();
  if (["present", "delivered", "paid", "approved", "active"].includes(s)) return "success";
  if (["late", "pending", "trial"].includes(s)) return "warning";
  if (["absent", "cancelled", "rejected", "overdue", "past due"].includes(s)) return "danger";
  return "neutral";
}

const IconBtn = ({ t, icon: Icon, onClick, active, title }) => (
  <button
    onClick={onClick}
    title={title}
    className="p-2 rounded-lg transition-colors"
    style={{
      background: active ? t.accentSoft : "transparent",
      color: active ? t.accent : t.textSoft,
    }}
  >
    <Icon size={18} />
  </button>
);

const Button = ({ t, children, onClick, variant = "primary", icon: Icon, size = "md", type = "button", disabled }) => {
  const styles = {
    primary: { background: t.accent, color: "#fff", border: "1px solid transparent" },
    ghost: { background: "transparent", color: t.text, border: `1px solid ${t.border}` },
    soft: { background: t.accentSoft, color: t.accent, border: "1px solid transparent" },
    danger: { background: t.danger, color: "#fff", border: "1px solid transparent" },
    success: { background: t.success, color: "#fff", border: "1px solid transparent" },
  };
  const sizes = { sm: "px-2.5 py-1.5 text-xs", md: "px-3.5 py-2 text-sm" };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg font-semibold whitespace-nowrap transition-opacity ${sizes[size]}`}
      style={{ ...styles[variant], opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
};

function KPICard({ t, label, value, icon: Icon, tone = "accent", sub, trend }) {
  const toneColor = { accent: t.accent, success: t.success, warning: t.warning, danger: t.danger, info: t.info }[tone];
  const toneSoft = { accent: t.accentSoft, success: t.successSoft, warning: t.warningSoft, danger: t.dangerSoft, info: t.infoSoft }[tone];
  return (
    <Card t={t} className="flex flex-col gap-3 min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: t.textFaint, letterSpacing: "0.06em" }}>{label}</span>
        <div className="p-1.5 rounded-lg" style={{ background: toneSoft }}>
          <Icon size={15} style={{ color: toneColor }} />
        </div>
      </div>
      <div className="text-2xl font-bold" style={{ color: t.text, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      {sub && (
        <div className="flex items-center gap-1 text-xs font-medium" style={{ color: trend === "down" ? t.danger : t.success }}>
          {trend === "down" ? <TrendingDown size={13} /> : <TrendingUp size={13} />}
          {sub}
        </div>
      )}
    </Card>
  );
}

/* Generic data table with search / sort / pagination */
function DataTable({ t, columns, rows, pageSize = 8, searchKeys = [], renderActions, emptyText = "No records found." }) {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(1);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let r = rows;
    if (q && searchKeys.length) {
      const ql = q.toLowerCase();
      r = r.filter((row) => searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(ql)));
    }
    if (sortKey) {
      r = [...r].sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        if (av instanceof Date) return (av - bv) * sortDir;
        if (typeof av === "number") return (av - bv) * sortDir;
        return String(av).localeCompare(String(bv)) * sortDir;
      });
    }
    return r;
  }, [rows, q, sortKey, sortDir, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => { setPage(1); }, [q, rows.length]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: t.textFaint }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search..."
            className="w-full pl-8 pr-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: t.surface2, border: `1px solid ${t.border}`, color: t.text }}
          />
        </div>
        <span className="text-xs" style={{ color: t.textFaint }}>{filtered.length} records</span>
      </div>
      <div className="overflow-x-auto rounded-lg" style={{ border: `1px solid ${t.border}` }}>
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: t.surface2 }}>
              {columns.map((c) => (
                <th
                  key={c.key}
                  onClick={() => c.sortable !== false && (setSortKey(c.key), setSortDir(sortKey === c.key ? -sortDir : 1))}
                  className="text-left px-3 py-2.5 font-semibold whitespace-nowrap select-none"
                  style={{ color: t.textSoft, cursor: c.sortable !== false ? "pointer" : "default", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.04em" }}
                >
                  <span className="inline-flex items-center gap-1">{c.label}{sortKey === c.key && <ChevronDown size={12} style={{ transform: sortDir === -1 ? "rotate(180deg)" : "none" }} />}</span>
                </th>
              ))}
              {renderActions && <th className="px-3 py-2.5"></th>}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="px-3 py-8 text-center" style={{ color: t.textFaint }}>{emptyText}</td></tr>
            )}
            {pageRows.map((row, i) => (
              <tr key={row.id || i} style={{ borderTop: `1px solid ${t.border}` }}>
                {columns.map((c) => (
                  <td key={c.key} className="px-3 py-2.5 whitespace-nowrap" style={{ color: t.text }}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
                {renderActions && <td className="px-3 py-2.5 text-right">{renderActions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs" style={{ color: t.textFaint }}>Page {page} of {totalPages}</span>
          <div className="flex gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="p-1.5 rounded-md" style={{ border: `1px solid ${t.border}`, color: t.text }}><ChevronLeft size={14} /></button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="p-1.5 rounded-md" style={{ border: `1px solid ${t.border}`, color: t.text }}><ChevronRight size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

function Modal({ t, title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(5,8,16,0.55)" }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${wide ? "max-w-2xl" : "max-w-md"} rounded-2xl p-5 max-h-[88vh] overflow-y-auto`}
        style={{ background: t.surface, border: `1px solid ${t.border}`, boxShadow: t.shadow }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold" style={{ color: t.text }}>{title}</h3>
          <button onClick={onClose} style={{ color: t.textFaint }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ t, label, children }) {
  return (
    <label className="block mb-3">
      <span className="block text-xs font-semibold mb-1" style={{ color: t.textSoft }}>{label}</span>
      {children}
    </label>
  );
}
const inputStyle = (t) => ({ background: t.surface2, border: `1px solid ${t.border}`, color: t.text });
const inputCls = "w-full px-3 py-2 rounded-lg text-sm outline-none";

function Avatar({ seed, name, size = 32 }) {
  const colors = ["#2F5FE0", "#0EA5A5", "#D97706", "#DC2626", "#6366F1", "#16A34A"];
  const c = colors[(seed ?? name?.length ?? 0) % colors.length];
  const initials = (name || "?").split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <div className="rounded-full flex items-center justify-center font-bold text-white shrink-0" style={{ width: size, height: size, background: c, fontSize: size * 0.38 }}>
      {initials}
    </div>
  );
}

/* ======================================================================
   PULSE BAR — signature element
====================================================================== */
function PulseBar({ t, fin }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  const total = fin.deliveredValue || 1;
  const collectedPct = Math.min(100, (fin.collected / total) * 100);
  const pendingPct = Math.min(100 - collectedPct, (fin.pendingCollection / total) * 100);
  return (
    <Card t={t} pad3={false} className="p-4 md:p-5">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div>
          <div className="text-xs font-semibold uppercase" style={{ color: t.textFaint, letterSpacing: "0.06em" }}>Live Collection Pulse</div>
          <div className="text-sm" style={{ color: t.textSoft }}>Delivered value split into collected vs pending, updated in real time</div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-md" style={{ color: t.accent, background: t.accentSoft }}>
          <CircleDot size={11} className="animate-pulse" /> as of {fmtTime(now)}
        </div>
      </div>
      <div className="h-3.5 w-full rounded-full overflow-hidden flex" style={{ background: t.surface3 }}>
        <div style={{ width: `${collectedPct}%`, background: t.success, transition: "width 0.6s" }} />
        <div style={{ width: `${pendingPct}%`, background: t.warning, transition: "width 0.6s" }} />
      </div>
      <div className="flex items-center gap-5 mt-3 flex-wrap text-sm">
        <span className="flex items-center gap-1.5" style={{ color: t.text }}><span className="w-2.5 h-2.5 rounded-full" style={{ background: t.success }} /> Collected <b style={{ fontVariantNumeric: "tabular-nums" }}>{fmtINR(fin.collected)}</b></span>
        <span className="flex items-center gap-1.5" style={{ color: t.text }}><span className="w-2.5 h-2.5 rounded-full" style={{ background: t.warning }} /> Pending <b style={{ fontVariantNumeric: "tabular-nums" }}>{fmtINR(fin.pendingCollection)}</b></span>
        <span className="flex items-center gap-1.5" style={{ color: t.text }}><span className="w-2.5 h-2.5 rounded-full" style={{ background: t.surface3, border: `1px solid ${t.border}` }} /> Delivered Value <b style={{ fontVariantNumeric: "tabular-nums" }}>{fmtINR(fin.deliveredValue)}</b></span>
      </div>
    </Card>
  );
}

/* ======================================================================
   NAV CONFIG
====================================================================== */
const NAV = {
  superadmin: [
    { key: "dashboard", label: "Overview", icon: LayoutDashboard },
    { key: "agencies", label: "Agencies", icon: Building2 },
    { key: "reports", label: "Platform Reports", icon: FileBarChart },
    { key: "system", label: "System Monitor", icon: Server },
    { key: "settings", label: "Settings", icon: SettingsIcon },
  ],
  owner: [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "companies", label: "Companies", icon: Building },
    { key: "employees", label: "Employees", icon: Users },
    { key: "customers", label: "Customers", icon: UserCheck },
    { key: "attendance", label: "Attendance", icon: CalendarCheck },
    { key: "orders", label: "Orders", icon: ShoppingCart },
    { key: "payments", label: "Collections", icon: Wallet },
    { key: "analytics", label: "Analytics", icon: PieChartIcon },
    { key: "reports", label: "Financial Reports", icon: FileBarChart },
    { key: "settings", label: "Settings", icon: SettingsIcon },
  ],
  employee: [
    { key: "dashboard", label: "My Dashboard", icon: LayoutDashboard },
    { key: "attendance", label: "Attendance", icon: CalendarCheck },
    { key: "customers", label: "My Customers", icon: UserCheck },
    { key: "orders", label: "My Orders", icon: ShoppingCart },
    { key: "payments", label: "Collections", icon: Wallet },
    { key: "settings", label: "Settings", icon: SettingsIcon },
  ],
};

const ROLE_LABEL = { superadmin: "Super Admin", owner: "Agency Owner", employee: "Field Employee" };

/* ======================================================================
   LOGIN SCREEN
====================================================================== */
function Login({ t, onLogin, dark, setDark }) {
  const [role, setRole] = useState("owner");
  const cards = [
    { key: "superadmin", title: "Super Admin", desc: "Manage agencies, subscriptions & platform health", icon: ShieldCheck },
    { key: "owner", title: "Agency Owner", desc: "Companies, employees, orders & full P&L", icon: Building2 },
    { key: "employee", title: "Field Employee", desc: "Attendance, orders, visits & collections", icon: UserCheck },
  ];
  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ background: t.bg }}>
      <div className="absolute top-5 right-5">
        <IconBtn t={t} icon={dark ? Sun : Moon} onClick={() => setDark(!dark)} />
      </div>
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: t.accent }}>
            <Activity size={20} color="#fff" />
          </div>
          <div>
            <div className="font-bold text-lg leading-none" style={{ color: t.text }}>Ledgerline</div>
            <div className="text-xs" style={{ color: t.textFaint }}>Agency & Employee Management</div>
          </div>
        </div>
        <Card t={t} className="p-6">
          <h2 className="text-lg font-bold mb-1" style={{ color: t.text }}>Sign in to your workspace</h2>
          <p className="text-sm mb-5" style={{ color: t.textSoft }}>Choose a role to preview its dashboard.</p>
          <div className="space-y-2 mb-5">
            {cards.map((c) => (
              <button
                key={c.key}
                onClick={() => setRole(c.key)}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors"
                style={{ border: `1.5px solid ${role === c.key ? t.accent : t.border}`, background: role === c.key ? t.accentSoft : "transparent" }}
              >
                <div className="p-2 rounded-lg" style={{ background: role === c.key ? t.accent : t.surface3 }}>
                  <c.icon size={17} color={role === c.key ? "#fff" : t.textSoft} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold" style={{ color: t.text }}>{c.title}</div>
                  <div className="text-xs" style={{ color: t.textFaint }}>{c.desc}</div>
                </div>
                {role === c.key && <CheckCircle2 size={18} style={{ color: t.accent }} />}
              </button>
            ))}
          </div>
          <Field t={t} label="Email address">
            <input defaultValue={role === "owner" ? "owner@primeagency.in" : role === "employee" ? "rahul.sharma@fieldstaff.in" : "admin@ledgerline.io"} className={inputCls} style={inputStyle(t)} />
          </Field>
          <Field t={t} label="Password">
            <input type="password" defaultValue="••••••••••" className={inputCls} style={inputStyle(t)} />
          </Field>
          <Button t={t} onClick={() => onLogin(role)} size="md">
            <span className="w-full text-center">Sign In as {ROLE_LABEL[role]}</span>
          </Button>
          <p className="text-xs text-center mt-4" style={{ color: t.textFaint }}>Demo build — authentication is simulated for preview purposes.</p>
        </Card>
      </div>
    </div>
  );
}

/* ======================================================================
   MAIN APP
====================================================================== */
export default function App() {
  const [dark, setDark] = useState(false);
  const t = dark ? THEME.dark : THEME.light;
  const [role, setRole] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [mobileNav, setMobileNav] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  // mutable demo data
  const [empList, setEmpList] = useState(employees);
  const [orderList, setOrderList] = useState(orders);
  const [collectionList, setCollectionList] = useState(collections);
  const [attList, setAttList] = useState(attendanceRecords);
  const [attWindow, setAttWindow] = useState({ open: "09:30", close: "10:30" });
  const [toast, setToast] = useState(null);

  const currentEmployee = approvedEmployees[0];

  const fin = useFinancials({ orders: orderList, collections: collectionList, expenses: monthlyExpenses });
  const trend = useMemo(() => buildTrend(orderList, collectionList), [orderList, collectionList]);

  const pendingApprovals = empList.filter((e) => e.status === "pending").length;
  const overdueCustomers = customers.filter((c) => c.pending > 25000).length;

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2600); }

  function login(r) { setRole(r); setPage("dashboard"); }
  function logout() { setRole(null); }

  function approveEmployee(id, approve) {
    setEmpList((list) => list.map((e) => (e.id === id ? { ...e, status: approve ? "approved" : "rejected", companyId: approve ? pick(companies).id : null } : e)));
    showToast(approve ? "Employee approved and assigned." : "Employee registration rejected.");
  }

  function addOrder(o) {
    setOrderList((list) => [{ id: uid("ord"), ...o }, ...list]);
    showToast("Order recorded.");
  }
  function updateOrderStatus(id, status) {
    setOrderList((list) => list.map((o) => (o.id === id ? { ...o, status } : o)));
    showToast(`Order marked ${status}.`);
  }
  function addCollection(c) {
    setCollectionList((list) => [{ id: uid("col"), ...c }, ...list]);
    showToast("Collection recorded.");
  }
  function checkIn(empId) {
    const today = fmtDate(new Date());
    setAttList((list) => {
      const exists = list.find((a) => a.employeeId === empId && fmtDate(a.date) === today);
      if (exists) return list.map((a) => (a === exists ? { ...a, checkIn: fmtTime(new Date()).slice(0, 5), status: "Present" } : a));
      return [{ id: uid("att"), employeeId: empId, date: new Date(), status: "Present", checkIn: fmtTime(new Date()).slice(0, 5), checkOut: null, photo: true, notes: "" }, ...list];
    });
    showToast("Checked in successfully.");
  }
  function checkOut(empId) {
    const today = fmtDate(new Date());
    setAttList((list) => list.map((a) => (a.employeeId === empId && fmtDate(a.date) === today ? { ...a, checkOut: fmtTime(new Date()).slice(0, 5) } : a)));
    showToast("Checked out successfully.");
  }

  function exportCSV(rows, headers, filename) {
    const csv = [headers.map((h) => h.label).join(",")]
      .concat(rows.map((r) => headers.map((h) => `"${String(h.get(r)).replace(/"/g, '""')}"`).join(",")))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    showToast("CSV exported.");
  }

  if (!role) return <Login t={t} onLogin={login} dark={dark} setDark={setDark} />;

  const navItems = NAV[role];
  const companyOf = (id) => companies.find((c) => c.id === id)?.name || "—";
  const empOf = (id) => empList.find((e) => e.id === id)?.name || "—";

  /* ---------------- Page bodies ---------------- */

  function DashboardPage() {
    if (role === "employee") return <EmployeeDashboard />;
    if (role === "superadmin") return <SuperAdminDashboard />;
    return <OwnerDashboard />;
  }

  function OwnerDashboard() {
    const pieData = [
      { name: "Delivered", value: fin.deliveredCount, color: t.success },
      { name: "Pending", value: fin.pendingCount, color: t.warning },
      { name: "Cancelled", value: fin.cancelledCount, color: t.danger },
    ];
    const empPerf = approvedEmployees.slice(0, 6).map((e) => ({
      name: e.name.split(" ")[0],
      revenue: orderList.filter((o) => o.employeeId === e.id && o.status === "Delivered").reduce((s, o) => s + o.value, 0),
    }));
    return (
      <div className="space-y-5">
        <PulseBar t={t} fin={fin} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard t={t} label="Total Sales" value={fmtINR(fin.totalSales)} icon={IndianRupee} tone="accent" sub="+12.4% vs last month" />
          <KPICard t={t} label="Net Profit" value={fmtINR(fin.netProfit)} icon={TrendingUp} tone={fin.netProfit >= 0 ? "success" : "danger"} sub={`Margin ${fin.margin.toFixed(1)}%`} trend={fin.netProfit >= 0 ? "up" : "down"} />
          <KPICard t={t} label="Outstanding Amount" value={fmtINR(fin.outstanding)} icon={AlertTriangle} tone="warning" sub={`${overdueCustomers} customers overdue`} trend="down" />
          <KPICard t={t} label="Pending Approvals" value={pendingApprovals} icon={UserCheck} tone="info" sub="Awaiting your review" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card t={t} className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm" style={{ color: t.text }}>Sales vs Collection — 14 days</h3>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={t.accent} stopOpacity={0.35} /><stop offset="100%" stopColor={t.accent} stopOpacity={0} /></linearGradient>
                  <linearGradient id="coll" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={t.success} stopOpacity={0.35} /><stop offset="100%" stopColor={t.success} stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: t.textFaint }} axisLine={{ stroke: t.border }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: t.textFaint }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 12 }} formatter={(v) => fmtINR(v)} />
                <Area type="monotone" dataKey="sales" stroke={t.accent} fill="url(#sales)" strokeWidth={2} name="Sales" />
                <Area type="monotone" dataKey="collected" stroke={t.success} fill="url(#coll)" strokeWidth={2} name="Collected" />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          <Card t={t}>
            <h3 className="font-bold text-sm mb-4" style={{ color: t.text }}>Order Status Split</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                  {pieData.map((p, i) => <Cell key={i} fill={p.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-3 mt-2 flex-wrap text-xs">
              {pieData.map((p, i) => (
                <span key={i} className="flex items-center gap-1" style={{ color: t.textSoft }}><span className="w-2 h-2 rounded-full" style={{ background: p.color }} />{p.name} ({p.value})</span>
              ))}
            </div>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card t={t}>
            <h3 className="font-bold text-sm mb-4" style={{ color: t.text }}>Top Employee Revenue (delivered)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={empPerf}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: t.textFaint }} axisLine={{ stroke: t.border }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: t.textFaint }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 12 }} formatter={(v) => fmtINR(v)} />
                <Bar dataKey="revenue" fill={t.accent} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card t={t}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm" style={{ color: t.text }}>Pending Employee Approvals</h3>
              <Pill t={t} tone="warning">{pendingApprovals} pending</Pill>
            </div>
            <div className="space-y-2 max-h-[220px] overflow-y-auto">
              {empList.filter((e) => e.status === "pending").map((e) => (
                <div key={e.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: t.surface2 }}>
                  <Avatar seed={e.avatarSeed} name={e.name} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: t.text }}>{e.name}</div>
                    <div className="text-xs truncate" style={{ color: t.textFaint }}>{e.email}</div>
                  </div>
                  <button onClick={() => approveEmployee(e.id, true)} className="p-1.5 rounded-md" style={{ background: t.successSoft, color: t.success }}><CheckCircle2 size={16} /></button>
                  <button onClick={() => approveEmployee(e.id, false)} className="p-1.5 rounded-md" style={{ background: t.dangerSoft, color: t.danger }}><XCircle size={16} /></button>
                </div>
              ))}
              {pendingApprovals === 0 && <p className="text-sm text-center py-6" style={{ color: t.textFaint }}>All caught up — no pending approvals.</p>}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  function EmployeeDashboard() {
    const myOrders = orderList.filter((o) => o.employeeId === currentEmployee.id);
    const myCollections = collectionList.filter((c) => c.employeeId === currentEmployee.id);
    const myCustomers = customers.filter((c) => c.employeeId === currentEmployee.id);
    const today = fmtDate(new Date());
    const todayAtt = attList.find((a) => a.employeeId === currentEmployee.id && fmtDate(a.date) === today);
    return (
      <div className="space-y-5">
        <Card t={t} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar seed={currentEmployee.avatarSeed} name={currentEmployee.name} size={44} />
            <div>
              <div className="font-bold" style={{ color: t.text }}>Welcome back, {currentEmployee.name.split(" ")[0]}</div>
              <div className="text-sm" style={{ color: t.textSoft }}>Attendance window: {attWindow.open} – {attWindow.close}</div>
            </div>
          </div>
          <div className="flex gap-2">
            {!todayAtt?.checkIn ? (
              <Button t={t} icon={CheckCircle2} onClick={() => checkIn(currentEmployee.id)}>Check In</Button>
            ) : !todayAtt?.checkOut ? (
              <Button t={t} variant="soft" icon={Clock} onClick={() => checkOut(currentEmployee.id)}>Check Out</Button>
            ) : (
              <Pill t={t} tone="success" icon={CheckCircle2}>Day complete ({todayAtt.checkIn} – {todayAtt.checkOut})</Pill>
            )}
          </div>
        </Card>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard t={t} label="My Orders" value={myOrders.length} icon={ShoppingCart} tone="accent" />
          <KPICard t={t} label="Delivered" value={myOrders.filter((o) => o.status === "Delivered").length} icon={Truck} tone="success" />
          <KPICard t={t} label="Collected" value={fmtINR(myCollections.reduce((s, c) => s + c.amount, 0))} icon={Wallet} tone="info" />
          <KPICard t={t} label="My Customers" value={myCustomers.length} icon={UserCheck} tone="warning" />
        </div>
        <Card t={t}>
          <h3 className="font-bold text-sm mb-3" style={{ color: t.text }}>My Recent Orders</h3>
          <DataTable
            t={t} searchKeys={["customerName", "product"]}
            columns={[
              { key: "customerName", label: "Customer" },
              { key: "product", label: "Product" },
              { key: "value", label: "Value", render: (r) => fmtINR(r.value) },
              { key: "orderDate", label: "Order Date", render: (r) => fmtDate(r.orderDate) },
              { key: "status", label: "Status", render: (r) => <Pill t={t} tone={statusTone(r.status)}>{r.status}</Pill> },
            ]}
            rows={myOrders}
          />
        </Card>
      </div>
    );
  }

  function SuperAdminDashboard() {
    const totalEmployeesAll = agencies.reduce((s, a) => s + a.employees, 0);
    const revData = [
      { name: "Prime", mrr: 82000 }, { name: "Northline", mrr: 156000 }, { name: "Eastward", mrr: 21000 }, { name: "Vindhya", mrr: 94000 },
    ];
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard t={t} label="Active Agencies" value={agencies.filter((a) => a.status === "Active").length} icon={Building2} tone="accent" />
          <KPICard t={t} label="Total Employees" value={fmtNum(totalEmployeesAll)} icon={Users} tone="info" />
          <KPICard t={t} label="Platform MRR" value={fmtINR(353000)} icon={IndianRupee} tone="success" sub="+8.1% MoM" />
          <KPICard t={t} label="Past Due Accounts" value={agencies.filter((a) => a.status === "Past Due").length} icon={AlertTriangle} tone="danger" trend="down" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card t={t} className="lg:col-span-2">
            <h3 className="font-bold text-sm mb-4" style={{ color: t.text }}>Revenue by Agency (MRR)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revData}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: t.textFaint }} axisLine={{ stroke: t.border }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: t.textFaint }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 12 }} formatter={(v) => fmtINR(v)} />
                <Bar dataKey="mrr" fill={t.accent} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card t={t}>
            <h3 className="font-bold text-sm mb-4" style={{ color: t.text }}>System Health</h3>
            <div className="space-y-3">
              {[
                { label: "API Uptime (30d)", val: "99.97%", icon: Server, tone: "success" },
                { label: "Avg Response Time", val: "142ms", icon: Activity, tone: "accent" },
                { label: "DB Replication Lag", val: "0.4s", icon: Database, tone: "success" },
                { label: "Last Backup", val: "18 min ago", icon: RefreshCw, tone: "info" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm" style={{ color: t.textSoft }}><s.icon size={14} />{s.label}</span>
                  <span className="text-sm font-bold" style={{ color: t.text }}>{s.val}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <Card t={t}>
          <h3 className="font-bold text-sm mb-3" style={{ color: t.text }}>Agencies</h3>
          <DataTable
            t={t} searchKeys={["name", "owner"]}
            columns={[
              { key: "name", label: "Agency" },
              { key: "owner", label: "Owner" },
              { key: "plan", label: "Plan" },
              { key: "employees", label: "Employees" },
              { key: "companies", label: "Companies" },
              { key: "status", label: "Status", render: (r) => <Pill t={t} tone={statusTone(r.status)}>{r.status}</Pill> },
              { key: "renewsOn", label: "Renews" },
            ]}
            rows={agencies}
          />
        </Card>
      </div>
    );
  }

  /* ---- Companies ---- */
  function CompaniesPage() {
    return (
      <Card t={t}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold" style={{ color: t.text }}>Companies</h3>
          <Button t={t} icon={Plus}>Add Company</Button>
        </div>
        <DataTable
          t={t} searchKeys={["name", "city"]}
          columns={[
            { key: "name", label: "Company", render: (r) => <span className="font-semibold">{r.name}</span> },
            { key: "city", label: "City" },
            { key: "contact", label: "Contact" },
            { key: "employees", label: "Employees", render: (r) => empList.filter((e) => e.companyId === r.id).length },
            { key: "orders", label: "Orders", render: (r) => orderList.filter((o) => o.companyId === r.id).length },
            { key: "revenue", label: "Revenue", render: (r) => fmtINR(orderList.filter((o) => o.companyId === r.id && o.status === "Delivered").reduce((s, o) => s + o.value, 0)) },
          ]}
          rows={companies}
        />
      </Card>
    );
  }

  /* ---- Employees ---- */
  function EmployeesPage() {
    return (
      <Card t={t}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold" style={{ color: t.text }}>Employees</h3>
          <Pill t={t} tone="warning">{pendingApprovals} awaiting approval</Pill>
        </div>
        <DataTable
          t={t} searchKeys={["name", "email"]}
          columns={[
            { key: "name", label: "Name", render: (r) => <span className="flex items-center gap-2"><Avatar seed={r.avatarSeed} name={r.name} size={26} />{r.name}</span> },
            { key: "email", label: "Email" },
            { key: "companyId", label: "Company", render: (r) => companyOf(r.companyId) },
            { key: "joinedAt", label: "Joined", render: (r) => fmtDate(r.joinedAt) },
            { key: "status", label: "Status", render: (r) => <Pill t={t} tone={statusTone(r.status)}>{r.status}</Pill> },
          ]}
          rows={empList}
          renderActions={(r) => r.status === "pending" ? (
            <div className="flex gap-1 justify-end">
              <Button t={t} size="sm" variant="success" icon={CheckCircle2} onClick={() => approveEmployee(r.id, true)}>Approve</Button>
              <Button t={t} size="sm" variant="danger" icon={XCircle} onClick={() => approveEmployee(r.id, false)}>Reject</Button>
            </div>
          ) : <MoreHorizontal size={16} style={{ color: t.textFaint }} />}
        />
      </Card>
    );
  }

  /* ---- Customers ---- */
  function CustomersPage() {
    const [selected, setSelected] = useState(null);
    const list = role === "employee" ? customers.filter((c) => c.employeeId === currentEmployee.id) : customers;
    return (
      <>
        <Card t={t}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold" style={{ color: t.text }}>Customers</h3>
            <Button t={t} icon={Plus}>Add Customer</Button>
          </div>
          <DataTable
            t={t} searchKeys={["name", "phone", "address"]}
            columns={[
              { key: "name", label: "Customer" },
              { key: "phone", label: "Mobile" },
              { key: "companyId", label: "Company", render: (r) => companyOf(r.companyId) },
              { key: "totalPurchase", label: "Purchases", render: (r) => fmtINR(r.totalPurchase) },
              { key: "pending", label: "Pending", render: (r) => <span style={{ color: r.pending > 25000 ? t.danger : r.pending > 0 ? t.warning : t.success, fontWeight: 700 }}>{fmtINR(r.pending)}</span> },
              { key: "lastVisit", label: "Last Visit", render: (r) => fmtDate(r.lastVisit) },
              { key: "status", label: "Payment", render: (r) => <Pill t={t} tone={r.pending === 0 ? "success" : r.pending > 25000 ? "danger" : "warning"}>{r.pending === 0 ? "Paid" : r.pending > 25000 ? "Overdue" : "Pending"}</Pill> },
            ]}
            rows={list}
            renderActions={(r) => <Button t={t} size="sm" variant="ghost" onClick={() => setSelected(r)}>View</Button>}
          />
        </Card>
        {selected && (
          <Modal t={t} title={selected.name} onClose={() => setSelected(null)} wide>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm" style={{ color: t.textSoft }}><Phone size={14} />{selected.phone}</div>
              <div className="flex items-center gap-2 text-sm" style={{ color: t.textSoft }}><MapPin size={14} />{selected.address}</div>
              <div className="flex items-center gap-2 text-sm" style={{ color: t.textSoft }}><Building size={14} />{companyOf(selected.companyId)}</div>
              <div className="flex items-center gap-2 text-sm" style={{ color: t.textSoft }}><Clock size={14} />{selected.orderFrequency} orders</div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 rounded-lg" style={{ background: t.surface2 }}><div className="text-xs" style={{ color: t.textFaint }}>Total Purchase</div><div className="font-bold" style={{ color: t.text }}>{fmtINR(selected.totalPurchase)}</div></div>
              <div className="p-3 rounded-lg" style={{ background: t.successSoft }}><div className="text-xs" style={{ color: t.textFaint }}>Paid</div><div className="font-bold" style={{ color: t.success }}>{fmtINR(selected.paid)}</div></div>
              <div className="p-3 rounded-lg" style={{ background: t.dangerSoft }}><div className="text-xs" style={{ color: t.textFaint }}>Pending</div><div className="font-bold" style={{ color: t.danger }}>{fmtINR(selected.pending)}</div></div>
            </div>
            <h4 className="text-sm font-bold mb-2" style={{ color: t.text }}>Order History</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {orderList.filter((o) => o.customerId === selected.id).map((o) => (
                <div key={o.id} className="flex items-center justify-between p-2 rounded-lg text-sm" style={{ background: t.surface2 }}>
                  <span style={{ color: t.text }}>{o.product} × {o.qty}</span>
                  <span style={{ color: t.textFaint }}>{fmtDate(o.orderDate)}</span>
                  <span className="font-semibold" style={{ color: t.text }}>{fmtINR(o.value)}</span>
                  <Pill t={t} tone={statusTone(o.status)}>{o.status}</Pill>
                </div>
              ))}
              {orderList.filter((o) => o.customerId === selected.id).length === 0 && <p className="text-sm" style={{ color: t.textFaint }}>No orders yet.</p>}
            </div>
          </Modal>
        )}
      </>
    );
  }

  /* ---- Attendance ---- */
  function AttendancePage() {
    const [openTime, setOpenTime] = useState(attWindow.open);
    const [closeTime, setCloseTime] = useState(attWindow.close);
    if (role === "employee") {
      const mine = attList.filter((a) => a.employeeId === currentEmployee.id).slice(0, 30);
      const present = mine.filter((a) => a.status === "Present").length;
      const late = mine.filter((a) => a.status === "Late").length;
      const absent = mine.filter((a) => a.status === "Absent").length;
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <KPICard t={t} label="Present (30d)" value={present} icon={CheckCircle2} tone="success" />
            <KPICard t={t} label="Late (30d)" value={late} icon={Clock} tone="warning" />
            <KPICard t={t} label="Absent (30d)" value={absent} icon={XCircle} tone="danger" />
          </div>
          <Card t={t}>
            <h3 className="font-bold text-sm mb-3" style={{ color: t.text }}>My Attendance Log</h3>
            <DataTable t={t} columns={[
              { key: "date", label: "Date", render: (r) => fmtDate(r.date) },
              { key: "checkIn", label: "Check In", render: (r) => r.checkIn || "—" },
              { key: "checkOut", label: "Check Out", render: (r) => r.checkOut || "—" },
              { key: "status", label: "Status", render: (r) => <Pill t={t} tone={statusTone(r.status)}>{r.status}</Pill> },
            ]} rows={mine} />
          </Card>
        </div>
      );
    }
    const rows = approvedEmployees.map((e) => {
      const recs = attList.filter((a) => a.employeeId === e.id);
      const present = recs.filter((a) => a.status === "Present").length;
      const late = recs.filter((a) => a.status === "Late").length;
      const absent = recs.filter((a) => a.status === "Absent").length;
      return { ...e, present, late, absent, id: e.id };
    });
    return (
      <div className="space-y-4">
        <Card t={t}>
          <h3 className="font-bold text-sm mb-3" style={{ color: t.text }}>Attendance Window</h3>
          <div className="flex flex-wrap items-end gap-3">
            <Field t={t} label="Opening Time"><input type="time" value={openTime} onChange={(e) => setOpenTime(e.target.value)} className={inputCls} style={inputStyle(t)} /></Field>
            <Field t={t} label="Closing Time"><input type="time" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} className={inputCls} style={inputStyle(t)} /></Field>
            <Button t={t} onClick={() => { setAttWindow({ open: openTime, close: closeTime }); showToast("Attendance window updated."); }}>Save Window</Button>
          </div>
        </Card>
        <Card t={t}>
          <h3 className="font-bold text-sm mb-3" style={{ color: t.text }}>Team Attendance — Last 30 Days</h3>
          <DataTable t={t} searchKeys={["name"]} columns={[
            { key: "name", label: "Employee", render: (r) => <span className="flex items-center gap-2"><Avatar seed={r.avatarSeed} name={r.name} size={26} />{r.name}</span> },
            { key: "companyId", label: "Company", render: (r) => companyOf(r.companyId) },
            { key: "present", label: "Present", render: (r) => <Pill t={t} tone="success">{r.present}</Pill> },
            { key: "late", label: "Late", render: (r) => <Pill t={t} tone="warning">{r.late}</Pill> },
            { key: "absent", label: "Absent", render: (r) => <Pill t={t} tone="danger">{r.absent}</Pill> },
          ]} rows={rows} />
        </Card>
      </div>
    );
  }

  /* ---- Orders ---- */
  function OrdersPage() {
    const [showAdd, setShowAdd] = useState(false);
    const list = role === "employee" ? orderList.filter((o) => o.employeeId === currentEmployee.id) : orderList;
    const [form, setForm] = useState({ customerName: "", product: PRODUCTS[0], qty: 1, value: "", deliveryDate: "" });
    return (
      <>
        <Card t={t}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="font-bold" style={{ color: t.text }}>Orders</h3>
            <div className="flex gap-2">
              <Button t={t} variant="ghost" icon={Download} onClick={() => exportCSV(list, [
                { label: "Customer", get: (r) => r.customerName }, { label: "Product", get: (r) => r.product },
                { label: "Value", get: (r) => r.value }, { label: "Status", get: (r) => r.status },
                { label: "Order Date", get: (r) => fmtDate(r.orderDate) },
              ], "orders.csv")}>Export CSV</Button>
              <Button t={t} icon={Plus} onClick={() => setShowAdd(true)}>Add Order</Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 rounded-lg text-center" style={{ background: t.successSoft }}><div className="text-xs" style={{ color: t.textFaint }}>Delivered</div><div className="font-bold" style={{ color: t.success }}>{list.filter((o) => o.status === "Delivered").length}</div></div>
            <div className="p-3 rounded-lg text-center" style={{ background: t.warningSoft }}><div className="text-xs" style={{ color: t.textFaint }}>Pending</div><div className="font-bold" style={{ color: t.warning }}>{list.filter((o) => o.status === "Pending").length}</div></div>
            <div className="p-3 rounded-lg text-center" style={{ background: t.dangerSoft }}><div className="text-xs" style={{ color: t.textFaint }}>Cancelled</div><div className="font-bold" style={{ color: t.danger }}>{list.filter((o) => o.status === "Cancelled").length}</div></div>
          </div>
          <DataTable
            t={t} searchKeys={["customerName", "product"]}
            columns={[
              { key: "customerName", label: "Customer" },
              { key: "product", label: "Product" },
              { key: "qty", label: "Qty" },
              { key: "value", label: "Value", render: (r) => fmtINR(r.value) },
              { key: "orderDate", label: "Order Date", render: (r) => fmtDate(r.orderDate) },
              { key: "deliveryDate", label: "Delivery Date", render: (r) => fmtDate(r.deliveryDate) },
              { key: "status", label: "Status", render: (r) => <Pill t={t} tone={statusTone(r.status)}>{r.status}</Pill> },
            ]}
            rows={list}
            renderActions={(r) => r.status === "Pending" && (
              <div className="flex gap-1 justify-end">
                <Button t={t} size="sm" variant="success" onClick={() => updateOrderStatus(r.id, "Delivered")}>Deliver</Button>
                <Button t={t} size="sm" variant="danger" onClick={() => updateOrderStatus(r.id, "Cancelled")}>Cancel</Button>
              </div>
            )}
          />
        </Card>
        {showAdd && (
          <Modal t={t} title="Add New Order" onClose={() => setShowAdd(false)}>
            <Field t={t} label="Customer Name"><input className={inputCls} style={inputStyle(t)} value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} /></Field>
            <Field t={t} label="Product"><select className={inputCls} style={inputStyle(t)} value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}>{PRODUCTS.map((p) => <option key={p}>{p}</option>)}</select></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field t={t} label="Quantity"><input type="number" min="1" className={inputCls} style={inputStyle(t)} value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} /></Field>
              <Field t={t} label="Order Value (₹)"><input type="number" className={inputCls} style={inputStyle(t)} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></Field>
            </div>
            <Field t={t} label="Delivery Date"><input type="date" className={inputCls} style={inputStyle(t)} value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} /></Field>
            <Button t={t} disabled={!form.customerName || !form.value} onClick={() => {
              addOrder({ customerName: form.customerName, product: form.product, qty: Number(form.qty), value: Number(form.value), orderDate: new Date(), deliveryDate: form.deliveryDate ? new Date(form.deliveryDate) : daysAgo(-5), status: "Pending", employeeId: currentEmployee.id, companyId: currentEmployee.companyId, customerId: "cust_new" });
              setShowAdd(false);
            }}>Save Order</Button>
          </Modal>
        )}
      </>
    );
  }

  /* ---- Payments ---- */
  function PaymentsPage() {
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ customerName: "", amount: "", method: "Cash" });
    const list = role === "employee" ? collectionList.filter((c) => c.employeeId === currentEmployee.id) : collectionList;
    return (
      <>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <KPICard t={t} label="Total Collected" value={fmtINR(fin.collected)} icon={Wallet} tone="success" />
          <KPICard t={t} label="Pending Collection" value={fmtINR(fin.pendingCollection)} icon={Clock} tone="warning" />
          <KPICard t={t} label="Outstanding" value={fmtINR(fin.outstanding)} icon={AlertTriangle} tone="danger" />
        </div>
        <Card t={t}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold" style={{ color: t.text }}>Collection History</h3>
            <Button t={t} icon={Plus} onClick={() => setShowAdd(true)}>Record Collection</Button>
          </div>
          <DataTable
            t={t} searchKeys={["customerName", "method"]}
            columns={[
              { key: "customerName", label: "Customer" },
              { key: "amount", label: "Amount", render: (r) => fmtINR(r.amount) },
              { key: "method", label: "Method", render: (r) => <Pill t={t} tone="accent">{r.method}</Pill> },
              { key: "date", label: "Date", render: (r) => fmtDate(r.date) },
              { key: "employeeId", label: "Collected By", render: (r) => empOf(r.employeeId) },
            ]}
            rows={list}
          />
        </Card>
        {showAdd && (
          <Modal t={t} title="Record Collection" onClose={() => setShowAdd(false)}>
            <Field t={t} label="Customer Name"><input className={inputCls} style={inputStyle(t)} value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} /></Field>
            <Field t={t} label="Amount (₹)"><input type="number" className={inputCls} style={inputStyle(t)} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></Field>
            <Field t={t} label="Payment Method">
              <select className={inputCls} style={inputStyle(t)} value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
                {["Cash", "UPI", "Bank Transfer", "Cheque"].map((m) => <option key={m}>{m}</option>)}
              </select>
            </Field>
            <div className="flex items-center gap-2 p-2.5 rounded-lg mb-3 text-xs" style={{ background: t.surface2, color: t.textSoft }}><Camera size={14} /> Proof photo upload would attach here in production.</div>
            <Button t={t} disabled={!form.customerName || !form.amount} onClick={() => {
              addCollection({ customerName: form.customerName, amount: Number(form.amount), method: form.method, date: new Date(), employeeId: currentEmployee.id, orderId: null, customerId: "cust_new" });
              setShowAdd(false);
            }}>Save Collection</Button>
          </Modal>
        )}
      </>
    );
  }

  /* ---- Analytics ---- */
  function AnalyticsPage() {
    const monthly = useMemo(() => {
      const arr = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(); d.setMonth(d.getMonth() - i);
        const label = d.toLocaleString("en-IN", { month: "short" });
        arr.push({ month: label, sales: Math.round(180000 + rnd() * 140000), profit: Math.round(30000 + rnd() * 60000) });
      }
      return arr;
    }, []);
    const custSeg = [
      { name: "Paid in full", value: customers.filter((c) => c.pending === 0).length, color: t.success },
      { name: "Pending", value: customers.filter((c) => c.pending > 0 && c.pending <= 25000).length, color: t.warning },
      { name: "Overdue", value: customers.filter((c) => c.pending > 25000).length, color: t.danger },
    ];
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card t={t}>
            <h3 className="font-bold text-sm mb-4" style={{ color: t.text }}>Monthly Growth — Sales vs Profit</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: t.textFaint }} axisLine={{ stroke: t.border }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: t.textFaint }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 12 }} formatter={(v) => fmtINR(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="sales" stroke={t.accent} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="profit" stroke={t.success} strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card t={t}>
            <h3 className="font-bold text-sm mb-4" style={{ color: t.text }}>Customer Payment Segments</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={custSeg} dataKey="value" nameKey="name" outerRadius={90} label={(e) => e.name}>
                  {custSeg.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
        <Card t={t}>
          <h3 className="font-bold text-sm mb-4" style={{ color: t.text }}>Employee Performance Ranking</h3>
          <DataTable t={t} searchKeys={["name"]} columns={[
            { key: "name", label: "Employee", render: (r) => <span className="flex items-center gap-2"><Avatar seed={r.avatarSeed} name={r.name} size={26} />{r.name}</span> },
            { key: "orders", label: "Orders", render: (r) => orderList.filter((o) => o.employeeId === r.id).length },
            { key: "delivered", label: "Delivered", render: (r) => orderList.filter((o) => o.employeeId === r.id && o.status === "Delivered").length },
            { key: "revenue", label: "Revenue", render: (r) => fmtINR(orderList.filter((o) => o.employeeId === r.id && o.status === "Delivered").reduce((s, o) => s + o.value, 0)) },
            { key: "rating", label: "Rating", render: () => <span className="flex items-center gap-1" style={{ color: t.warning }}><Star size={13} fill={t.warning} />{(3.6 + rnd() * 1.3).toFixed(1)}</span> },
          ]} rows={approvedEmployees} />
        </Card>
      </div>
    );
  }

  /* ---- Reports (P&L) ---- */
  function ReportsPage() {
    return (
      <div className="space-y-4">
        <Card t={t}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="font-bold" style={{ color: t.text }}>Profit & Loss Statement — Current Month</h3>
            <div className="flex gap-2">
              <Button t={t} variant="ghost" icon={Download} onClick={() => exportCSV(monthlyExpenses, [{ label: "Expense", get: (r) => r.label }, { label: "Amount", get: (r) => r.amount }], "expenses.csv")}>Export CSV</Button>
              <Button t={t} variant="soft" icon={FileBarChart} onClick={() => window.print()}>Export PDF</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs font-bold uppercase mb-2" style={{ color: t.textFaint }}>Income</div>
              {[
                ["Total Sales (Orders)", fin.totalSales],
                ["Delivered Order Value", fin.deliveredValue],
                ["Amount Collected", fin.collected],
              ].map(([l, v], i) => (
                <div key={i} className="flex justify-between py-2" style={{ borderBottom: `1px solid ${t.border}` }}>
                  <span className="text-sm" style={{ color: t.textSoft }}>{l}</span>
                  <span className="text-sm font-bold" style={{ color: t.text, fontVariantNumeric: "tabular-nums" }}>{fmtINR(v)}</span>
                </div>
              ))}
              <div className="text-xs font-bold uppercase mt-4 mb-2" style={{ color: t.textFaint }}>Receivables</div>
              {[
                ["Pending Collection", fin.pendingCollection],
                ["Outstanding (Market)", fin.outstanding],
              ].map(([l, v], i) => (
                <div key={i} className="flex justify-between py-2" style={{ borderBottom: `1px solid ${t.border}` }}>
                  <span className="text-sm" style={{ color: t.textSoft }}>{l}</span>
                  <span className="text-sm font-bold" style={{ color: t.warning, fontVariantNumeric: "tabular-nums" }}>{fmtINR(v)}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs font-bold uppercase mb-2" style={{ color: t.textFaint }}>Expenses</div>
              {monthlyExpenses.map((e, i) => (
                <div key={i} className="flex justify-between py-2" style={{ borderBottom: `1px solid ${t.border}` }}>
                  <span className="text-sm" style={{ color: t.textSoft }}>{e.label}</span>
                  <span className="text-sm font-bold" style={{ color: t.text, fontVariantNumeric: "tabular-nums" }}>{fmtINR(e.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 font-bold">
                <span className="text-sm" style={{ color: t.text }}>Total Expenses</span>
                <span className="text-sm" style={{ color: t.danger }}>{fmtINR(fin.totalExpense)}</span>
              </div>
              <div className="mt-4 p-3 rounded-lg flex items-center justify-between" style={{ background: fin.netProfit >= 0 ? t.successSoft : t.dangerSoft }}>
                <span className="font-bold text-sm" style={{ color: t.text }}>Net Profit / Loss</span>
                <span className="font-bold text-lg" style={{ color: fin.netProfit >= 0 ? t.success : t.danger }}>{fmtINR(fin.netProfit)}</span>
              </div>
              <div className="mt-2 text-xs" style={{ color: t.textFaint }}>Profit Margin: {fin.margin.toFixed(1)}%</div>
            </div>
          </div>
        </Card>
        <Card t={t}>
          <h3 className="font-bold text-sm mb-3" style={{ color: t.text }}>Company-wise Revenue</h3>
          <DataTable t={t} searchKeys={["name"]} columns={[
            { key: "name", label: "Company" },
            { key: "orders", label: "Orders", render: (r) => orderList.filter((o) => o.companyId === r.id).length },
            { key: "revenue", label: "Delivered Revenue", render: (r) => fmtINR(orderList.filter((o) => o.companyId === r.id && o.status === "Delivered").reduce((s, o) => s + o.value, 0)) },
            { key: "pending", label: "Pending Value", render: (r) => fmtINR(orderList.filter((o) => o.companyId === r.id && o.status === "Pending").reduce((s, o) => s + o.value, 0)) },
          ]} rows={companies} />
        </Card>
      </div>
    );
  }

  /* ---- Settings ---- */
  function SettingsPage() {
    const [mfa, setMfa] = useState(true);
    const secItems = [
      "HTTPS enforced across all routes", "Passwords hashed with bcrypt/argon2 (server-side)", "Role-based access control per module",
      "JWT session tokens with rotation", "Rate limiting on authentication endpoints", "Audit log of sensitive actions",
      "Encrypted storage for photos & documents", "Automated daily cloud backups",
    ];
    return (
      <div className="space-y-4">
        <Card t={t}>
          <h3 className="font-bold text-sm mb-3" style={{ color: t.text }}>Appearance</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: t.textSoft }}>Dark mode</span>
            <button onClick={() => setDark(!dark)} className="w-11 h-6 rounded-full relative transition-colors" style={{ background: dark ? THEME.dark.accent : "#CBD5E1" }}>
              <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ left: dark ? 22 : 2 }} />
            </button>
          </div>
        </Card>
        <Card t={t}>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-sm" style={{ color: t.text }}>Multi-Factor Authentication</h3>
            <button onClick={() => setMfa(!mfa)} className="w-11 h-6 rounded-full relative transition-colors" style={{ background: mfa ? t.success : t.surface3 }}>
              <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ left: mfa ? 22 : 2 }} />
            </button>
          </div>
          <p className="text-xs" style={{ color: t.textFaint }}>Requires a one-time code at login, in addition to your password.</p>
        </Card>
        <Card t={t}>
          <div className="flex items-center gap-2 mb-3"><ShieldCheck size={16} style={{ color: t.accent }} /><h3 className="font-bold text-sm" style={{ color: t.text }}>Security & Compliance Posture</h3></div>
          <p className="text-xs mb-3" style={{ color: t.textFaint }}>This preview runs client-side only. A production deployment implements the controls below on a real backend.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {secItems.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-sm p-2 rounded-lg" style={{ background: t.surface2, color: t.textSoft }}>
                <CheckCircle2 size={14} style={{ color: t.success, marginTop: 2, flexShrink: 0 }} />{s}
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  function SystemMonitorPage() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "App Servers", val: "6 / 6 healthy", icon: Server },
          { label: "Primary Database", val: "Healthy · 4ms latency", icon: Database },
          { label: "Background Jobs", val: "312 processed / hr", icon: RefreshCw },
          { label: "Storage (Photos/Docs)", val: "1.2 TB / 5 TB used", icon: FileBarChart },
        ].map((s, i) => (
          <Card key={i} t={t} className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg" style={{ background: t.accentSoft }}><s.icon size={18} style={{ color: t.accent }} /></div>
            <div><div className="text-xs" style={{ color: t.textFaint }}>{s.label}</div><div className="font-bold text-sm" style={{ color: t.text }}>{s.val}</div></div>
          </Card>
        ))}
      </div>
    );
  }

  const PAGES = {
    dashboard: DashboardPage, companies: CompaniesPage, employees: EmployeesPage, customers: CustomersPage,
    attendance: AttendancePage, orders: OrdersPage, payments: PaymentsPage, analytics: AnalyticsPage,
    reports: ReportsPage, settings: SettingsPage, agencies: () => (
      <Card t={t}>
        <h3 className="font-bold mb-4" style={{ color: t.text }}>All Agencies</h3>
        <DataTable t={t} searchKeys={["name", "owner"]} columns={[
          { key: "name", label: "Agency" }, { key: "owner", label: "Owner" }, { key: "plan", label: "Plan" },
          { key: "employees", label: "Employees" }, { key: "companies", label: "Companies" },
          { key: "status", label: "Status", render: (r) => <Pill t={t} tone={statusTone(r.status)}>{r.status}</Pill> },
          { key: "renewsOn", label: "Renews" },
        ]} rows={agencies} />
      </Card>
    ), system: SystemMonitorPage,
  };
  const PageBody = PAGES[page] || DashboardPage;

  const pageLabel = navItems.find((n) => n.key === page)?.label || "Dashboard";

  return (
    <div className="min-h-screen flex" style={{ background: t.bg, fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 p-4" style={{ background: t.surface, borderRight: `1px solid ${t.border}` }}>
        <div className="flex items-center gap-2.5 mb-8 px-1">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: t.accent }}><Activity size={18} color="#fff" /></div>
          <div><div className="font-bold text-sm leading-none" style={{ color: t.text }}>Ledgerline</div><div className="text-[11px]" style={{ color: t.textFaint }}>{ROLE_LABEL[role]}</div></div>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((n) => (
            <button key={n.key} onClick={() => setPage(n.key)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors" style={{ background: page === n.key ? t.accentSoft : "transparent", color: page === n.key ? t.accent : t.textSoft }}>
              <n.icon size={17} />{n.label}
            </button>
          ))}
        </nav>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold" style={{ color: t.danger }}><LogOut size={17} />Sign Out</button>
      </aside>

      {/* Mobile nav drawer */}
      {mobileNav && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 flex flex-col p-4" style={{ background: t.surface, borderRight: `1px solid ${t.border}` }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: t.accent }}><Activity size={16} color="#fff" /></div><span className="font-bold text-sm" style={{ color: t.text }}>Ledgerline</span></div>
              <button onClick={() => setMobileNav(false)}><X size={20} style={{ color: t.textFaint }} /></button>
            </div>
            <nav className="flex-1 space-y-1">
              {navItems.map((n) => (
                <button key={n.key} onClick={() => { setPage(n.key); setMobileNav(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold" style={{ background: page === n.key ? t.accentSoft : "transparent", color: page === n.key ? t.accent : t.textSoft }}>
                  <n.icon size={17} />{n.label}
                </button>
              ))}
            </nav>
            <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold" style={{ color: t.danger }}><LogOut size={17} />Sign Out</button>
          </div>
          <div className="flex-1" onClick={() => setMobileNav(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="flex items-center justify-between gap-3 px-4 md:px-6 py-3 sticky top-0 z-30" style={{ background: t.surface, borderBottom: `1px solid ${t.border}` }}>
          <div className="flex items-center gap-3 min-w-0">
            <button className="md:hidden" onClick={() => setMobileNav(true)}><Menu size={20} style={{ color: t.text }} /></button>
            <h1 className="font-bold text-base md:text-lg truncate" style={{ color: t.text }}>{pageLabel}</h1>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <IconBtn t={t} icon={dark ? Sun : Moon} onClick={() => setDark(!dark)} />
            <div className="relative">
              <IconBtn t={t} icon={Bell} onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }} active={notifOpen} />
              {(pendingApprovals + overdueCustomers) > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: t.danger }} />}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl p-2 z-40" style={{ background: t.surface, border: `1px solid ${t.border}`, boxShadow: t.shadow }}>
                  <div className="text-xs font-bold px-2 py-1" style={{ color: t.textFaint }}>NOTIFICATIONS</div>
                  {pendingApprovals > 0 && <div className="flex items-start gap-2 p-2 rounded-lg text-sm" style={{ color: t.text }}><UserCheck size={15} style={{ color: t.info, marginTop: 2 }} />{pendingApprovals} employee registrations awaiting approval</div>}
                  {overdueCustomers > 0 && <div className="flex items-start gap-2 p-2 rounded-lg text-sm" style={{ color: t.text }}><AlertTriangle size={15} style={{ color: t.danger, marginTop: 2 }} />{overdueCustomers} customers have overdue payments</div>}
                  <div className="flex items-start gap-2 p-2 rounded-lg text-sm" style={{ color: t.text }}><Truck size={15} style={{ color: t.warning, marginTop: 2 }} />{orderList.filter((o) => o.status === "Pending").length} deliveries pending this week</div>
                </div>
              )}
            </div>
            <div className="relative">
              <button onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }} className="flex items-center gap-2 pl-1"><Avatar name={role === "employee" ? currentEmployee.name : ROLE_LABEL[role]} size={30} /><ChevronDown size={14} className="hidden md:block" style={{ color: t.textFaint }} /></button>
              {userOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl p-1.5 z-40" style={{ background: t.surface, border: `1px solid ${t.border}`, boxShadow: t.shadow }}>
                  <div className="px-2.5 py-2 text-sm font-bold" style={{ color: t.text }}>{role === "employee" ? currentEmployee.name : ROLE_LABEL[role]}</div>
                  <button onClick={logout} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-semibold" style={{ color: t.danger }}><LogOut size={15} />Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <PageBody />
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-xl text-sm font-semibold z-50 flex items-center gap-2" style={{ background: t.text, color: t.bg, boxShadow: t.shadow }}>
          <CheckCircle2 size={15} />{toast}
        </div>
      )}
    </div>
  );
}
