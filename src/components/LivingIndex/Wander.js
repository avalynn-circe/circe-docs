import React from 'react';
import Link from '@docusaurus/Link';
import sections from '@site/src/data/sections';
import usePageItem from './usePageItem';
import ItemLink, {itemMeta} from './ItemLink';

// End of a doc page: more from the same section in no order, plus the other sections.
export default function Wander() {
  const match = usePageItem();
  if (!match) return null;
  const {section, item} = match;
  // Items that share a group (the blog posts) show only their own group here.
  const siblings = section.items.filter((x) => x !== item && (!item.group || x.group === item.group));
  const others = sections.filter((s) => s !== section);
  return (
    <aside className={`li-wander li-c-${section.id}`} aria-label={`More ${section.name.toLowerCase()}`}>
      <h3>More {section.name.toLowerCase()}{item.group ? `: ${item.group}` : ''}</h3>
      <div className="li-sibs">
        {siblings.map((x) => (
          <ItemLink key={x.title} item={x} className="li-sib">
            <span className="li-it">{x.title}</span>
            <span className="li-im">{itemMeta(x)}</span>
          </ItemLink>
        ))}
      </div>
      <div className="li-others">
        {others.map((o) => (
          <Link key={o.id} className={`li-other li-c-${o.id}`} to="/#living-index">
            <span className="li-ov">{o.verb}</span>{o.name}
          </Link>
        ))}
      </div>
    </aside>
  );
}
