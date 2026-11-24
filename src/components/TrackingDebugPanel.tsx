import React, { useState, useEffect } from 'react';
import { RecordedEvent } from '../lib/track';
import { Terminal, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

export const TrackingDebugPanel: React.FC = () => {
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [events, setEvents] = useState<RecordedEvent[]>([]);

  useEffect(() => {
    const checkDebugParam = () => {
      const fullUrl = window.location.href;
      if (fullUrl.includes('?debug=1') || fullUrl.includes('&debug=1')) {
        setIsDebugMode(true);
      }
    };

    checkDebugParam();
    window.addEventListener('hashchange', checkDebugParam);
    return () => window.removeEventListener('hashchange', checkDebugParam);
  }, []);

  useEffect(() => {
    if (!isDebugMode) return;

    // Load initial events from window buffer
    if (window.__ce_events) {
      setEvents([...window.__ce_events]);
    }

    // Subscribe to new tracking events
    window.__ce_event_listeners = window.__ce_event_listeners || [];
    const listener = (newEvents: RecordedEvent[]) => {
      setEvents([...newEvents]);
    };
    window.__ce_event_listeners.push(listener);

    return () => {
      if (window.__ce_event_listeners) {
        window.__ce_event_listeners = window.__ce_event_listeners.filter((l) => l !== listener);
      }
    };
  }, [isDebugMode]);

  if (!isDebugMode) return null;

  const handleClear = () => {
    window.__ce_events = [];
    setEvents([]);
  };

  return (
    <div className="fixed bottom-12 left-4 z-50 max-w-sm sm:max-w-md w-full font-mono text-xs select-none">
      <div className="bg-ink text-white rounded-[20px] shadow-2xl border border-white/20 overflow-hidden flex flex-col max-h-[360px]">
        {/* Header */}
        <div className="p-3 bg-ink/95 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-sky" />
            <span className="font-heading font-bold text-xs uppercase tracking-wider text-white">
              Event Debugger (?debug=1)
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/15 text-[10px] text-white/90">
              {events.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="p-1 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Clear events"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Event List */}
        {isOpen && (
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-[11px] bg-black/40">
            {events.length === 0 ? (
              <div className="text-center py-6 text-white/40 italic">
                No events recorded yet. Click buttons or navigate to trigger events.
              </div>
            ) : (
              events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between text-sky font-semibold">
                    <span>{ev.name}</span>
                    <span className="text-[10px] text-white/60 font-normal">{ev.timestamp}</span>
                  </div>
                  {ev.params && Object.keys(ev.params).length > 0 && (
                    <pre className="mt-1 text-[10px] text-white/80 overflow-x-auto whitespace-pre-wrap font-mono">
                      {JSON.stringify(ev.params, null, 2)}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
