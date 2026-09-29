import React, { useEffect } from 'react';
import { HELP } from '../data/help.js';
import { Info, X } from 'lucide-react';

export const FIELD_TITLES = {
  dist: 'જિલ્લો (District)',
  tal: 'તાલુકા (Taluka)',
  sector: 'સેક્ટર / ઉદ્યોગ પ્રવૃત્તિ (Sector)',
  ptype: 'પ્રોજેક્ટ પ્રકાર (Project Type)',
  exist: 'હાલનું રોકાણ (Existing Gross Block)',
  docp: 'DoCP તારીખ (Date of Commercial Production)',
  pm: 'પ્લાન્ટ અને મશીનરી (Plant & Machinery)',
  bld: 'બિલ્ડિંગ બાંધકામ (Building)',
  infra: 'અન્ય ઇન્ફ્રાસ્ટ્રક્ચર (Other Infrastructure)',
  land: 'જમીન (Land & Land Development)',
  infraIn: 'ઇન્ફ્રાસ્ટ્રક્ચર પરિસરમાં છે? (Inside Premises)',
  loan: 'ટર્મ લોન (Term Loan)',
  rate: 'વાર્ષિક વ્યાજ દર (Interest Rate %)',
  tenure: 'લોન મુદત (Tenure in Years)',
  units: 'વાર્ષિક વીજ વપરાશ (Annual Power Consumption)',
  jobs: 'કુલ રોજગાર (Total Jobs)',
  wage: 'સરેરાશ માસિક વેતન (Average Monthly Wage)',
  em: 'નવા પુરુષ કર્મચારી (New Male Employees)',
  ef: 'નવી મહિલા કર્મચારી (New Female Employees)',
  ed: 'નવા દિવ્યાંગ કર્મચારી (New PwD Employees)',
  women: 'મહિલા ઉદ્યમી (Women Entrepreneur)',
  women100: '100% મહિલા માલિકી (100% Women Equity)',
  startup: 'ઉત્પાદન ક્ષેત્રનું રજિસ્ટર્ડ સ્ટાર્ટઅપ (Manufacturing Startup)',
  firstgen: 'પ્રથમ પેઢીના ઉદ્યોગસાહસિક (First Generation Entrepreneur)',
  outGidc: 'GIDC / માન્ય ઔદ્યોગિક પાર્કની બહાર (Outside GIDC)',
  rent: 'ભાડાના શેડનું માસિક ભાડું (Monthly Shed Rent)',
  useCap: 'ઘટક 1 - કેપિટલ સબસિડી (Capital Subsidy)',
  useInt: 'ઘટક 2 - વ્યાજ સબસિડી (Interest Subsidy)',
  usePow: 'ઘટક 3 - પાવર ટેરિફ (Power Tariff)',
};

export function HelpButton({ fieldKey, onToggle, onOpen }) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpen) {
      onOpen(fieldKey);
    } else if (onToggle) {
      onToggle(fieldKey);
    }
  };

  return (
    <button
      type="button"
      className="ib"
      aria-label="આ ખાના વિશે માહિતી"
      title="માહિતી જોવા માટે ક્લિક કરો"
      onClick={handleClick}
    >
      i
    </button>
  );
}

export function HelpModal({ fieldKey, onClose }) {
  useEffect(() => {
    if (!fieldKey) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fieldKey, onClose]);

  if (!fieldKey) return null;
  const content = HELP[fieldKey];
  const title = FIELD_TITLES[fieldKey] || 'ખાના અંગે માહિતી';

  return (
    <div
      className="help-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div
        className="help-modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="help-modal-header">
          <div className="help-modal-title-wrap">
            <Info size={19} className="help-modal-icon" aria-hidden="true" />
            <h4 id="help-modal-title" className="help-modal-title">
              {title}
            </h4>
          </div>
          <button
            type="button"
            className="help-modal-close-btn"
            onClick={onClose}
            aria-label="બંધ કરો"
            title="બંધ કરો"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div
          className="help-modal-body"
          dangerouslySetInnerHTML={{ __html: content || '' }}
        />

        <div className="help-modal-footer">
          <button
            type="button"
            className="help-modal-ok-btn"
            onClick={onClose}
          >
            સમજાયું
          </button>
        </div>
      </div>
    </div>
  );
}

// Keep HelpBox returning null so inline layout shifts are eliminated
export function HelpBox() {
  return null;
}
