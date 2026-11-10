import {useLocation} from '@docusaurus/router';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import sections from '@site/src/data/sections';

const trim = (p) => (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p);

// Finds which section item the current doc page belongs to, or null.
export default function usePageItem() {
  const {pathname} = useLocation();
  const {withBaseUrl} = useBaseUrlUtils();
  const here = trim(pathname);
  for (const section of sections) {
    for (const item of section.items) {
      if (!item.to) continue;
      const target = withBaseUrl(item.to);
      const exact = trim(target) === here;
      const nested = item.to.endsWith('/') && here.startsWith(trim(target));
      if (exact || nested) return {section, item};
    }
  }
  return null;
}
