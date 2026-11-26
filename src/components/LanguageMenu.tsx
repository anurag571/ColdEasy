import React, { useEffect, useId, useRef, useState } from 'react';
import { LANGUAGES, useLanguage, type Language } from '../context/LanguageContext';

export const LanguageMenu: React.FC<{
  onSelect?: () => void;
  align?: 'left' | 'right';
  placement?: 'down' | 'up';
}> = ({ onSelect, align = 'right', placement = 'down' }) => {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const current = LANGUAGES.find((item) => item.id === language) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const choose = (id: Language) => {
    setLanguage(id);
    setOpen(false);
    onSelect?.();
  };

  const onListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    const ids = LANGUAGES.map((item) => item.id);
    const index = ids.indexOf(language);
    let next = index;
    if (event.key === 'ArrowDown') next = (index + 1) % ids.length;
    else if (event.key === 'ArrowUp') next = (index - 1 + ids.length) % ids.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = ids.length - 1;
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(false);
      onSelect?.();
      return;
    } else return;
    event.preventDefault();
    setLanguage(ids[next]);
    requestAnimationFrame(() => {
      document.getElementById(`${listId}-${ids[next]}`)?.focus();
    });
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="min-h-11 px-3 py-2 rounded-full border border-ink/15 bg-white text-ink font-heading font-bold text-sm cursor-pointer hover:border-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={t('lang.label')}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setOpen(true);
            requestAnimationFrame(() => {
              document.getElementById(`${listId}-${language}`)?.focus();
            });
          }
        }}
      >
        {current.label}
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={t('lang.label')}
          tabIndex={-1}
          onKeyDown={onListKeyDown}
          className={`absolute z-50 min-w-44 max-w-[16rem] rounded-2xl border border-ink/10 bg-white p-1.5 shadow-xl ${
            placement === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
          } ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          {LANGUAGES.map((item) => {
            const selected = item.id === language;
            return (
              <li key={item.id} role="presentation">
                <button
                  id={`${listId}-${item.id}`}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`w-full min-h-11 rounded-xl px-3 py-2 text-left text-sm font-heading cursor-pointer break-words focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf ${
                    selected ? 'bg-leaf text-white' : 'text-ink hover:bg-sand'
                  }`}
                  onClick={() => choose(item.id)}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
