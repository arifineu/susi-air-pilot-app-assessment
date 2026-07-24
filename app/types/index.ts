// =============================================================================
// Shared types — used by composables, stores, and organisms.
// Kept in one place so JSON shape changes only need one update.
// =============================================================================

/** A single day's logged flight hours. */
export interface FlightHour {
  date: string // ISO yyyy-mm-dd
  hours: number
}

/** Document expiry record (from mock-documents.json). */
export interface DocumentRecord {
  id: string
  label: string
  expiryDate: string // ISO yyyy-mm-dd
}

/** Schedule entry (from mock-schedules.json schedules[]). */
export interface Schedule {
  id: string
  duty_date: string // ISO yyyy-mm-dd
  /** 1 = pending/upcoming, 2 = completed/verified. Loosened to number because
   *  JSON imports infer `number`, not the literal `1 | 2`. Consumers compare
   *  with `=== 1` or `=== 2`. */
  status: number
  base_name: string
  base_color: string
  duty_type: string // maps to Legend.code
  count_schedules: number
  count_logbooks: number
  /** Per-flight legs for DTY days. Absent on non-flying duty types.
   *  Optional because most mock entries stay at duty-day granularity — only
   *  the days the dashboard surfaces are enriched. */
  flights?: Flight[]
}

/** Airport reference (departure / arrival endpoint of a flight leg). */
export interface Airport {
  icao: string
  city?: string
}

/** A single flight leg within a Schedule. */
export interface Flight {
  id: string
  flight_number: string // e.g. "SSI-2204"
  /** Free-text aircraft label, constrained at the data layer to Susi Air's
   *  fleet — "Cessna Grand Carawan" or "LET 410". */
  aircraft: string
  aircraft_registration: string // e.g. "PK-WGO"
  departure: Airport & { time: string } // "HH:MM" 24h local
  arrival: Airport & { time: string }
  duration_minutes: number
  /** Mirrors Schedule.status: 1 = upcoming, 2 = completed. */
  status: number
}

/** Legend entry (from mock-schedules.json legend[]). */
export interface Legend {
  code: string
  label: string
  color: string
}

/** Pilot info (from mock-flight-hours.json pilot). */
export interface Pilot {
  name: string
  pilotId: string
  totalFlightHours: number
}

/** Limit thresholds (from mock-flight-hours.json limits). */
export interface FlightLimits {
  daily: number
  weekly: number
  monthly: number
  annual: number
}

/** Per-toggle chart bounds (from mock-flight-hours.json chartBounds[key]). */
export interface ChartBounds {
  limit: number
  max: number
  windowDays: number
  displayRangeDays: number
}

/** Chart range toggle keys. */
export type ChartRangeKey = '1w' | '1m' | '3m' | '6m' | '1y'

/** News card content (for LatestNewsCarousel). */
export interface NewsItem {
  id: string
  category?: string
  title: string
  excerpt?: string
  imageUrl?: string
  date?: string
  readTime?: string
}

/** Bottom nav item. */
export interface NavItem {
  label: string
  icon: string
  to: string
  badge?: number | string
}

/** Notification bell entry (DashboardHeader dropdown). */
export type NotificationCategory =
  | 'upcoming-flight'
  | 'schedule-change'
  | 'document-expiry'
  | 'flight-verified'

export interface NotificationItem {
  id: string
  title: string
  body?: string
  /** Short relative or absolute time label, e.g. "5m ago", "Today, 09:14". */
  time?: string
  read?: boolean
  variant?: 'info' | 'success' | 'warning' | 'danger'
  /** Source category — drives future filtering / styling per source. */
  category?: NotificationCategory
}
