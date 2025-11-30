import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fecdd3" /> {/* rose-200 */}
        <stop offset="100%" stopColor="#f43f5e" /> {/* rose-500 */}
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="128" fill="url(#logoGradient)" />
    <path
      fill="#ffffff"
      d="M256 420.4l-26.6-24.2C134.9 309.4 72 252.4 72 182.2 72 125.2 116.8 80 174.2 80c32.3 0 63.4 15.1 81.8 38.8C274.4 95.1 305.5 80 337.8 80 395.2 80 440 125.2 440 182.2c0 70.2-62.9 127.2-157.4 214L256 420.4z"
    />
  </svg>
);