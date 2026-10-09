import React from 'react';
import { ExternalLink, Mail } from 'lucide-react';

export default function Footer({ onSelectTab, hasStickyBar }) {
  return (
    <footer className={`app-footer ${hasStickyBar ? 'has-sticky-bar' : ''}`}>
      <div className="wrap">
        <div className="footer-content">
          <p className="footer-disclaimer-text">
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
          </p>
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

          {/* Single-Line Compact Designer & Developer Credits */}
          <div className="footer-credits-line">
            <span>Designed &amp; Developed by <strong>Naresh Khambhaliya &amp; Jenish Khambhaliya</strong></span>
            <span className="footer-credits-sep" aria-hidden="true">·</span>
            <span className="footer-credits-contact">
              Contact:{' '}
              <a href="mailto:jgpatel8080@gmail.com" className="footer-credits-email" title="Email Naresh Khambhaliya &amp; Jenish Khambhaliya">
                <Mail size={12} aria-hidden="true" />
                <span>jgpatel8080@gmail.com</span>
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
