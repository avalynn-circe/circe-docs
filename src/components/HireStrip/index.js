import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

// Home page strip for recruiters and hiring managers: who Avalynn is, what she
// is open to, how to reach her, and the best sample for each kind of role.
// Edit the two lists below; nothing else needs to change.

const contacts = [
  {label: 'Email', href: 'mailto:avalynn.circe@gmail.com'},
  {label: 'LinkedIn', href: 'https://www.linkedin.com/in/avalynn/'},
  {label: 'Portfolio', href: 'https://avalynncirce.com/portfolio/'},
];

// "to" is a doc route or a pathname:// link to a static file, without baseUrl.
const starts = [
  {role: 'Technical writing', title: 'DITA manual', to: '/dita-pressure-washer'},
  {role: 'Instructional design', title: 'Saving Lake Wren', to: 'pathname:///lessons/lake-wren.html'},
  {role: 'UX writing', title: 'Ovenbird screens', to: '/ux-writing'},
  {role: 'Conversational AI', title: 'Chatbot post-mortem', to: '/chat-analyses/post-mortem'},
  {role: 'AI and developer docs', title: 'MCP tutorial review', to: '/mcp-tutorial-review'},
  {role: 'Business analysis', title: 'Fleet leads report', to: '/chat-analyses/fleet-leads-report'},
];

export default function HireStrip() {
  return (
    <section className={styles.strip} aria-labelledby="hire-strip-title">
      <div className={styles.about}>
        <p className={styles.eyebrow}>Open to remote contract and part-time work</p>
        <h2 id="hire-strip-title" className={styles.name}>Avalynn Circe</h2>
        <p className={styles.roles}>
          Technical writing, instructional design, UX writing, conversational AI,
          business analysis and front-end development. Based in St. Paul, Minnesota.
        </p>
        <p className={styles.creds}>
          <span>PSM I</span>
          <span>ECBA</span>
          <span>
            Author of <a href="https://leanpub.com/jsparts">JavaScript: The Parts</a>
          </span>
        </p>
        <p className={styles.contacts}>
          {contacts.map((c) => (
            <a key={c.label} className={styles.contact} href={c.href}>{c.label}</a>
          ))}
        </p>
      </div>
      <div className={styles.starts}>
        <p className={styles.startsTitle}>Hiring for one role? Start with its best sample.</p>
        <ul className={styles.startList}>
          {starts.map((s) => (
            <li key={s.role}>
              <Link className={styles.start} to={s.to}>
                <span className={styles.role}>{s.role}</span>
                <span className={styles.sample}>{s.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
