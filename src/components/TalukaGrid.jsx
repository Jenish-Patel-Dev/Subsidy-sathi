import React, { useState } from 'react';
import { TALUKAS } from '../data/talukas.js';
import { Search, MapPin, Building } from 'lucide-react';

export default function TalukaGrid({ hidden }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const q = searchQuery.trim().toLowerCase();

  const renderedPanels = TALUKAS.map(([en, gu, a, b]) => {
    const m = (t) =>
      !q ||
      t.toLowerCase().includes(q) ||
      en.toLowerCase().includes(q) ||
      gu.includes(q);

    const fa = filter === 'B' ? [] : a.filter(m);
    const fb = filter === 'A' ? [] : b.filter(m);

    if (!fa.length && !fb.length) return null;

    return (
      <div className="panel" key={en}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <Building size={16} style={{ color: 'var(--brand-700)', flexShrink: 0 }} aria-hidden="true" />
          <h4 style={{ margin: 0, border: 'none', padding: 0 }}>
            {gu} · {en}
          </h4>
        </div>
        <div className="cols">
          <div style={{ background: 'var(--paper)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
            <span className="catpill catA">Category A · {fa.length}</span>
            <ul>
              {fa.length > 0 ? (
                fa.map((t) => <li key={t}>{t}</li>)
              ) : (
                <li style={{ color: 'var(--mute)' }}>—</li>
              )}
            </ul>
          </div>
          <div style={{ background: 'var(--paper)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
            <span className="catpill catB">Category B · {fb.length}</span>
            <ul>
              {fb.length > 0 ? (
                fb.map((t) => <li key={t}>{t}</li>)
              ) : (
                <li style={{ color: 'var(--mute)' }}>—</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }).filter(Boolean);

  return (
    <section id="p-taluka" data-panel="taluka" hidden={hidden}>
      <h2 className="sec-h">તાલુકા શ્રેણી (Annexure-A)</h2>
      <p className="sec-p">
        34 જિલ્લા · 130 Category-A અને 138 Category-B તાલુકા. પ્રોજેક્ટ એકથી વધુ તાલુકામાં હોય તો જમીનનો સૌથી મોટો ભાગ જે તાલુકામાં હોય તેની શ્રેણી ગણાય.
      </p>
      <div className="toolbar">
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--mute)',
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          />
          <input
            type="search"
            id="tq"
            placeholder="તાલુકા કે જિલ્લો શોધો, દા.ત. Botad"
            aria-label="તાલુકા શોધો"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
        </div>
        <div className="filt" id="tf">
          <button
            type="button"
            data-f="all"
            aria-pressed={filter === 'all' ? 'true' : 'false'}
            onClick={() => setFilter('all')}
          >
            બધા
          </button>
          <button
            type="button"
            data-f="A"
            aria-pressed={filter === 'A' ? 'true' : 'false'}
            onClick={() => setFilter('A')}
          >
            Category A
          </button>
          <button
            type="button"
            data-f="B"
            aria-pressed={filter === 'B' ? 'true' : 'false'}
            onClick={() => setFilter('B')}
          >
            Category B
          </button>
        </div>
      </div>
      <div className="tal" id="talGrid">
        {renderedPanels.length > 0 ? (
          renderedPanels
        ) : (
          <p className="hint" style={{ gridColumn: '1 / -1', padding: '16px', background: 'var(--surface)', borderRadius: 'var(--radius-md)' }}>
            આ નામનો તાલુકો મળ્યો નહીં. અંગ્રેજી જોડણી અજમાવો, દા.ત. &quot;Jasdan&quot;.
          </p>
        )}
      </div>
    </section>
  );
}
