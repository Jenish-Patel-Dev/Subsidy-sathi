import { Calculator, Percent, Layers, MapPin, FileCheck } from 'lucide-react';

export const NAV_ITEMS = [
  {
    id: 'check',
    label: 'મારી પાત્રતા',
    icon: Calculator,
    hash: '#check',
    panelId: 'p-check',
  },
  {
    id: 'rates',
    label: 'સહાયના દર',
    icon: Percent,
    hash: '#rates',
    panelId: 'p-rates',
  },
  {
    id: 'other',
    label: 'અન્ય સહાય',
    icon: Layers,
    hash: '#other',
    panelId: 'p-other',
  },
  {
    id: 'taluka',
    label: 'તાલુકા શ્રેણી',
    icon: MapPin,
    hash: '#taluka',
    panelId: 'p-taluka',
  },
  {
    id: 'rules',
    label: 'નિયમો અને શરતો',
    icon: FileCheck,
    hash: '#rules',
    panelId: 'p-rules',
  },
];
