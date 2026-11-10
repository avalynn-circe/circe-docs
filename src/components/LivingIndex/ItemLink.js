import React from 'react';
import Link from '@docusaurus/Link';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';

// Renders an item as a doc link, a static-file link, or plain text when planned.
export default function ItemLink({item, className, children}) {
  const {withBaseUrl} = useBaseUrlUtils();
  if (item.planned) {
    return <span className={`${className} li-planned`} aria-disabled="true">{children}</span>;
  }
  if (item.href) {
    return <a className={className} href={withBaseUrl(item.href)}>{children}</a>;
  }
  return <Link className={className} to={item.to}>{children}</Link>;
}

export function itemMeta(item) {
  return item.planned ? 'soon' : `${item.how} · ${item.min} min`;
}
