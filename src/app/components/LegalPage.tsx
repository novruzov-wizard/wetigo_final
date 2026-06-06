import { ArrowLeft, Shield, FileText } from 'lucide-react';
import { useStore } from '../store';

interface LegalPageProps { section: 'privacy' | 'terms'; onBack: () => void; }

export function LegalPage({ section, onBack }: LegalPageProps) {
  const { t } = useStore();
  const updated = 'June 5, 2026';

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-[#2b2521] mb-5">
        <ArrowLeft size={20} /> {t('legal.back')}
      </button>

      <div className="flex items-center gap-3 mb-2">
        <span className="w-11 h-11 rounded-2xl bg-[#f1ebff] flex items-center justify-center text-[#6200FF]">
          {section === 'privacy' ? <Shield size={22} /> : <FileText size={22} />}
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold text-[#2b2521]">{section === 'privacy' ? t('legal.privacy') : t('legal.terms')}</h1>
          <p className="text-xs text-slate-400">{t('legal.updated')}: {updated}</p>
        </div>
      </div>

      <div className="prose prose-slate max-w-none mt-6 space-y-5 text-[15px] leading-relaxed text-slate-700">
        {section === 'privacy' ? <Privacy /> : <Terms />}
      </div>

      <div className="mt-10 rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
        {t('legal.contact')} <a href="mailto:wetigo.online@gmail.com" className="text-[#6200FF] font-semibold">wetigo.online@gmail.com</a>
      </div>
    </div>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-lg font-bold text-[#2b2521] mt-6 mb-1.5">{children}</h2>;
}

function Privacy() {
  return (
    <>
      <p>This Privacy Policy explains how Wetigo (“Wetigo”, “we”, “our” or “us”) collects, uses, shares and protects personal data when you use the Wetigo website and progressive web application at wetigo.online and related services (the “Service”). Wetigo is the data controller for the personal data described here. We are committed to protecting your privacy and we never sell your personal data.</p>

      <H>1. Information we collect</H>
      <ul className="list-disc pl-5 space-y-1">
        <li><b>Account information</b> you provide when registering: name, email address, password (kept only as a one-way cryptographic hash — we never store it in readable form), and optionally a profile photo, date of birth and country.</li>
        <li><b>Content you create</b>: reviews, ratings, photos, places you submit, replies and favourites.</li>
        <li><b>Usage and device data</b>: basic technical information such as browser type, approximate device information and interactions needed to operate and secure the Service.</li>
        <li><b>Optional permissions</b>: with your consent, your approximate location (to show places near you) and a push-notification subscription (to deliver notifications to your device).</li>
      </ul>

      <H>2. How we use your data</H>
      <ul className="list-disc pl-5 space-y-1">
        <li>To create, operate and secure your account and authenticate you.</li>
        <li>To provide core features: discovering places, publishing your reviews, favourites and activity.</li>
        <li>To send essential service messages (such as email verification and security codes).</li>
        <li>To send optional notifications (email and/or push) about your places, reviews, replies and activity — only where you have enabled them.</li>
        <li>To detect, prevent and address fraud, abuse, spam and violations of our Terms.</li>
        <li>To comply with legal obligations and enforce our agreements.</li>
      </ul>

      <H>3. Legal bases for processing</H>
      <p>Where applicable law (such as the GDPR) requires it, we process personal data on the following legal bases: performance of our contract with you (to provide the Service); your consent (for optional location and notifications, which you may withdraw at any time); our legitimate interests (to keep the Service safe, functional and improved); and compliance with legal obligations.</p>

      <H>4. Sharing your data</H>
      <p>We do not sell your personal data. We share it only: (a) with vetted third-party service providers who process data strictly on our behalf and under contract to operate the Service (for example, infrastructure, secure storage and email delivery); (b) where required by law, legal process, or to protect the rights, safety and security of Wetigo, our users or the public; and (c) in connection with a business transfer (such as a merger or acquisition), subject to this Policy. Reviews, ratings, photos and place information you post are, by their nature, publicly visible within the Service.</p>

      <H>5. International transfers</H>
      <p>Your data may be processed in countries other than your own. Where we transfer personal data internationally, we use appropriate safeguards consistent with applicable data-protection law.</p>

      <H>6. Cookies & local storage</H>
      <p>We use only the cookies and local browser storage necessary to keep you signed in and remember your preferences (such as language and country). We do not use them to sell your data.</p>

      <H>7. Data retention</H>
      <p>We keep your personal data for as long as your account is active or as needed to provide the Service, then delete or anonymise it unless a longer retention period is required by law. You can delete your account and associated personal data at any time from Settings.</p>

      <H>8. Security</H>
      <p>We apply technical and organisational measures to protect your data, including encryption of traffic over HTTPS, hashing of passwords, and restricted, role-based access. No method of transmission or storage is completely secure, but we work to protect your information and review our practices regularly.</p>

      <H>9. Your rights</H>
      <p>Depending on your location, you may have the right to access, correct, export, restrict or delete your personal data, to object to certain processing, and to withdraw consent for optional processing (e.g. notifications or location). You also have the right to lodge a complaint with your local data-protection authority. To exercise any of these rights, contact us using the details below.</p>

      <H>10. Children</H>
      <p>The Service is not directed to children under 13 (or the higher minimum age required in your country). We do not knowingly collect personal data from children below that age; if you believe a child has provided us data, contact us and we will delete it.</p>

      <H>11. Changes to this Policy</H>
      <p>We may update this Policy from time to time and will revise the “last updated” date above. Material changes will be communicated within the Service or by email where appropriate. Continued use after an update constitutes acceptance of the revised Policy.</p>
    </>
  );
}

function Terms() {
  return (
    <>
      <p>These Terms of Service (“Terms”) form a binding agreement between you and Wetigo and govern your access to and use of the Wetigo website, progressive web application at wetigo.online and related services (the “Service”). By creating an account or using the Service, you agree to these Terms and to our Privacy Policy. If you do not agree, do not use the Service.</p>

      <H>1. Eligibility & account</H>
      <p>You must be at least 13 years old (or the higher minimum age required in your country) and able to form a binding contract. You agree to provide accurate information, keep your credentials confidential, and accept responsibility for all activity under your account. Notify us immediately of any unauthorised use.</p>

      <H>2. Acceptable use</H>
      <ul className="list-disc pl-5 space-y-1">
        <li>Do not post content that is false, misleading, unlawful, defamatory, hateful, harassing, obscene or that infringes others’ rights.</li>
        <li>Do not submit fake, incentivised or manipulated reviews or ratings, or spam.</li>
        <li>Do not impersonate others or misrepresent your affiliation with a place or business.</li>
        <li>Do not attempt to disrupt, overload, reverse-engineer, scrape, or gain unauthorised access to the Service or its systems.</li>
        <li>Only upload places, photos and content you own or have the right to share.</li>
      </ul>

      <H>3. User content & licence</H>
      <p>You retain ownership of the reviews, photos, place information and other content you submit (“User Content”). You grant Wetigo a worldwide, non-exclusive, royalty-free licence to host, store, reproduce, display and distribute your User Content for the purpose of operating, promoting and improving the Service. You are solely responsible for your User Content and represent that you have the rights to share it.</p>

      <H>4. Reviews & moderation</H>
      <p>Reviews must reflect genuine, first-hand experiences. We may review, hide, remove or refuse content and may suspend, temporarily block, place under review (quarantine) or terminate accounts that violate these Terms or that post repeated inappropriate content, in accordance with our moderation process. Repeated violations may lead to escalating restrictions.</p>

      <H>5. Business listings & ownership claims</H>
      <p>Business owners may claim and manage a listing. Submissions and ownership claims are reviewed before approval, and submitting false information or fraudulent claims may result in removal and account action. Optional paid promotion or subscription features, where offered, are subject to the terms and pricing presented at purchase.</p>

      <H>6. Intellectual property</H>
      <p>The Service, including its name, logo, design and software, is owned by Wetigo and protected by intellectual-property laws. These Terms grant you a limited, revocable, non-transferable licence to use the Service for its intended purpose; no other rights are granted.</p>

      <H>7. Disclaimers</H>
      <p>The Service and all content are provided on an “as is” and “as available” basis without warranties of any kind, express or implied, to the maximum extent permitted by law. Place information and user reviews may be incomplete, outdated or inaccurate, and do not constitute endorsements by Wetigo.</p>

      <H>8. Limitation of liability</H>
      <p>To the maximum extent permitted by law, Wetigo and its operators shall not be liable for any indirect, incidental, special, consequential or punitive damages, or for any loss of data, profits or goodwill, arising from your use of or inability to use the Service.</p>

      <H>9. Termination</H>
      <p>You may stop using the Service and delete your account at any time. We may suspend or terminate access if you breach these Terms or to protect the Service and its users. Provisions that by their nature should survive termination will continue to apply.</p>

      <H>10. Changes to the Service & Terms</H>
      <p>We may modify or discontinue features at any time. We may also update these Terms and will revise the “last updated” date above; material changes will be communicated within the Service or by email where appropriate. Continued use after an update constitutes acceptance of the revised Terms.</p>

      <H>11. Contact</H>
      <p>Questions about these Terms can be sent to us using the contact details below.</p>
    </>
  );
}
