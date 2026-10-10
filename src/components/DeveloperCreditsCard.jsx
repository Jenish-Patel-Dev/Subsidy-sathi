import React from 'react';
import { Mail } from 'lucide-react';

export default function DeveloperCreditsCard() {
  return (
    <div className="disclaimer-credits-card">
      <div className="disclaimer-credits-header">
        <span className="disclaimer-credits-dash" aria-hidden="true"></span>
        <span className="disclaimer-credits-eyebrow">DESIGNED &amp; DEVELOPED BY</span>
        <span className="disclaimer-credits-dash" aria-hidden="true"></span>
      </div>
      <div className="disclaimer-credits-names">
        Naresh Khambhaliya &amp; Jenish Khambhaliya
      </div>
      <div className="disclaimer-credits-contact">
        <span className="disclaimer-credits-contact-lbl">Contact:</span>{' '}
        <a
          href="mailto:jgpatel8080@gmail.com"
          className="disclaimer-credits-email"
          title="Email Naresh Khambhaliya &amp; Jenish Khambhaliya"
        >
          <Mail size={14} aria-hidden="true" />
          <span>jgpatel8080@gmail.com</span>
        </a>
      </div>
    </div>
  );
}
