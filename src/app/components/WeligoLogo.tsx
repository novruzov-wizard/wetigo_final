interface WetigoLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
}

export function WetigoLogo({ size = 'md', variant = 'full' }: WetigoLogoProps) {
  const scales = { sm: 0.6, md: 1, lg: 1.4 };
  const s = scales[size];
  const w = variant === 'icon' ? 48 * s : 160 * s;
  const h = 48 * s;

  if (variant === 'icon') {
    return (
      <svg width={w} height={h} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="20" cy="24" rx="18" ry="16" fill="white" />
        <ellipse cx="34" cy="20" rx="12" ry="10" fill="white" />
        <circle cx="18" cy="8" r="3" fill="white" />
        <circle cx="26" cy="5" r="2" fill="white" />
        <circle cx="42" cy="28" r="3" fill="white" />
        <text x="10" y="28" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="13" fill="#6200FF" letterSpacing="-0.5">WTG</text>
      </svg>
    );
  }

  return (
    <svg width={w} height={h} viewBox="0 0 160 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Blob shape */}
      <path d="M8 28 C2 28 2 14 10 12 C12 4 22 2 28 8 C32 4 42 4 44 12 C50 10 58 16 54 24 C58 28 56 38 48 38 C46 44 36 46 30 40 C26 46 14 46 10 40 C4 40 2 34 8 28Z" fill="white" />
      <circle cx="28" cy="3" r="3" fill="white" />
      <circle cx="36" cy="1" r="2" fill="white" />
      <circle cx="54" cy="34" r="3" fill="white" />
      {/* WETIGO text */}
      <text x="10" y="30" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="16" fill="#6200FF" letterSpacing="-0.3">WETIGO</text>
    </svg>
  );
}
