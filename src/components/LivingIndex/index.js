import React, {useState} from 'react';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import sections, {startHint} from '@site/src/data/sections';
import Glimpse from './Glimpse';
import ItemLink, {itemMeta} from './ItemLink';

// Home page "specimen wall": one card per section, each with a live glimpse.
function SpecimenCard({section}) {
  const [all, setAll] = useState(false);
  const shown = all ? section.items : section.items.slice(0, 3);
  return (
    <section className={`li-spec li-c-${section.id}`}>
      <div className="li-spec-top">
        <span className="li-verb">{section.verb}</span>
        <span className="li-count">{section.items.length} pages</span>
      </div>
      <h2 className="li-spec-name">{section.name}</h2>
      <p className="li-promise">{section.promise}</p>
      <div className="li-glimpse"><Glimpse section={section} /></div>
      <ul className="li-inside">
        {shown.map((item) => (
          <li key={item.title}>
            <ItemLink item={item} className="li-row">
              <span className="li-it">{item.title}</span>
              <span className="li-im">{itemMeta(item)}</span>
            </ItemLink>
          </li>
        ))}
      </ul>
      <div className="li-spec-foot">
        {section.items.length > 3 && (
          <button type="button" onClick={() => setAll(!all)} aria-expanded={all}>
            {all ? 'Show fewer' : `All ${section.items.length} ${section.name.toLowerCase()}`}
          </button>
        )}
      </div>
    </section>
  );
}

export default function LivingIndex() {
  const {withBaseUrl} = useBaseUrlUtils();
  // Tells the broken-link checker that /#living-index exists, for the chips on every page.
  useBrokenLinks().collectAnchor('living-index');
  return (
    <div className="li-root" id="living-index">
      {startHint && (
        <p className="li-hint">
          {startHint.text} <a href={withBaseUrl(startHint.href)}>{startHint.title}</a> {startHint.tail}
        </p>
      )}
      <div className="li-wall">
        {sections.map((s) => <SpecimenCard key={s.id} section={s} />)}
      </div>
    </div>
  );
}
