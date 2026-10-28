# Before and after

Eight pairs from the standard, one per rule. Each is the example circe-mcp ships with the rule and tests against: `check_text` flags the before and passes the after. The first pair shows the em dash as `[em dash]`, because this package contains none.

## CES-P-001 No em dashes (error)

```text
Before: The release shipped on time [em dash] a rare occurrence.
After:  The release shipped on time, a rare occurrence.
```

Why: valid punctuation that has become a tell by frequency. A comma, a colon, or a new sentence does the same work. `fix_text` applies the comma.

## CES-C-008 No trailing contrast clauses (error)

```text
Before: The server tells the user that this server can't help, instead of calling the tool and reporting a failure.
After:  The server tells the user that this server can't help.
```

Why: the clause after the comma restates what the sentence established, or implies the reader held the lesser view. End at the positive point. Keep the contrast when the alternative is a fact the reader needs.

## CES-V-007 No punchy flourishes, inferior baseline form (error)

```text
Before: A template that doesn't fall apart on real projects.
After:  A template tested on the Xerxes portal and two client sites.
```

Why: `real` implies an unstated lesser kind of project. Name what the template was tested on and the contrast disappears.

## CES-C-001 No negate-then-elevate (warning)

```text
Before: We don't write documentation. We design experiences.
After:  We design documentation that users reference daily.
```

Why: the construction dismisses a familiar idea to substitute a bigger one, and the bigger one is vaguer than the thing dismissed. State the positive claim with specific content.

## CES-Q-002 No hollow intensifiers (warning)

```text
Before: I am genuinely excited about this role.
After:  I am excited about this role.
```

Why: the intensifier adds no information and anticipates doubt. If the sentence reads weak without it, the claim is the problem. `fix_text` deletes it.

## CES-C-003 No throat-clearing runways (warning)

```text
Before: Prior experience backs this up: I built reporting dashboards at Lacek.
After:  I built reporting dashboards at Lacek.
```

Why: the opening clause announces content without carrying any. Open with the content.

## CES-V-001 No resume cliches (warning, optional rule)

```text
Before: Proven track record of delivering impactful outcomes.
After:  Shipped the Xerxes conference portal; reduced an 8-person workflow to 1 dispatcher.
```

Why: the phrase claims competence in the abstract. Replace it with the track record. This is the rule to turn on for resumes and cover letters.

## CES-V-006 No chatty asides (warning)

```text
Before: Let's dive in. The config file has three sections.
After:  The config file has three sections.
```

Why: the aside establishes the writer's presence at the cost of the reader's time. Start with the content.
