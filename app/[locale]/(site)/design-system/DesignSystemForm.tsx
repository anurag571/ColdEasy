'use client';

import { Checkbox, MobileField, TextArea, TextField } from '@/components/ui/Field';

export function DesignSystemForm() {
  return (
    <form className="grid max-w-xl gap-5" onSubmit={(e) => e.preventDefault()}>
      <TextField label="Full name" name="name" autoComplete="off" />
      <MobileField label="Mobile number" name="mobile" hint="10-digit Indian mobile number" />
      <TextField
        label="Pincode"
        name="pincode"
        inputMode="numeric"
        error="Enter a six-digit pincode."
      />
      <TextField label="GSTIN" name="gstin" optional="(optional)" />
      <TextArea label="Message" name="message" />
      <Checkbox label="Unticked consent checkbox. Never pre-ticked." name="consent" />
    </form>
  );
}
