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
      <p>Wetigo (“we”, “our”, “us”) operates the website and progressive web app at wetigo.online — a platform to discover places, read and write reviews, and save favourites. This Privacy Policy explains what data we collect, why, and your choices. We are committed to protecting your privacy and never sell your personal data.</p>

      <H>Information we collect</H>
      <ul className="list-disc pl-5 space-y-1">
        <li><b>Account data</b> you provide: name, email address, password (stored only as a secure hash), and optionally a profile photo, birth date and country.</li>
        <li><b>Content you create</b>: reviews, ratings, photos you upload, places you submit, and favourites.</li>
        <li><b>Technical data</b>: basic device/browser info and, only if you grant permission, your approximate location (to show nearby places) and push-notification subscription.</li>
      </ul>

      <H>How we use your data</H>
      <ul className="list-disc pl-5 space-y-1">
        <li>To create and secure your account and authenticate you.</li>
        <li>To show relevant places, your reviews, favourites and activity.</li>
        <li>To send service emails (verification codes, and — only if you opt in — notifications about your places, reviews and replies).</li>
        <li>To prevent abuse, spam and fraud, and to comply with the law.</li>
      </ul>

      <H>Email & notifications</H>
      <p>We send verification codes during sign-up. Optional notification emails and web-push notifications are sent only after you turn them on, and you can turn them off at any time from your profile settings.</p>

      <H>Third-party services</H>
      <p>We use trusted processors strictly to operate the service: hosting (Render, Cloudflare), database (Neon/PostgreSQL), transactional email (Brevo), and place data from open sources such as OpenStreetMap. These providers process data only on our behalf.</p>

      <H>Data retention & security</H>
      <p>We keep your data while your account is active. Passwords are hashed, traffic is served over HTTPS, and access is restricted. You can request deletion of your account and associated personal data at any time.</p>

      <H>Your rights</H>
      <p>You may access, correct, export or delete your personal data, and withdraw consent for optional processing (e.g. notifications or location). To exercise these rights, contact us at the email below.</p>

      <H>Children</H>
      <p>Wetigo is not directed to children under 13 (or the minimum age in your country). We do not knowingly collect their data.</p>

      <H>Changes</H>
      <p>We may update this policy and will revise the “last updated” date above. Material changes will be communicated in-app or by email.</p>
    </>
  );
}

function Terms() {
  return (
    <>
      <p>These Terms of Service govern your use of Wetigo at wetigo.online. By creating an account or using the service, you agree to these terms.</p>

      <H>Your account</H>
      <p>You must provide accurate information and keep your password secure. You are responsible for activity under your account. You must be old enough to form a binding contract in your country.</p>

      <H>Acceptable use</H>
      <ul className="list-disc pl-5 space-y-1">
        <li>Don’t post false, misleading, illegal, hateful or infringing content.</li>
        <li>Don’t submit fake reviews, spam, or attempt to manipulate ratings.</li>
        <li>Don’t attempt to disrupt, reverse-engineer, or gain unauthorised access to the service.</li>
        <li>Only submit places and photos you have the right to share.</li>
      </ul>

      <H>Your content</H>
      <p>You keep ownership of the reviews, photos and place information you submit. You grant Wetigo a non-exclusive licence to host and display that content within the service. You’re responsible for what you post, and we may remove content that violates these terms.</p>

      <H>Reviews & moderation</H>
      <p>Reviews must reflect genuine experiences. We may hide or remove reported content and suspend accounts that abuse the platform.</p>

      <H>Place ownership claims</H>
      <p>Business owners may claim and manage their listing. Claims are reviewed before approval; submitting false ownership claims may result in removal and account action.</p>

      <H>Service availability</H>
      <p>We work to keep Wetigo reliable, but the service is provided “as is” without warranties. We are not liable for indirect or incidental damages to the extent permitted by law. Place information from third-party sources may be incomplete or inaccurate.</p>

      <H>Termination</H>
      <p>You may stop using Wetigo and delete your account at any time. We may suspend or terminate accounts that breach these terms.</p>

      <H>Changes</H>
      <p>We may update these terms and will revise the “last updated” date above. Continued use after changes means you accept the updated terms.</p>
    </>
  );
}
