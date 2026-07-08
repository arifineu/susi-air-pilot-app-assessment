/**
 * useFlightLimits
 *
 * Drives the 4 limit cards on the dashboard. Per brief §3.3:
 *
 *   | Card     | Limit  | Sum window       |
 *   | Daily    | 8h     | today only       |
 *   | Weekly   | 40h    | rolling 7 days   |
 *   | Monthly  | 100h   | rolling 30 days  |
 *   | Annual   | 1050h  | rolling 365 days |
 *
 * Daily = windowDays=1 (today..today). All four reuse `computeRollingSum`
 * anchored to `today`, so changing the underlying flightHours automatically
 * flows through.
 */
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue'
import { computeRollingSum } from './useRollingSum'
import type { FlightHour, FlightLimits } from '~/types'

export interface FlightLimitCard {
  key: 'daily' | 'weekly' | 'monthly' | 'annual'
  label: string
  value: number
  limit: number
  unit: 'h'
}

const DEFAULT_TODAY = '2026-05-31' // brief dev reference date

interface CardSpec {
  key: FlightLimitCard['key']
  label: string
  windowDays: number
}

const CARD_SPECS: CardSpec[] = [
  { key: 'daily', label: 'Daily', windowDays: 1 },
  { key: 'weekly', label: 'Weekly', windowDays: 7 },
  { key: 'monthly', label: 'Monthly', windowDays: 30 },
  { key: 'annual', label: 'Annual', windowDays: 365 },
]

/** Pure primitive — returns the four cards derived from raw inputs. */
export function computeFlightLimits(
  flightHours: FlightHour[],
  limits: FlightLimits,
  today: string = DEFAULT_TODAY,
): FlightLimitCard[] {
  return CARD_SPECS.map((spec) => ({
    key: spec.key,
    label: spec.label,
    value: computeRollingSum(flightHours, today, spec.windowDays),
    limit: limits[spec.key],
    unit: 'h' as const,
  }))
}

/** Reactive wrapper. */
export function useFlightLimits(
  flightHours: MaybeRefOrGetter<FlightHour[]>,
  limits: MaybeRefOrGetter<FlightLimits>,
  today: MaybeRefOrGetter<string> = DEFAULT_TODAY,
): ComputedRef<FlightLimitCard[]> {
  return computed(() =>
    computeFlightLimits(toValue(flightHours), toValue(limits), toValue(today)),
  )
}
