'use client';

import { useActionState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { signupAction } from '@/app/actions/signup';
import { useI18n } from '@/lib/i18n/client';
import { Button } from '@/components/ui/Button';
import { Checkbox, MobileField } from '@/components/ui/Field';
import { MaybePlaceholder } from '@/components/ui/PlaceholderPill';
import { CloseIcon } from '@/components/icons';
import type { SignupResult } from '@/lib/forms/signup';

/**
 * Signup modal (docs/04 §7 rule 2: never a gate, never on arrival; it opens only when asked).
 * Marketing consent is a separate, unticked checkbox (docs/07 §10).
 */
export function SignupDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const ref = useRef<HTMLDialogElement>(null);
  const [state, formAction, pending] = useActionState<SignupResult | null, FormData>(
    signupAction,
    null,
  );

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const invalid = state && !state.ok && state.reason === 'invalid' ? state.fields : [];

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="signup-title"
      className="m-auto w-[min(100%-2rem,28rem)] rounded-[var(--radius-card)] bg-surface-raised p-0 text-fg shadow-soft backdrop:bg-ink/60"
    >
      <div
        data-theme="light"
        className="rounded-[var(--radius-card)] bg-surface-raised p-6 text-fg"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="signup-title" className="font-heading text-xl font-bold">
            {t('signup.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-m-2 inline-flex size-12 items-center justify-center rounded-full hover:bg-fg/5"
            aria-label={t('signup.close')}
          >
            <CloseIcon />
          </button>
        </div>
        <p className="mt-2 text-sm text-fg-muted">
          <MaybePlaceholder text={t('signup.intro')} />
        </p>

        <form action={formAction} className="mt-5 flex flex-col gap-4" noValidate>
          <MobileField
            name="mobile"
            label={t('signup.mobile_label')}
            hint={t('signup.mobile_hint')}
            error={invalid.includes('mobile') ? t('signup.error_mobile') : undefined}
            required
          />
          <Checkbox
            name="consent"
            label={t('signup.consent')}
            error={invalid.includes('consent') ? t('signup.error_consent') : undefined}
          />
          <p className="text-[13px] text-fg-muted">{t('signup.consent_note')}</p>
          <input type="hidden" name="sourcePage" value={pathname} />
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label>
              {'Company'}
              <input type="text" name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <Button type="submit" disabled={pending}>
            {t('signup.submit')}
          </Button>
          {state && !state.ok && state.reason === 'not_live' ? (
            <p
              role="status"
              className="rounded-[var(--radius-field)] bg-marigold-light p-3 text-sm text-ink"
            >
              {t('signup.not_live')}
            </p>
          ) : null}
        </form>
      </div>
    </dialog>
  );
}
