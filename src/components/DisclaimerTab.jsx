import React from 'react';
import { useDisclaimer } from '../context/DisclaimerContext.jsx';
import { ShieldAlert, CheckCircle2, FileText, ExternalLink, RefreshCw } from 'lucide-react';

export default function DisclaimerTab({ hidden }) {
  const {
    isAccepted,
    formattedAuditDate,
    appVersion,
    isStandalone,
    openReviewModal,
  } = useDisclaimer();

  if (hidden) return null;

  return (
    <section id="p-disc" data-panel="disc" aria-label="અસ્વીકરણ અને શરતો">
      <div className="sec-header-wrap">
        <h2 className="sec-h">અસ્વીકરણ (Disclaimer) &amp; શરતો</h2>
        <p className="sec-p">
          છેલ્લે સુધારેલ: 05.10.2026 (v{appVersion}) · નીચેના ત્રણ સત્તાવાર GR પર આધારિત: MSME સહાય GR (25.09.2026),
          Large/Mega/Ultra Mega GR, તાલુકા વર્ગીકરણ GR (08.09.2026).
        </p>
      </div>

      {/* Disclaimer Status Bar */}
      <div className="disclaimer-status-bar">
        <div className="disclaimer-status-left">
          <span className="disclaimer-status-badge">
            <CheckCircle2 size={16} aria-hidden="true" />
            <span>શરતો અને અસ્વીકરણ સ્વીકારેલ છે</span>
          </span>
        </div>

        <button
          type="button"
          className="disclaimer-reopen-btn"
          onClick={openReviewModal}
        >
          <FileText size={15} aria-hidden="true" />
          <span>નિયમો અને અસ્વીકરણ પૉપઅપમાં વાંચો</span>
        </button>
      </div>

      {/* Two-Column Side-by-Side Legal Text */}
      <div className="grid2" style={{ marginTop: '20px' }}>
        {/* Gujarati Card */}
        <section className="panel disc">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-700)' }}>
            <ShieldAlert size={20} aria-hidden="true" />
            <span>ગુજરાતી (સત્તાવાર માર્ગદર્શિકા)</span>
          </h3>
          <dl className="defs">
            <div>
              <dt>૧. સરકારી એપ નથી</dt>
              <dd>
                સબસિડી સાથી એક ખાનગી, માહિતીલક્ષી સાધન છે. તે ગુજરાત સરકાર, ઉદ્યોગ અને ખાણ વિભાગ,
                ઉદ્યોગ કમિશનરેટ, MSME કમિશનરેટ, જિલ્લા ઉદ્યોગ કેન્દ્ર (DIC) કે અન્ય કોઈ સરકારી કચેરી
                દ્વારા બનાવાયેલું, મંજૂર કરાયેલું કે તેમની સાથે જોડાયેલું નથી.
              </dd>
            </div>
            <div>
              <dt>૨. ફક્ત અંદાજ</dt>
              <dd>
                અહીં બતાવેલી પાત્રતા, યોજના અને સહાયની રકમ તમે ભરેલી વિગતો પરથી ગણાયેલો <b>સૂચક અંદાજ</b> છે.
                તે મંજૂરી, ખાતરી, Provisional કે Final Eligibility Certificate નથી. વાસ્તવિક સહાય
                Asset Verification, PEC/FEC, બજેટ ઉપલબ્ધતા અને મંજૂરી સત્તાધિકારીના નિર્ણય પર આધાર રાખે છે.
              </dd>
            </div>
            <div>
              <dt>૩. સત્તાવાર GR સર્વોપરી</dt>
              <dd>
                માહિતી ઉપર જણાવેલ GR ના લખાણ પરથી તૈયાર કરી છે. GR માં સુધારા, સ્પષ્ટીકરણ, માર્ગદર્શિકા કે
                નવા ઠરાવ આવી શકે. આ એપ અને સત્તાવાર GR વચ્ચે કોઈ તફાવત જણાય તો <b>સત્તાવાર GR અને સરકારનું અર્થઘટન જ માન્ય</b> ગણાશે.
                અર્થઘટનમાં મતભેદ માટે MSME માં SLEC અને લાર્જ એકમોમાં para 12(c) ની સમિતિનો નિર્ણય આખરી છે.
              </dd>
            </div>
            <div>
              <dt>૪. ગણતરીની ધારણાઓ</dt>
              <dd>
                ગણતરી સરળ કરવા કેટલીક ધારણાઓ લીધી છે: લોનની મુદ્દલ સમાન હપ્તે ચૂકવાય છે; વાર્ષિક મર્યાદા
                નડે ત્યારે પહેલા કેપિટલ, પછી વ્યાજ, પછી પાવર ગણાય છે; EPF વળતર ઘટક 1-2-3 ની કુલ મર્યાદાથી
                અલગ બતાવ્યું છે; બિલ્ડિંગની SOR મર્યાદા, ટેક્નોલોજીની ૧૦% મર્યાદા અને DG સેટની મર્યાદા જેવી
                વિગતો લાગુ કરી નથી. વાસ્તવિક રકમ આનાથી અલગ આવી શકે.
              </dd>
            </div>
            <div>
              <dt>૫. કાનૂની કે નાણાકીય સલાહ નથી</dt>
              <dd>
                આ એપ કાનૂની, કર, નાણાકીય કે રોકાણ સલાહ નથી. રોકાણ, લોન કે અરજી અંગેનો નિર્ણય લેતાં પહેલાં
                તમારા ચાર્ટર્ડ એકાઉન્ટન્ટ, સલાહકાર અથવા સંબંધિત જિલ્લા ઉદ્યોગ કેન્દ્ર / કમિશનરેટ પાસેથી ખાતરી કરો.
              </dd>
            </div>
            <div>
              <dt>૬. જવાબદારી</dt>
              <dd>
                માહિતી સાચી રાખવાનો પૂરો પ્રયાસ કર્યો છે, છતાં તેની સંપૂર્ણતા કે ચોકસાઈની કોઈ ખાતરી નથી.
                આ એપના ઉપયોગ કે તેની માહિતી પર આધાર રાખીને લીધેલા કોઈ પણ નિર્ણય, અરજીમાં વિલંબ, અસ્વીકાર
                કે નુકસાન માટે બનાવનાર જવાબદાર રહેશે નહીં. અરજીની સમયમર્યાદા ચૂકી જવાથી સહાય ઘટી કે રદ થઈ શકે છે.
              </dd>
            </div>
            <div>
              <dt>૭. તમારી માહિતી</dt>
              <dd>
                તમે ભરેલી વિગતો ફક્ત તમારા બ્રાઉઝરમાં ગણતરી માટે વપરાય છે. તે ક્યાંય સર્વર પર મોકલાતી કે સંગ્રહાતી નથી.
              </dd>
            </div>
            <div>
              <dt>૮. ભૂલ જણાય તો</dt>
              <dd>
                કોઈ આંકડો કે નિયમ GR થી અલગ જણાય તો કૃપા કરીને જાણ કરો, જેથી સુધારી શકાય.
              </dd>
            </div>
          </dl>
        </section>

        {/* English Card */}
        <section className="panel disc">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-700)' }}>
            <ShieldAlert size={20} aria-hidden="true" />
            <span>English (Legal Reference)</span>
          </h3>
          <dl className="defs">
            <div>
              <dt>1. Not a government app</dt>
              <dd>
                Subsidy Sathi is a private, informational tool. It is not made, endorsed or approved by,
                or affiliated with, the Government of Gujarat, the Industries &amp; Mines Department,
                the Industries Commissionerate, the MSME Commissionerate, any District Industries Centre
                (DIC) or any other government office.
              </dd>
            </div>
            <div>
              <dt>2. Estimates only</dt>
              <dd>
                Eligibility, scheme and subsidy amounts shown here are <b>indicative estimates</b> based on
                the details you enter. They are not a sanction, a guarantee, or a Provisional or Final
                Eligibility Certificate. Actual assistance depends on asset verification, PEC/FEC, budget
                availability and the decision of the sanctioning authority.
              </dd>
            </div>
            <div>
              <dt>3. Official GRs prevail</dt>
              <dd>
                The content is prepared from the text of the GRs listed above. Where this app differs from
                an official GR, <b>the official GR and the Government's interpretation prevail</b>. Disputes on
                interpretation are decided by the SLEC (MSME) or the committee under para 12(c) (Large units).
              </dd>
            </div>
            <div>
              <dt>4. Calculation assumptions</dt>
              <dd>
                The calculator simplifies: equal principal repayment of the term loan; when an annual ceiling
                applies, capital is counted first, then interest, then power; EPF reimbursement is shown outside
                the combined ceiling of components 1-3; limits such as the R&amp;B SOR cap on buildings, the 10%
                cap on technology cost and DG-set limits are not applied. Actual amounts may differ.
              </dd>
            </div>
            <div>
              <dt>5. Not legal or financial advice</dt>
              <dd>
                This app is not legal, tax, financial or investment advice. Confirm with your chartered
                accountant, consultant or the concerned DIC / Commissionerate before making investment, loan
                or application decisions.
              </dd>
            </div>
            <div>
              <dt>6. Liability</dt>
              <dd>
                Every effort has been made to keep the information accurate, but no warranty is given as to
                its completeness or accuracy. The maker is not liable for any decision, delayed or rejected
                application, or loss arising from use of or reliance on this app. Missing an application
                deadline can reduce or forfeit assistance, so verify all dates officially.
              </dd>
            </div>
            <div>
              <dt>7. Your data</dt>
              <dd>
                Details you enter are used only for calculation inside your browser. They are not sent or stored anywhere.
              </dd>
            </div>
            <div>
              <dt>8. Reporting errors</dt>
              <dd>
                If any figure or rule differs from the GR, please report it so it can be verified and corrected.
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <div className="footer-official-ref" style={{ marginTop: '24px' }}>
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
    </section>
  );
}
