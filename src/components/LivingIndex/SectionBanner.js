import React from 'react';
import usePageItem from './usePageItem';

// Colored band at the top of a doc page that belongs to a section.
export default function SectionBanner() {
  const match = usePageItem();
  if (!match) return null;
  const {section, item} = match;
  return (
    <div className={`li-banner li-c-${section.id}`}>
      <span className="li-sw" aria-hidden="true" />
      <b>{section.name}</b>
      <span className="li-bm">{item.how} · {item.min} min</span>
    </div>
  );
}
