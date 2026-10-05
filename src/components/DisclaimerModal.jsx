import React, { useState, useEffect } from 'react';
import { useDisclaimer } from '../context/DisclaimerContext.jsx';
import { ShieldAlert, CheckCircle2, AlertTriangle, X, ExternalLink, FileText, Check } from 'lucide-react';

export default function DisclaimerModal() {
  const {
    isModalOpen,
    isReviewMode,
    isUpdatedTerms,
    appVersion,
    isStandalone,
    acceptDisclaimer,
    closeReviewModal,
  } = useDisclaimer();

  const [hasAgreed, setHasAgreed] = useState(false);
  const [activeLang, setActiveLang] = useState('gu'); // 'gu' | 'en'

  // Reset agreement checkbox when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setHasAgreed(false);
    }
  }, [isModalOpen]);

  // Handle ESC key (Only enabled during review mode)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isReviewMode && isModalOpen) {
        closeReviewModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReviewMode, isModalOpen, closeReviewModal]);

  if (!isModalOpen) return null;

  return (
    <div
      className="disclaimer-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && isReviewMode) {
          closeReviewModal();
        }
      }}
    >
      <div className="disclaimer-modal-dialog">
        {/* Modal Header */}
        <div className="disclaimer-modal-header">
          <div className="disclaimer-modal-header-icon">
            <ShieldAlert size={28} aria-hidden="true" />
          </div>
          <div className="disclaimer-modal-header-text">
            <div className="disclaimer-modal-header-top">
              <span className="disclaimer-badge">
                {isStandalone ? 'PWA એપ્લિકેશન સંમતિ' : 'વેબસાઇટ સત્ર સંમતિ'} · v{appVersion}
              </span>
              {isUpdatedTerms && (
                <span className="disclaimer-updated-badge">
                  <AlertTriangle size={12} aria-hidden="true" />
                  <span>અપડેટ થયેલ શરતો</span>
                </span>
              )}
            </div>
            <h2 id="disclaimer-modal-title" className="disclaimer-modal-title">
              નિયમો, શરતો અને અસ્વીકરણ
            </h2>
            <p className="disclaimer-modal-subtitle">
              Terms & Conditions and Legal Disclaimer
            </p>
          </div>
          {isReviewMode && (
            <button
              type="button"
              className="disclaimer-modal-close-icon-btn"
              onClick={closeReviewModal}
              aria-label="બંધ કરો"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Language Switcher Tabs */}
        <div className="disclaimer-lang-switcher" role="tablist" aria-label="ભાષા પસંદ કરો">
          <button
            type="button"
            role="tab"
            aria-selected={activeLang === 'gu'}
            className={`disclaimer-lang-btn ${activeLang === 'gu' ? 'active' : ''}`}
            onClick={() => setActiveLang('gu')}
          >
            ગુજરાતી (મુખ્ય)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeLang === 'en'}
            className={`disclaimer-lang-btn ${activeLang === 'en' ? 'active' : ''}`}
            onClick={() => setActiveLang('en')}
          >
            English (Reference)
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="disclaimer-modal-body">
          {activeLang === 'gu' ? (
            <div className="disclaimer-terms-list">
              <div className="disclaimer-term-item">
                <span className="disclaimer-term-num">૧</span>
                <div>
                  <h4>સરકારી એપ નથી (Not a government app)</h4>
                  <p>
                    સબસિડી સાથી એક ખાનગી, માહિતીલક્ષી સાધન છે. તે ગુજરાત સરકાર, ઉદ્યોગ અને ખાણ વિભાગ,
                    ઉદ્યોગ કમિશનરેટ, MSME કમિશનરેટ, જિલ્લા ઉદ્યોગ કેન્દ્ર (DIC) કે અન્ય કોઈ સરકારી કચેરી
                    દ્વારા બનાવાયેલું, મંજૂર કરાયેલું કે તેમની સાથે જોડાયેલું નથી.
                  </p>
                </div>
              </div>

              <div className="disclaimer-term-item">
                <span className="disclaimer-term-num">૨</span>
                <div>
                  <h4>ફક્ત અંદાજ (Estimates only)</h4>
                  <p>
                    અહીં બતાવેલી પાત્રતા, યોજના અને સહાયની રકમ તમે ભરેલી વિગતો પરથી ગણાયેલો <b>સૂચક અંદાજ</b> છે.
                    તે મંજૂરી, ખાતરી, Provisional કે Final Eligibility Certificate નથી. વાસ્તવિક સહાય
                    Asset Verification, PEC/FEC, બજેટ ઉપલબ્ધતા અને મંજૂરી સત્તાધિકારીના નિર્ણય પર આધાર રાખે છે.
                  </p>
                </div>
              </div>

              <div className="disclaimer-term-item">
                <span className="disclaimer-term-num">૩</span>
                <div>
                  <h4>સત્તાવાર GR સર્વોપરી (Official GRs prevail)</h4>
                  <p>
                    માહિતી સત્તાવાર સરકારી ઠરાવો (GRs) ના લખાણ પરથી તૈયાર કરી છે. આ એપ અને સત્તાવાર GR વચ્ચે
                    કોઈ તફાવત જણાય તો <b>સત્તાવાર GR અને સરકારનું અર્થઘટન જ માન્ય</b> ગણાશે. અર્થઘટનમાં મતભેદ
                    માટે MSME માં SLEC અને લાર્જ એકમોમાં para 12(c) ની સમિતિનો નિર્ણય આખરી છે.
                  </p>
                </div>
              </div>

              <div className="disclaimer-term-item">
                <span className="disclaimer-term-num">૪</span>
                <div>
                  <h4>ગણતરીની ધારણાઓ (Calculation assumptions)</h4>
                  <p>
                    ગણતરી સરળ કરવા કેટલીક ધારણાઓ લીધી છે: લોનની મુદ્દલ સમાન હપ્તે ચૂકવાય છે; વાર્ષિક મર્યાદા
                    નડે ત્યારે પહેલા કેપિટલ, પછી વ્યાજ, પછી પાવર ગણાય છે; EPF વળતર ઘટક 1-2-3 ની કુલ મર્યાદાથી અલગ
                    બતાવ્યું છે; બિલ્ડિંગની SOR મર્યાદા અને ટેક્નોલોજીની ૧૦% મર્યાદા જેવી વિગતો લાગુ કરી નથી.
                  </p>
                </div>
              </div>

              <div className="disclaimer-term-item">
                <span className="disclaimer-term-num">૫</span>
                <div>
                  <h4>કાનૂની કે નાણાકીય સલાહ નથી (Not legal or financial advice)</h4>
                  <p>
                    આ એપ કાનૂની, કર, નાણાકીય કે રોકાણ સલાહ નથી. રોકાણ, લોન કે અરજી અંગેનો નિર્ણય લેતાં
                    પહેલાં તમારા ચાર્ટર્ડ એકાઉન્ટન્ટ, સલાહકાર અથવા સંબંધિત જિલ્લા ઉદ્યોગ કેન્દ્ર / કમિશનરેટ
                    પાસેથી ખાતરી કરો.
                  </p>
                </div>
              </div>

              <div className="disclaimer-term-item">
                <span className="disclaimer-term-num">૬</span>
                <div>
                  <h4>જવાબદારી (Liability)</h4>
                  <p>
                    માહિતી સાચી રાખવાનો પૂરો પ્રયાસ કર્યો છે, છતાં તેની સંપૂર્ણતા કે ચોકસાઈની કોઈ ખાતરી નથી.
                    આ એપના ઉપયોગ કે તેની માહિતી પર આધાર રાખીને લીધેલા કોઈ પણ નિર્ણય, અરજીમાં વિલંબ, અસ્વીકાર
                    કે નુકસાન માટે બનાવનાર જવાબદાર રહેશે નહીં.
                  </p>
                </div>
              </div>

              <div className="disclaimer-term-item">
                <span className="disclaimer-term-num">૭</span>
                <div>
                  <h4>તમારી માહિતી (Your data)</h4>
                  <p>
                    તમે ભરેલી વિગતો ફક્ત તમારા બ્રાઉઝરમાં ગણતરી માટે વપરાય છે. તે ક્યાંય સર્વર પર મોકલાતી કે
                    સંગ્રહાતી નથી.
                  </p>
                </div>
              </div>

              <div className="disclaimer-term-item">
                <span className="disclaimer-term-num">૮</span>
                <div>
                  <h4>ભૂલ જણાય તો (Reporting errors)</h4>
                  <p>
                    કોઈ આંકડો કે નિયમ સરકારી GR થી અલગ જણાય તો કૃપા કરીને જાણ કરો, જેથી સુધારી શકાય.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="disclaimer-terms-list">
              <div className="disclaimer-term-item">
                <span className="disclaimer-term-num">1</span>
                <div>
                  <h4>Not a government app</h4>
                  <p>
                    Subsidy Sathi is a private, informational tool. It is not made, endorsed or approved by,
                    or affiliated with, the Government of Gujarat, the Industries &amp; Mines Department,
                    the Industries Commissionerate, the MSME Commissionerate, any District Industries Centre
                    (DIC) or any other government office.
                  </p>
                </div>
              </div>

              <div className="disclaimer-term-item">
                <span className="disclaimer-term-num">2</span>
                <div>
                  <h4>Estimates only</h4>
                  <p>
                    Eligibility, scheme and subsidy amounts shown here are <b>indicative estimates</b> based on
                    the details you enter. They are not a sanction, a guarantee, or a Provisional or Final
                    Eligibility Certificate. Actual assistance depends on asset verification, PEC/FEC, budget
                    availability and the decision of the sanctioning authority.
                  </p>
                </div>
              </div>

              <div className="disclaimer-term-item">
                <span className="disclaimer-term-num">3</span>
                <div>
                  <h4>Official GRs prevail</h4>
                  <p>
                    The content is prepared from the text of the official Government Resolutions. Where this app
                    differs from an official GR, <b>the official GR and the Government's interpretation prevail</b>.
                    Disputes on interpretation are decided by the SLEC (MSME) or the committee under para 12(c) (Large units).
                  </p>
                </div>
              </div>

              <div className="disclaimer-term-item">
                <span className="disclaimer-term-num">4</span>
                <div>
                  <h4>Calculation assumptions</h4>
                  <p>
                    The calculator simplifies: equal principal repayment of the term loan; when an annual ceiling
                    applies, capital is counted first, then interest, then power; EPF reimbursement is shown outside
                    the combined ceiling of components 1-3. Actual sanction may differ.
                  </p>
                </div>
              </div>

              <div className="disclaimer-term-item">
                <span className="disclaimer-term-num">5</span>
                <div>
                  <h4>Not legal or financial advice</h4>
                  <p>
                    This app is not legal, tax, financial or investment advice. Confirm with your chartered
                    accountant, consultant or the concerned DIC / Commissionerate before making investment, loan
                    or application decisions.
                  </p>
                </div>
              </div>

              <div className="disclaimer-term-item">
                <span className="disclaimer-term-num">6</span>
                <div>
                  <h4>Liability</h4>
                  <p>
                    Every effort has been made to keep the information accurate, but no warranty is given as to its
                    completeness or accuracy. The maker is not liable for any decision, delayed or rejected application,
                    or loss arising from use of or reliance on this app.
                  </p>
                </div>
              </div>

              <div className="disclaimer-term-item">
                <span className="disclaimer-term-num">7</span>
                <div>
                  <h4>Your data</h4>
                  <p>
                    Details you enter are used only for calculation inside your browser. They are not sent to or stored
                    on any remote server.
                  </p>
                </div>
              </div>

              <div className="disclaimer-term-item">
                <span className="disclaimer-term-num">8</span>
                <div>
                  <h4>Reporting errors</h4>
                  <p>
                    If any figure or rule differs from the GR, please report it so it can be verified and corrected.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="disclaimer-official-link-box">
            <span style={{ fontWeight: 600 }}>સત્તાવાર સરકારી સંદર્ભ પોર્ટલ:</span>{' '}
            <a
              href="https://ic.gujarat.gov.in/industrial-policy.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="disclaimer-gov-portal-link"
            >
              <span>ic.gujarat.gov.in/industrial-policy.aspx</span>
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="disclaimer-modal-footer">
          {isReviewMode ? (
            <div className="disclaimer-footer-review-actions">
              <button
                type="button"
                className="disclaimer-btn-primary"
                onClick={closeReviewModal}
              >
                <span>સમજાયું / બંધ કરો (Understood &amp; Close)</span>
              </button>
            </div>
          ) : (
            <div className="disclaimer-footer-gate-actions">
              <label className="disclaimer-consent-checkbox-label">
                <input
                  type="checkbox"
                  className="disclaimer-consent-checkbox"
                  checked={hasAgreed}
                  onChange={(e) => setHasAgreed(e.target.checked)}
                />
                <span className="disclaimer-consent-text">
                  મેં નિયમો, શરતો અને અસ્વીકરણ (Terms &amp; Conditions and Disclaimer) સંપૂર્ણ વાંચ્યા છે,
                  સમજ્યા છે અને હું સંમત છું.
                </span>
              </label>

              <button
                type="button"
                className="disclaimer-btn-primary"
                disabled={!hasAgreed}
                onClick={acceptDisclaimer}
              >
                <Check size={18} aria-hidden="true" />
                <span>સ્વીકારો અને આગળ વધો (Accept &amp; Continue)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
