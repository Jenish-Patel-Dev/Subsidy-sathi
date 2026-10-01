import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="desktop-footer">
      <div className="wrap" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <ShieldAlert size={20} style={{ color: 'var(--mute)', flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
        <div>
          આ સાધન ત્રણ GR ના લખાણ પર આધારિત સૂચક અંદાજ આપે છે. અંતિમ પાત્રતા અને રકમ Asset Verification, PEC/FEC અને મંજૂરી સત્તાધિકારીના નિર્ણય મુજબ રહેશે. અર્થઘટનમાં મતભેદ હોય તો MSME માટે SLEC અને લાર્જ એકમો માટે para 12(c) ની સમિતિનો નિર્ણય આખરી ગણાય.
        </div>
      </div>
    </footer>
  );
}
