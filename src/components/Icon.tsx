import type { SVGProps } from "react";

const paths = {
  chevronRight: <path d="M9 5l7 7-7 7" />,
  chevronLeft: <path d="M15 5l-7 7 7 7" />,
  arrowLeft: <path d="M20 12H4m6-6-6 6 6 6" />,
  arrowRight: <path d="M4 12h16m-6-6 6 6-6 6" />,
  arrowUpRight: <path d="M7 17L17 7M9 7h8v8" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  pause: <path d="M9 6v12M15 6v12" />,
  play: <path d="M8 5.5v13l10.5-6.5L8 5.5z" />,
  phone: (
    <path d="M6.6 3.6l2.5-.4 1.6 4-1.9 1.5a11 11 0 005.5 5.5l1.5-1.9 4 1.6-.4 2.5a2 2 0 01-2 1.7A15.6 15.6 0 014.9 5.6a2 2 0 011.7-2z" />
  ),
  mail: <path d="M3.5 6.5h17v11h-17zM4 7l8 6 8-6" />,
  directions: <path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0113 0c0 4.8-6.5 11-6.5 11zM12 12.3a2.3 2.3 0 100-4.6 2.3 2.3 0 000 4.6z" />,
} as const;

export type IconName = keyof typeof paths | "facebook" | "instagram" | "youtube";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

/** Inline stroke icons; decorative by default (aria-hidden). */
export function Icon({ name, size = 20, ...rest }: IconProps) {
  if (name === "facebook" || name === "instagram" || name === "youtube") {
    return <BrandIcon name={name} size={size} {...rest} />;
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}

function BrandIcon({ name, size, ...rest }: { name: "facebook" | "instagram" | "youtube"; size: number }) {
  const d = {
    facebook:
      "M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z",
    instagram:
      "M12 7.4a4.6 4.6 0 100 9.2 4.6 4.6 0 000-9.2zm0 7.6a3 3 0 110-6 3 3 0 010 6zm5.9-7.8a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0zM12 4.6c2.4 0 2.7 0 3.6.1 2.4.1 3.6 1.3 3.7 3.7.1.9.1 1.2.1 3.6s0 2.7-.1 3.6c-.1 2.4-1.3 3.6-3.7 3.7-.9.1-1.2.1-3.6.1s-2.7 0-3.6-.1c-2.4-.1-3.6-1.3-3.7-3.7-.1-.9-.1-1.2-.1-3.6s0-2.7.1-3.6C4.8 6 6 4.8 8.4 4.7c.9-.1 1.2-.1 3.6-.1zM12 3c-2.4 0-2.8 0-3.7.1-3.3.1-5.1 2-5.2 5.2C3 9.2 3 9.6 3 12s0 2.8.1 3.7c.1 3.3 2 5.1 5.2 5.2.9.1 1.3.1 3.7.1s2.8 0 3.7-.1c3.3-.1 5.1-2 5.2-5.2.1-.9.1-1.3.1-3.7s0-2.8-.1-3.7c-.1-3.3-2-5.1-5.2-5.2C14.8 3 14.4 3 12 3z",
    youtube:
      "M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.4A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.8 1.8C5.7 19 12 19 12 19s6.3 0 7.8-.4a2.5 2.5 0 001.8-1.8A26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15V9l5.2 3L10 15z",
  }[name];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...rest}>
      <path d={d} />
    </svg>
  );
}
