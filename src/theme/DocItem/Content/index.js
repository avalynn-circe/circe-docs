// Wraps the stock doc content (same as `npm run swizzle @docusaurus/theme-classic DocItem/Content -- --wrap`).
// Adds the section banner above and the wander block below. Both render nothing
// on pages that are not listed in src/data/sections.js.
import React from 'react';
import Content from '@theme-original/DocItem/Content';
import SectionBanner from '@site/src/components/LivingIndex/SectionBanner';
import Wander from '@site/src/components/LivingIndex/Wander';

export default function ContentWrapper(props) {
  return (
    <>
      <SectionBanner />
      <Content {...props} />
      <Wander />
    </>
  );
}
