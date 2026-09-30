import React, { useState } from 'react';
import { TALUKAS, catOf } from '../data/talukas.js';
import { SECTORS } from '../data/sectors.js';
import { HelpButton, HelpBox, HelpModal } from './Help.jsx';
import {
  MapPin,
  Building2,
  TrendingUp,
  Zap,
  Users,
  Award,
  CheckCircle2,
  Info,
  HelpCircle,
} from 'lucide-react';

export default function CheckerForm({ formValues, onChange, onInputChange }) {
  const [activeHelpKey, setActiveHelpKey] = useState(null);
  const [showExNote, setShowExNote] = useState(true);

  const openHelp = activeHelpKey ? { [activeHelpKey]: true } : {};

  const toggleHelp = (key) => {
    setActiveHelpKey(key);
  };

  const handleFieldChange = (name, value) => {
    if (showExNote) {
      setShowExNote(false);
    }
    onChange(name, value);
    if (onInputChange) {
      onInputChange();
    }
  };

  // Districts and talukas
  const currentDistIndex = parseInt(formValues.dist, 10);
  const currentDistrict = TALUKAS[currentDistIndex] || TALUKAS[0];
  const talukaList = [
    ...currentDistrict[2].map((t) => [t, 'A']),
    ...currentDistrict[3].map((t) => [t, 'B']),
  ].sort((a, b) => a[0].localeCompare(b[0]));

  const handleDistrictChange = (e) => {
    const newDistIndex = e.target.value;
    const newDistrict = TALUKAS[parseInt(newDistIndex, 10)] || TALUKAS[0];
    const newTalukaList = [
      ...newDistrict[2].map((t) => [t, 'A']),
      ...newDistrict[3].map((t) => [t, 'B']),
    ].sort((a, b) => a[0].localeCompare(b[0]));
    const firstTaluka = newTalukaList[0] ? newTalukaList[0][0] : '';

    if (showExNote) {
      setShowExNote(false);
    }
    onChange('dist', newDistIndex);
    onChange('tal', firstTaluka);
    if (onInputChange) {
      onInputChange();
    }
  };

  const currentCat = catOf(formValues.tal);

  return (
    <form className="form" id="frm" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
      <div className="example" id="exNote" hidden={!showExNote}>
        <Info size={18} style={{ flexShrink: 0 }} aria-hidden="true" />
        <span>ઉદાહરણ વિગતો ભરેલી છે (બોટાદ, સ્મોલ MSME). તમારી વિગતો નાખો.</span>
      </div>
      <div className="form-help-guidance">
        <HelpCircle size={16} className="guidance-icon" aria-hidden="true" />
        <span>
          કોઈપણ ખાનામાં કઈ વિગત ભરવી તે જાણવા માટે તેની બાજુમાં આપેલા <span className="guidance-i-badge">i</span> બટન પર ક્લિક કરો.
        </span>
      </div>

      {/* Fieldset 1: સ્થળ */}
      <fieldset>
        <legend>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={17} style={{ color: 'var(--brand-700)' }} aria-hidden="true" />
            <span>સ્થળ</span>
          </span>
        </legend>
        <div className="row">
          <label className="f">
            <span className="lh">
              <span>જિલ્લો</span>
              <HelpButton fieldKey="dist" isOpen={!!openHelp.dist} onToggle={toggleHelp} />
            </span>
            <select
              id="dist"
              value={formValues.dist}
              onChange={handleDistrictChange}
            >
              {TALUKAS.map((d, i) => (
                <option key={d[0]} value={i}>
                  {d[1]} · {d[0]}
                </option>
              ))}
            </select>
          </label>
          <label className="f">
            <span className="lh">
              <span>તાલુકા</span>
              <HelpButton fieldKey="tal" isOpen={!!openHelp.tal} onToggle={toggleHelp} />
            </span>
            <select
              id="tal"
              value={formValues.tal}
              onChange={(e) => handleFieldChange('tal', e.target.value)}
            >
              {talukaList.map(([t, c]) => (
                <option key={t} value={t}>
                  {t} (Cat {c})
                </option>
              ))}
            </select>
          </label>
        </div>
        <HelpBox fieldKey="dist" isOpen={!!openHelp.dist} as="div" />
        <HelpBox fieldKey="tal" isOpen={!!openHelp.tal} as="div" />
        <p className="hint" id="catLine" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
          <span>{formValues.tal || ''} તાલુકા:</span>
          {currentCat ? (
            <span className={`catpill cat${currentCat}`}>Category {currentCat}</span>
          ) : (
            <span className="catpill catB">શ્રેણી પસંદ કરો</span>
          )}
          <span style={{ color: 'var(--mute)' }}>· GR 08.09.2026</span>
        </p>
      </fieldset>

      {/* Fieldset 2: પ્રોજેક્ટ */}
      <fieldset>
        <legend>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={17} style={{ color: 'var(--brand-700)' }} aria-hidden="true" />
            <span>પ્રોજેક્ટ</span>
          </span>
        </legend>
        <label className="f">
          <span className="lh">
            <span>ઉત્પાદન ક્ષેત્ર (Annexure-A)</span>
            <HelpButton fieldKey="sector" isOpen={!!openHelp.sector} onToggle={toggleHelp} />
          </span>
          <select
            id="sector"
            value={formValues.sector}
            onChange={(e) => handleFieldChange('sector', e.target.value)}
          >
            <optgroup label="સામાન્ય">
              {SECTORS.filter((s) => s.kind === 'general').map((s) => (
                <option key={s.id} value={s.id}>
                  {s.g}
                </option>
              ))}
            </optgroup>
            <optgroup label="થ્રસ્ટ સેક્ટર (Annexure-A)">
              {SECTORS.filter((s) => s.kind === 'thrust').map((s) => (
                <option key={s.id} value={s.id}>
                  {s.g}
                </option>
              ))}
            </optgroup>
            <optgroup label="પસંદગીનાં થ્રસ્ટ સેક્ટર">
              {SECTORS.filter((s) => s.kind === 'selected').map((s) => (
                <option key={s.id} value={s.id}>
                  {s.g}
                </option>
              ))}
            </optgroup>
          </select>
          <HelpBox fieldKey="sector" isOpen={!!openHelp.sector} as="span" />
        </label>

        <div className="seghead" id="ptypeHead">
          <span>પ્રોજેક્ટનો પ્રકાર</span>
          <HelpButton fieldKey="ptype" isOpen={!!openHelp.ptype} onToggle={toggleHelp} />
        </div>
        <HelpBox fieldKey="ptype" isOpen={!!openHelp.ptype} as="div" />

        <div className="seg" role="radiogroup" aria-label="પ્રોજેક્ટ પ્રકાર">
          <label>
            <input
              type="radio"
              name="ptype"
              value="new"
              id="pt-new"
              checked={formValues.ptype === 'new'}
              onChange={(e) => handleFieldChange('ptype', e.target.value)}
            />
            <span>નવો એકમ</span>
          </label>
          <label>
            <input
              type="radio"
              name="ptype"
              value="exp"
              id="pt-exp"
              checked={formValues.ptype === 'exp'}
              onChange={(e) => handleFieldChange('ptype', e.target.value)}
            />
            <span>વિસ્તરણ</span>
          </label>
          <label>
            <input
              type="radio"
              name="ptype"
              value="div"
              id="pt-div"
              checked={formValues.ptype === 'div'}
              onChange={(e) => handleFieldChange('ptype', e.target.value)}
            />
            <span>ડાયવર્સિફિકેશન</span>
          </label>
        </div>

        <label className="f" id="exWrap" hidden={formValues.ptype === 'new'}>
          <span className="lh">
            <span>હાલના પ્રોજેક્ટનું GFCI, જમીન સિવાય (₹ કરોડ)</span>
            <HelpButton fieldKey="exist" isOpen={!!openHelp.exist} onToggle={toggleHelp} />
          </span>
          <input
            type="number"
            id="exist"
            min="0"
            step="0.01"
            value={formValues.exist}
            onChange={(e) => handleFieldChange('exist', e.target.value)}
          />
          <HelpBox fieldKey="exist" isOpen={!!openHelp.exist} as="span" />
        </label>

        <label className="f">
          <span className="lh">
            <span>વાણિજ્યિક ઉત્પાદન શરૂ થવાની અપેક્ષિત તારીખ (DoCP)</span>
            <HelpButton fieldKey="docp" isOpen={!!openHelp.docp} onToggle={toggleHelp} />
          </span>
          <input
            type="month"
            id="docp"
            value={formValues.docp}
            onChange={(e) => handleFieldChange('docp', e.target.value)}
          />
          <HelpBox fieldKey="docp" isOpen={!!openHelp.docp} as="span" />
        </label>
      </fieldset>

      {/* Fieldset 3: રોકાણ */}
      <fieldset>
        <legend>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={17} style={{ color: 'var(--brand-700)' }} aria-hidden="true" />
            <span>રોકાણ</span>
          </span>
          <small>(₹ કરોડમાં · 1 લાખ = 0.01)</small>
        </legend>
        <div className="row">
          <label className="f">
            <span className="lh">
              <span>પ્લાન્ટ અને મશીનરી</span>
              <HelpButton fieldKey="pm" isOpen={!!openHelp.pm} onToggle={toggleHelp} />
            </span>
            <input
              type="number"
              id="pm"
              min="0"
              step="0.01"
              value={formValues.pm}
              onChange={(e) => handleFieldChange('pm', e.target.value)}
            />
          </label>
          <label className="f">
            <span className="lh">
              <span>નવું બિલ્ડિંગ + અન્ય બાંધકામ</span>
              <HelpButton fieldKey="bld" isOpen={!!openHelp.bld} onToggle={toggleHelp} />
            </span>
            <input
              type="number"
              id="bld"
              min="0"
              step="0.01"
              value={formValues.bld}
              onChange={(e) => handleFieldChange('bld', e.target.value)}
            />
          </label>
        </div>
        <HelpBox fieldKey="pm" isOpen={!!openHelp.pm} as="div" />
        <HelpBox fieldKey="bld" isOpen={!!openHelp.bld} as="div" />

        <div className="row">
          <label className="f">
            <span className="lh">
              <span>પ્રોજેક્ટ સંબંધિત ઇન્ફ્રા</span>
              <HelpButton fieldKey="infra" isOpen={!!openHelp.infra} onToggle={toggleHelp} />
            </span>
            <input
              type="number"
              id="infra"
              min="0"
              step="0.01"
              value={formValues.infra}
              onChange={(e) => handleFieldChange('infra', e.target.value)}
            />
          </label>
          <label className="f">
            <span className="lh">
              <span>જમીન</span>
              <HelpButton fieldKey="land" isOpen={!!openHelp.land} onToggle={toggleHelp} />
            </span>
            <input
              type="number"
              id="land"
              min="0"
              step="0.01"
              value={formValues.land}
              onChange={(e) => handleFieldChange('land', e.target.value)}
            />
          </label>
        </div>
        <HelpBox fieldKey="infra" isOpen={!!openHelp.infra} as="div" />
        <HelpBox fieldKey="land" isOpen={!!openHelp.land} as="div" />

        <label className="chk">
          <input
            type="checkbox"
            id="infraIn"
            checked={formValues.infraIn}
            onChange={(e) => handleFieldChange('infraIn', e.target.checked)}
          />
          <span>ઇન્ફ્રા પ્રોજેક્ટ પરિસરની અંદર છે</span>
          <HelpButton fieldKey="infraIn" isOpen={!!openHelp.infraIn} onToggle={toggleHelp} />
        </label>
        <HelpBox fieldKey="infraIn" isOpen={!!openHelp.infraIn} as="div" />

        <p className="hint">MSME નો વર્ગ દેશભરના તમામ એકમોના કુલ P&amp;M રોકાણ પરથી નક્કી થાય છે.</p>
      </fieldset>

      {/* Fieldset 4: ટર્મ લોન અને વીજળી */}
      <fieldset>
        <legend>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={17} style={{ color: 'var(--brand-700)' }} aria-hidden="true" />
            <span>ટર્મ લોન અને વીજળી</span>
          </span>
        </legend>
        <div className="row3">
          <label className="f">
            <span className="lh">
              <span>લોન (₹ કરોડ)</span>
              <HelpButton fieldKey="loan" isOpen={!!openHelp.loan} onToggle={toggleHelp} />
            </span>
            <input
              type="number"
              id="loan"
              min="0"
              step="0.01"
              value={formValues.loan}
              onChange={(e) => handleFieldChange('loan', e.target.value)}
            />
          </label>
          <label className="f">
            <span className="lh">
              <span>વ્યાજ દર %</span>
              <HelpButton fieldKey="rate" isOpen={!!openHelp.rate} onToggle={toggleHelp} />
            </span>
            <input
              type="number"
              id="rate"
              min="0"
              step="0.05"
              value={formValues.rate}
              onChange={(e) => handleFieldChange('rate', e.target.value)}
            />
          </label>
          <label className="f">
            <span className="lh">
              <span>મુદત (વર્ષ)</span>
              <HelpButton fieldKey="tenure" isOpen={!!openHelp.tenure} onToggle={toggleHelp} />
            </span>
            <input
              type="number"
              id="tenure"
              min="1"
              step="1"
              value={formValues.tenure}
              onChange={(e) => handleFieldChange('tenure', e.target.value)}
            />
          </label>
        </div>
        <HelpBox fieldKey="loan" isOpen={!!openHelp.loan} as="div" />
        <HelpBox fieldKey="rate" isOpen={!!openHelp.rate} as="div" />
        <HelpBox fieldKey="tenure" isOpen={!!openHelp.tenure} as="div" />

        <label className="f">
          <span className="lh">
            <span>વાર્ષિક વીજ વપરાશ, નવો/વધારાનો (યુનિટ)</span>
            <HelpButton fieldKey="units" isOpen={!!openHelp.units} onToggle={toggleHelp} />
          </span>
          <input
            type="number"
            id="units"
            min="0"
            step="1000"
            value={formValues.units}
            onChange={(e) => handleFieldChange('units', e.target.value)}
          />
          <HelpBox fieldKey="units" isOpen={!!openHelp.units} as="span" />
        </label>
      </fieldset>

      {/* Fieldset 5: રોજગારી */}
      <fieldset>
        <legend>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Users size={17} style={{ color: 'var(--brand-700)' }} aria-hidden="true" />
            <span>રોજગારી</span>
          </span>
        </legend>
        <div className="row">
          <label className="f">
            <span className="lh">
              <span>કુલ સીધી રોજગારી</span>
              <HelpButton fieldKey="jobs" isOpen={!!openHelp.jobs} onToggle={toggleHelp} />
            </span>
            <input
              type="number"
              id="jobs"
              min="0"
              step="1"
              value={formValues.jobs}
              onChange={(e) => handleFieldChange('jobs', e.target.value)}
            />
          </label>
          <label className="f">
            <span className="lh">
              <span>સરેરાશ બેઝિક + DA (₹/માસ)</span>
              <HelpButton fieldKey="wage" isOpen={!!openHelp.wage} onToggle={toggleHelp} />
            </span>
            <input
              type="number"
              id="wage"
              min="0"
              step="500"
              value={formValues.wage}
              onChange={(e) => handleFieldChange('wage', e.target.value)}
            />
          </label>
        </div>
        <HelpBox fieldKey="jobs" isOpen={!!openHelp.jobs} as="div" />
        <HelpBox fieldKey="wage" isOpen={!!openHelp.wage} as="div" />

        <div className="row3">
          <label className="f">
            <span className="lh">
              <span>નવા પુરુષ કર્મચારી</span>
              <HelpButton fieldKey="em" isOpen={!!openHelp.em} onToggle={toggleHelp} />
            </span>
            <input
              type="number"
              id="em"
              min="0"
              step="1"
              value={formValues.em}
              onChange={(e) => handleFieldChange('em', e.target.value)}
            />
          </label>
          <label className="f">
            <span className="lh">
              <span>નવા મહિલા કર્મચારી</span>
              <HelpButton fieldKey="ef" isOpen={!!openHelp.ef} onToggle={toggleHelp} />
            </span>
            <input
              type="number"
              id="ef"
              min="0"
              step="1"
              value={formValues.ef}
              onChange={(e) => handleFieldChange('ef', e.target.value)}
            />
          </label>
          <label className="f">
            <span className="lh">
              <span>નવા દિવ્યાંગ કર્મચારી</span>
              <HelpButton fieldKey="ed" isOpen={!!openHelp.ed} onToggle={toggleHelp} />
            </span>
            <input
              type="number"
              id="ed"
              min="0"
              step="1"
              value={formValues.ed}
              onChange={(e) => handleFieldChange('ed', e.target.value)}
            />
          </label>
        </div>
        <HelpBox fieldKey="em" isOpen={!!openHelp.em} as="div" />
        <HelpBox fieldKey="ef" isOpen={!!openHelp.ef} as="div" />
        <HelpBox fieldKey="ed" isOpen={!!openHelp.ed} as="div" />

        <p className="hint">“નવો કર્મચારી” એટલે જોડાતા પહેલાં UAN ન હોય તેવો કર્મચારી.</p>
      </fieldset>

      {/* Fieldset 6: ઉદ્યમી અને સ્થળ વિશે */}
      <fieldset>
        <legend>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Award size={17} style={{ color: 'var(--brand-700)' }} aria-hidden="true" />
            <span>ઉદ્યમી અને સ્થળ વિશે</span>
          </span>
        </legend>
        <label className="chk">
          <input
            type="checkbox"
            id="women"
            checked={formValues.women}
            onChange={(e) => handleFieldChange('women', e.target.checked)}
          />
          <span>મહિલા ઉદ્યમી</span>
          <HelpButton fieldKey="women" isOpen={!!openHelp.women} onToggle={toggleHelp} />
        </label>
        <HelpBox fieldKey="women" isOpen={!!openHelp.women} as="div" />

        <label className="chk">
          <input
            type="checkbox"
            id="women100"
            checked={formValues.women100}
            onChange={(e) => handleFieldChange('women100', e.target.checked)}
          />
          <span>100% ઇક્વિટી મહિલાની માલિકીની</span>
          <HelpButton fieldKey="women100" isOpen={!!openHelp.women100} onToggle={toggleHelp} />
        </label>
        <HelpBox fieldKey="women100" isOpen={!!openHelp.women100} as="div" />

        <label className="chk">
          <input
            type="checkbox"
            id="startup"
            checked={formValues.startup}
            onChange={(e) => handleFieldChange('startup', e.target.checked)}
          />
          <span>ઉત્પાદન ક્ષેત્રનું રજિસ્ટર્ડ સ્ટાર્ટઅપ</span>
          <HelpButton fieldKey="startup" isOpen={!!openHelp.startup} onToggle={toggleHelp} />
        </label>
        <HelpBox fieldKey="startup" isOpen={!!openHelp.startup} as="div" />

        <label className="chk">
          <input
            type="checkbox"
            id="firstgen"
            checked={formValues.firstgen}
            onChange={(e) => handleFieldChange('firstgen', e.target.checked)}
          />
          <span>પ્રથમ પેઢીના ઉદ્યમી</span>
          <HelpButton fieldKey="firstgen" isOpen={!!openHelp.firstgen} onToggle={toggleHelp} />
        </label>
        <HelpBox fieldKey="firstgen" isOpen={!!openHelp.firstgen} as="div" />

        <label className="chk">
          <input
            type="checkbox"
            id="outGidc"
            checked={formValues.outGidc}
            onChange={(e) => handleFieldChange('outGidc', e.target.checked)}
          />
          <span>GIDC / માન્ય ઔદ્યોગિક પાર્કની બહાર</span>
          <HelpButton fieldKey="outGidc" isOpen={!!openHelp.outGidc} onToggle={toggleHelp} />
        </label>
        <HelpBox fieldKey="outGidc" isOpen={!!openHelp.outGidc} as="div" />

        <label className="f">
          <span className="lh">
            <span>ભાડાના શેડનું માસિક ભાડું (₹)</span>
            <HelpButton fieldKey="rent" isOpen={!!openHelp.rent} onToggle={toggleHelp} />
          </span>
          <input
            type="number"
            id="rent"
            min="0"
            step="1000"
            value={formValues.rent}
            onChange={(e) => handleFieldChange('rent', e.target.value)}
          />
        </label>
        <HelpBox fieldKey="rent" isOpen={!!openHelp.rent} as="div" />
      </fieldset>

      {/* Fieldset 7: પસંદ કરેલા ઘટક */}
      <fieldset>
        <legend>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={17} style={{ color: 'var(--brand-700)' }} aria-hidden="true" />
            <span>પસંદ કરેલા ઘટક</span>
          </span>
          <small>(GR: કોઈ એક કે સંયોજન)</small>
        </legend>
        <label className="chk">
          <input
            type="checkbox"
            id="useCap"
            checked={formValues.useCap}
            onChange={(e) => handleFieldChange('useCap', e.target.checked)}
          />
          <span>ઘટક 1 · કેપિટલ સબસિડી</span>
          <HelpButton fieldKey="useCap" isOpen={!!openHelp.useCap} onToggle={toggleHelp} />
        </label>
        <HelpBox fieldKey="useCap" isOpen={!!openHelp.useCap} as="div" />

        <label className="chk">
          <input
            type="checkbox"
            id="useInt"
            checked={formValues.useInt}
            onChange={(e) => handleFieldChange('useInt', e.target.checked)}
          />
          <span>ઘટક 2 · વ્યાજ સબસિડી</span>
          <HelpButton fieldKey="useInt" isOpen={!!openHelp.useInt} onToggle={toggleHelp} />
        </label>
        <HelpBox fieldKey="useInt" isOpen={!!openHelp.useInt} as="div" />

        <label className="chk">
          <input
            type="checkbox"
            id="usePow"
            checked={formValues.usePow}
            onChange={(e) => handleFieldChange('usePow', e.target.checked)}
          />
          <span>ઘટક 3 · પાવર ટેરિફ</span>
          <HelpButton fieldKey="usePow" isOpen={!!openHelp.usePow} onToggle={toggleHelp} />
        </label>
        <HelpBox fieldKey="usePow" isOpen={!!openHelp.usePow} as="div" />
      </fieldset>
      {/* Help Information Popup Modal */}
      <HelpModal fieldKey={activeHelpKey} onClose={() => setActiveHelpKey(null)} />
    </form>
  );
}
