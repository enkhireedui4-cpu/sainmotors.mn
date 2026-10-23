"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

interface BrandSectionNavProps {
  items: { id: string; label: string }[];
  label: string;
  phone: { href: string; display: string };
  phoneLabel: string;
}

/** Native section links first; scroll tracking only adds the active indicator. */
export function BrandSectionNav({ items, label, phone, phoneLabel }: BrandSectionNavProps) {
  const nav = useRef<HTMLElement>(null);
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    let frame = 0;
    const sections = items.map(item => document.getElementById(item.id)).filter((section): section is HTMLElement => section !== null);
    const update = () => {
      frame = 0;
      const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0;
      const threshold = headerHeight + (nav.current?.getBoundingClientRect().height ?? 0) + 40;
      let current = items[0]?.id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= threshold) current = section.id;
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items]);

  return <nav ref={nav} className="brand-section-nav" aria-label={label}>
    <div className="container brand-section-nav__inner">
      <div className="brand-section-nav__links">
        {items.map(item => <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined} onClick={() => setActive(item.id)}>{item.label}</a>)}
      </div>
      <a className="brand-section-nav__phone" href={phone.href} aria-label={`${phoneLabel}: ${phone.display}`}>
        <Icon name="phone" size={18} /><span>{phone.display}</span>
      </a>
    </div>
  </nav>;
}
