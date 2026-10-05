---
title: Export a privilege log
description: Build a privilege log from documents tagged privileged and export it for service on opposing counsel.
owner: discovery-squad
audience: [internal, client]
areas: [privilege, production]
status: current
last_reviewed: 2026-06-30
review_every: 90
sidebar_position: 30
---

# Export a privilege log

A privilege log lists each document withheld or redacted on privilege grounds. Under Federal Rule of Civil Procedure 26(b)(5)(A), the log must describe each withheld item well enough for the other side to assess the claim. After this page you can export a log from Quillon that is ready for attorney review.

## Before you start

You need the **Matter admin** role.

Every document on the log needs a **Privilege type** and a **Privilege description**. Reviewers set both on the document's **Coding** panel.

## Steps

1. Open the matter and go to **Productions**.
2. Select the production, then **Privilege log**.
3. Choose the columns. The default set:

    | Column | Source |
    |---|---|
    | Bates or control number | Assigned at production. Withheld documents get a control number. |
    | Date | Document date from metadata. |
    | Author | From metadata or the email **From** field. |
    | Recipients and CC | From the email **To** and **CC** fields. |
    | Privilege type | Attorney-client, work product, or both. |
    | Description | The reviewer's **Privilege description**. |
    | Withheld or redacted | Set by Quillon from the production. |

4. Select **Check log**. Quillon lists documents missing a privilege type or description.
5. Fix each listed document, or select **Export anyway** to export with blanks marked.
6. Choose **XLSX** or **CSV** and select **Export**.

## Limits

- Email families log one row per document. Parents and attachments appear on separate rows, linked by family ID.
- Quillon exports the descriptions reviewers wrote. An attorney reviews the log before service.
