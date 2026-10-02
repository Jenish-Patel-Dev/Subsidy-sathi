import React from 'react';
import { ShieldAlert, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="desktop-footer">
      <div className="wrap" style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <ShieldAlert size={20} style={{ color: 'var(--mute)', flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            આ સાધન ત્રણ GR ના લખાણ પર આધારિત સૂચક અંદાજ આપે છે. અંતિમ પાત્રતા અને રકમ Asset Verification, PEC/FEC અને મંજૂરી સત્તાધિકારીના નિર્ણય મુજબ રહેશે. અર્થઘટનમાં મતભેદ હોય તો MSME માટે SLEC અને લાર્જ એકમો માટે para 12(c) ની સમિતિનો નિર્ણય આખરી ગણાય.
          </div>
          <div className="footer-official-ref">
            <span style={{ color: 'var(--mute)' }}>સત્તાવાર સરકારી સંદર્ભ પોર્ટલ:</span>{' '}
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
      </div>
    </footer>
  );
}
