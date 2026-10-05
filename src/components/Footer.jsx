import React from 'react';
import { ShieldAlert, ExternalLink } from 'lucide-react';

export default function Footer({ onSelectTab }) {
  return (
    <footer className="desktop-footer">
      <div className="wrap">
        <div className="footer-disclaimer-row">
          <ShieldAlert size={20} className="footer-disclaimer-icon" aria-hidden="true" />
          <div className="footer-disclaimer-text">
            સબસિડી સાથી સરકારી એપ નથી. અહીંની રકમ ત્રણ GR પર આધારિત સૂચક અંદાજ છે, મંજૂરી કે ખાતરી નથી; સત્તાવાર GR અને મંજૂરી સત્તાધિકારીનો નિર્ણય જ આખરી.{' '}
            <a
              href="#disc"
              className="footer-disc-link"
              onClick={(e) => {
                e.preventDefault();
                if (onSelectTab) onSelectTab('disc');
                else window.location.hash = 'disc';
              }}
            >
              સંપૂર્ણ અસ્વીકરણ વાંચો
            </a>
          </div>
        </div>
        <div className="footer-official-ref">
          <span className="footer-ref-label">સત્તાવાર સરકારી સંદર્ભ પોર્ટલ:</span>{' '}
          <a
            href="https://ic.gujarat.gov.in/industrial-policy.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-gov-link"
            title="ઉદ્યોગ કમિશનરશ્રીની કચેરી - ઔદ્યોગિક નીતિ પોર્ટલ (ic.gujarat.gov.in)"
          >
            <span>Industries Commissionerate · Industrial Policy (ic.gujarat.gov.in)</span>
            <ExternalLink size={13} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
