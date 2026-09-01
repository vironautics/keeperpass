import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import {
  DEFAULT_TOTP_PERIOD_SECONDS,
  generateTotp,
  totpCounter,
  totpProgress,
} from '../../../core/otp/totp';

/** How often the countdown ring is redrawn. */
const TICK_INTERVAL_MS = 1000;

/** Circumference of the countdown ring, matching its stroke-dasharray. */
const RING_LENGTH = 25;

/**
 * A live one-time password with a ring showing how long it stays valid.
 *
 * The code is regenerated whenever the period rolls over; the ring updates every
 * second in between.
 */
@Component({
  selector: 'app-totp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './totp.html',
  styleUrl: './totp.scss',
})
export class Totp {
  readonly secret = input.required<string>();
  readonly period = input(DEFAULT_TOTP_PERIOD_SECONDS);

  protected readonly error = signal(false);

  private readonly code = signal('');
  private readonly progress = signal(0);

  protected readonly firstHalf = computed(() => this.code().slice(0, 3));
  protected readonly secondHalf = computed(() => this.code().slice(3));
  protected readonly dashOffset = computed(() => -this.progress() * RING_LENGTH);

  private readonly destroyRef = inject(DestroyRef);

  /** Counter the currently displayed code was generated for. */
  private renderedCounter = -1;

  constructor() {
    effect(() => {
      // Track the inputs, then restart the cycle without tracking the work.
      this.secret();
      this.period();
      untracked(() => {
        this.renderedCounter = -1;
        void this.tick();
      });
    });

    const timer = setInterval(() => void this.tick(), TICK_INTERVAL_MS);
    this.destroyRef.onDestroy(() => clearInterval(timer));
  }

  private async tick(): Promise<void> {
    const secret = this.secret();
    const period = this.period();

    if (!secret) {
      this.code.set('');
      return;
    }

    const now = Date.now();
    const counter = totpCounter(now, period);

    this.progress.set(totpProgress(now, period));

    if (counter === this.renderedCounter) {
      return;
    }

    try {
      this.code.set(await generateTotp(secret, { period, timestamp: now }));
      this.error.set(false);
      this.renderedCounter = counter;
    } catch {
      this.code.set('');
      this.error.set(true);
    }
  }
}
