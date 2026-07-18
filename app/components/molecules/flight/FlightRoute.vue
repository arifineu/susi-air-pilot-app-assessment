<script setup lang="ts">
/**
 * FlightRoute
 * Departure → Arrival block: ICAO + city name on each side, plane icon between.
 */

interface Airport {
  icao: string
  city?: string
}
interface Props {
  departure: Airport
  arrival: Airport
  flightNumber?: string
}
defineProps<Props>()
</script>

<template>
  <div class="flight-route">
    <span v-if="flightNumber" class="flight-route__flightno">{{ flightNumber }}</span>
    <div class="flight-route__row">
      <div class="flight-route__airport flight-route__airport--dep">
        <span class="flight-route__icao">{{ departure.icao }}</span>
        <span v-if="departure.city" class="flight-route__city">{{ departure.city }}</span>
      </div>
      <span class="flight-route__connector" aria-hidden="true">
        <span class="flight-route__line" />
        <AtomsIcon name="plane" :size="16" class="flight-route__plane" />
        <span class="flight-route__line" />
      </span>
      <div class="flight-route__airport flight-route__airport--arr">
        <span class="flight-route__icao">{{ arrival.icao }}</span>
        <span v-if="arrival.city" class="flight-route__city">{{ arrival.city }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.flight-route {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);

  &__flightno {
    font-size: var(--fs-xs);
    font-weight: var(--fw-semibold);
    color: var(--color-text-secondary);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
  }

  &__airport {
    display: flex;
    flex-direction: column;
    line-height: 1.1;

    &--arr {
      text-align: right;
      align-items: flex-end;
    }
  }

  &__icao {
    font-size: var(--fs-lg);
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
    letter-spacing: 0.02em;
  }

  &__city {
    font-size: var(--fs-sm);
    color: var(--color-text-secondary);
    margin-top: 2px;
  }

  &__connector {
    flex: 1;
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--color-text-muted);
  }

  &__line {
    flex: 1;
    height: 1px;
    background: var(--color-border);
    border-top: 1px dashed var(--color-border);
    background: transparent;
  }

  &__plane {
    color: var(--color-red);
    transform: rotate(0deg);
  }
}
</style>
