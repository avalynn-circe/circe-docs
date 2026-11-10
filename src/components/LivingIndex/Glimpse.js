import React, {useState} from 'react';

// Each section shows a working slice of its own medium.

function LakeGlimpse() {
  const [n, setN] = useState(3);
  const take = n * 5;
  const regrow = 15;
  let width = 100;
  let msg;
  if (take <= regrow) {
    msg = <><b>The lake holds.</b> Five households take {take}; it regrows {regrow}.</>;
  } else {
    const seasons = Math.max(1, Math.ceil(40 / (take - regrow)));
    width = Math.max(6, 100 - (take - regrow) * 4);
    msg = <><b>Empty in {seasons} season{seasons > 1 ? 's' : ''}.</b> Who stops first? That is the lesson.</>;
  }
  return (
    <>
      <div className="li-lake-q">Five households, one lake. How many fish does each take a season?</div>
      <div className="li-lake-row">
        <input type="range" min="1" max="8" value={n} onChange={(e) => setN(+e.target.value)} aria-label="Fish per household" />
        <span className="li-lake-n">{n} each</span>
      </div>
      <div className="li-lake" aria-hidden="true"><i style={{width: `${width}%`}} /></div>
      <div className="li-lake-out">{msg}</div>
    </>
  );
}

function ChatGlimpse({g}) {
  return (
    <>
      <div className="li-bub li-bub--u">{g.user}</div>
      <div className="li-bub li-bub--b"><mark>{g.bot}</mark></div>
      <div className="li-note">{g.note}</div>
    </>
  );
}

function QuoteGlimpse({g}) {
  return (
    <>
      <p className="li-quote">{g.quote}<sup>1</sup></p>
      <div className="li-cite">1. {g.cite}</div>
    </>
  );
}

function HazardGlimpse() {
  return (
    <>
      <div className="li-haz">
        <div className="li-haz-h">WARNING</div>
        <div className="li-haz-b">High-pressure spray can pierce skin. Never point the wand at people or animals.</div>
      </div>
      <div className="li-reuse"><span>written once</span><span>electric manual</span><span>gas manual</span></div>
    </>
  );
}

export default function Glimpse({section}) {
  switch (section.id) {
    case 'i': return <LakeGlimpse />;
    case 'c': return <ChatGlimpse g={section.glimpse} />;
    case 'w': return <QuoteGlimpse g={section.glimpse} />;
    default: return <HazardGlimpse />;
  }
}
