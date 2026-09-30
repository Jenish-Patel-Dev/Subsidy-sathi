import React, { useState, useMemo } from 'react';
import { TALUKAS } from '../data/talukas.js';
import { Search, Building2, MapPin, Layers, Info, X, CheckCircle2, Sparkles } from 'lucide-react';

export default function TalukaGrid({ hidden }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const q = searchQuery.trim().toLowerCase();

  // Calculate overall statistics
  const stats = useMemo(() => {
    let catA = 0;
    let catB = 0;
    TALUKAS.forEach(([, , a, b]) => {
      catA += a.length;
      catB += b.length;
    });
    return {
      totalDistricts: TALUKAS.length,
      totalCatA: catA,
      totalCatB: catB,
      totalTalukas: catA + catB,
    };
  }, []);

  // Filtered districts and talukas
  const filteredDistricts = useMemo(() => {
    return TALUKAS.map(([en, gu, a, b]) => {
      const districtMatches = !q || en.toLowerCase().includes(q) || gu.includes(q);

      // Taluka matching logic
      const talukaMatches = (t) => !q || districtMatches || t.toLowerCase().includes(q);

      const fa = filter === 'B' ? [] : a.filter(talukaMatches);
      const fb = filter === 'A' ? [] : b.filter(talukaMatches);

      // If neither category has matching talukas, exclude this district
      if (!fa.length && !fb.length) return null;

      return {
        en,
        gu,
        catA: fa,
        catB: fb,
        origTotalA: a.length,
        origTotalB: b.length,
        totalShown: fa.length + fb.length,
        districtMatches,
      };
    }).filter(Boolean);
  }, [q, filter]);

  // Total visible talukas across all matched districts
  const visibleTalukasCount = useMemo(() => {
    return filteredDistricts.reduce((acc, d) => acc + d.totalShown, 0);
  }, [filteredDistricts]);

  return (
    <section id="p-taluka" data-panel="taluka" hidden={hidden} className="taluka-container">
      {/* Header */}
      <div>
        <div className="taluka-top-badge">
          <Sparkles size={14} style={{ flexShrink: 0 }} />
          <span>પરિશિષ્ટ-અ · Annexure-A (GR 06-10-2020)</span>
        </div>
        <h2 className="sec-h" style={{ marginTop: '2px' }}>તાલુકા શ્રેણી વર્ગીકરણ</h2>
        <p className="sec-p">
          ગુજરાતના તમામ ૩૪ જિલ્લાઓના તાલુકાઓનું Category-A અને Category-B મુજબ વિગતવાર વર્ગીકરણ.
        </p>
      </div>

      {/* Summary KPI Stat Cards */}
      <div className="taluka-stats-grid">
        <div className="taluka-stat-card">
          <div className="taluka-stat-icon districts">
            <Building2 size={22} />
          </div>
          <div>
            <div className="taluka-stat-val">{stats.totalDistricts}</div>
            <div className="taluka-stat-lbl">કુલ જિલ્લા</div>
            <div className="taluka-stat-sub">ગુજરાત રાજ્ય</div>
          </div>
        </div>

        <div className="taluka-stat-card">
          <div className="taluka-stat-icon cat-a">
            <span style={{ fontSize: '16px', fontWeight: '800' }}>A</span>
          </div>
          <div>
            <div className="taluka-stat-val">{stats.totalCatA}</div>
            <div className="taluka-stat-lbl">Category-A તાલુકા</div>
            <div className="taluka-stat-sub">વધુ સહાય (7% વ્યાજ / 65% કેપિટલ)</div>
          </div>
        </div>

        <div className="taluka-stat-card">
          <div className="taluka-stat-icon cat-b">
            <span style={{ fontSize: '16px', fontWeight: '800' }}>B</span>
          </div>
          <div>
            <div className="taluka-stat-val">{stats.totalCatB}</div>
            <div className="taluka-stat-lbl">Category-B તાલુકા</div>
            <div className="taluka-stat-sub">સામાન્ય સહાય (5% વ્યાજ / 60% કેપિટલ)</div>
          </div>
        </div>

        <div className="taluka-stat-card">
          <div className="taluka-stat-icon total">
            <MapPin size={22} />
          </div>
          <div>
            <div className="taluka-stat-val">{stats.totalTalukas}</div>
            <div className="taluka-stat-lbl">કુલ તાલુકાઓ</div>
            <div className="taluka-stat-sub">
              {q || filter !== 'all' ? `હાલ દર્શાવેલ: ${visibleTalukasCount}` : 'સંપૂર્ણ રાજ્ય આવરી લીધું'}
            </div>
          </div>
        </div>
      </div>

      {/* Rule Info Banner */}
      <div className="taluka-rule-banner">
        <Info size={20} style={{ color: 'var(--brand-700)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>મહત્વનો સરકારી નિયમ:</strong> જો કોઈ ઔદ્યોગિક પ્રોજેક્ટ એક કરતાં વધુ તાલુકામાં ફેલાયેલો હોય, તો જમીનનો સૌથી મોટો ભાગ (Majority Area) જે તાલુકામાં આવતો હોય, તે તાલુકાની શ્રેણી સમગ્ર પ્રોજેક્ટ માટે ગણવામાં આવશે.
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="taluka-toolbar-card">
        {/* Search input with clear button */}
        <div className="taluka-search-wrap">
          <Search size={18} className="taluka-search-icon" aria-hidden="true" />
          <input
            type="search"
            id="tq"
            className="taluka-search-input"
            placeholder="તાલુકા કે જિલ્લો શોધો, દા.ત. Botad, Dholera, અમદાવાદ..."
            aria-label="તાલુકા કે જિલ્લો શોધો"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '44px', paddingRight: searchQuery ? '40px' : '16px' }}
          />
          {searchQuery && (
            <button
              type="button"
              className="taluka-search-clear"
              onClick={() => setSearchQuery('')}
              title="શોધ સાફ કરો"
              aria-label="શોધ સાફ કરો"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Segmented Controls */}
        <div className="taluka-filter-group" role="group" aria-label="કેટેગરી ફિલ્ટર">
          <button
            type="button"
            className={`taluka-filter-btn ${filter === 'all' ? 'active' : ''}`}
            aria-pressed={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            બધા ({stats.totalDistricts})
          </button>
          <button
            type="button"
            className={`taluka-filter-btn ${filter === 'A' ? 'active' : ''}`}
            aria-pressed={filter === 'A'}
            onClick={() => setFilter('A')}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-500)', display: 'inline-block' }}></span>
            Category A ({stats.totalCatA})
          </button>
          <button
            type="button"
            className={`taluka-filter-btn ${filter === 'B' ? 'active' : ''}`}
            aria-pressed={filter === 'B'}
            onClick={() => setFilter('B')}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand-600)', display: 'inline-block' }}></span>
            Category B ({stats.totalCatB})
          </button>
        </div>
      </div>

      {/* Results Count Summary when searching or filtering */}
      {(q || filter !== 'all') && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: 'var(--mute)', padding: '0 4px' }}>
          <span>
            મળેલા પરિણામો: <strong style={{ color: 'var(--ink)' }}>{filteredDistricts.length}</strong> જિલ્લાઓ (<strong style={{ color: 'var(--ink)' }}>{visibleTalukasCount}</strong> તાલુકા)
          </span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setFilter('all');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--brand-700)',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '12.5px',
            }}
          >
            બધા ફિલ્ટર્સ સાફ કરો
          </button>
        </div>
      )}

      {/* District Cards Grid */}
      <div className="taluka-cards-grid" id="talGrid">
        {filteredDistricts.length > 0 ? (
          filteredDistricts.map((d) => {
            const hasCatA = d.catA.length > 0;
            const hasCatB = d.catB.length > 0;

            return (
              <div className="taluka-card" key={d.en}>
                {/* District Header */}
                <div className="taluka-card-head">
                  <div className="taluka-card-title-wrap">
                    <div className="taluka-card-icon">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <div className="taluka-card-gu-name">{d.gu}</div>
                      <div className="taluka-card-en-name">{d.en}</div>
                    </div>
                  </div>
                  <span className="taluka-card-badge">
                    {d.totalShown} તાલુકા
                  </span>
                </div>

                {/* Category A Section */}
                {(filter === 'all' || filter === 'A') && (
                  <div className="taluka-cat-section">
                    <div className="taluka-cat-head">
                      <span className="taluka-cat-head-pill cat-a">
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                        Category-A ({d.catA.length})
                      </span>
                      <span className="taluka-cat-subtext">ઉચ્ચ સબસિડી દર</span>
                    </div>

                    {hasCatA ? (
                      <div className="taluka-chips-wrap">
                        {d.catA.map((t) => {
                          const isMatched = q && t.toLowerCase().includes(q);
                          return (
                            <span
                              key={t}
                              className={`taluka-chip cat-a ${isMatched ? 'matched' : ''}`}
                              title={`${t} (${d.gu} - Category A)`}
                            >
                              {t}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="taluka-empty-cat">
                        આ જિલ્લામાં Category-A તાલુકો નથી
                      </div>
                    )}
                  </div>
                )}

                {/* Category B Section */}
                {(filter === 'all' || filter === 'B') && (
                  <div className="taluka-cat-section" style={{ marginTop: filter === 'all' ? '6px' : '0' }}>
                    <div className="taluka-cat-head">
                      <span className="taluka-cat-head-pill cat-b">
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                        Category-B ({d.catB.length})
                      </span>
                      <span className="taluka-cat-subtext">સામાન્ય સબસિડી દર</span>
                    </div>

                    {hasCatB ? (
                      <div className="taluka-chips-wrap">
                        {d.catB.map((t) => {
                          const isMatched = q && t.toLowerCase().includes(q);
                          return (
                            <span
                              key={t}
                              className={`taluka-chip cat-b ${isMatched ? 'matched' : ''}`}
                              title={`${t} (${d.gu} - Category B)`}
                            >
                              {t}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="taluka-empty-cat">
                        {d.origTotalA > 0 ? 'આ જિલ્લાના તમામ તાલુકા Category-A છે' : 'આ જિલ્લામાં Category-B તાલુકો નથી'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="taluka-no-results">
            <div className="taluka-no-results-icon">
              <Search size={24} />
            </div>
            <h3>આ નામનો કોઈ તાલુકો કે જિલ્લો મળ્યો નથી</h3>
            <p>
              કૃપા કરીને અંગ્રેજી કે ગુજરાતી જોડણી ચકાસો (દા.ત. &quot;Jasdan&quot;, &quot;Botad&quot;, &quot;Dholera&quot;, &quot;અમદાવાદ&quot;).
            </p>
            <button
              type="button"
              className="taluka-reset-btn"
              onClick={() => {
                setSearchQuery('');
                setFilter('all');
              }}
            >
              શોધ રીસેટ કરો
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
