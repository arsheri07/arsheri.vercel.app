# Changelog

Live at https://arsheri.vercel.app (Vercel deploys every push to `main`).

## 2026-11-26
- **Visual refresh.** Hero Authentication-Results block styled as a terminal window with an ambient glow and gradient headline; new stats strip (5 projects, 248 tests across own repos, 1st place, top 1%) with count-up; numbered section labels; projects as rounded cards with a per-track accent bar (security green, full-stack blue); pill chips and buttons; experience as a timeline (current roles filled); credentials as cards; contact as a call-to-action card. Subtle dot-grid background. Light and dark both checked.
- **Canary:** 61 tests (was 47), "Decoy files" chip, write-up paragraph on decoys and `--on-alert`, and a new decoy-file demo.
- **Phishing Risk Analyzer:** 118 tests (was 101), "Attachment analysis" chip, write-up paragraph on display-name impersonation and risky attachments; the email demo gains `fake_display_name` and `double_extension` toggles and shows the attachment.
- **KitchenSense:** 26 tests (was 19), write-up paragraph on per-food shelf life and the by-aisle shopping list, `node:test` chip.
- Fixed: the selected project filter was white-on-white in dark mode.
- Fixed: Ctrl/Cmd+K now opens quick jump (the README already said it did).
- Admitted to the Cybersecurity minor: replaced "hoping to add" wording in the intro, meta descriptions, summary card and Education list with "Cybersecurity minor (in progress)".

## 2026-11-25
- **Lead Router (new, first in Selected work):** 1st place, Texas A&M × Salesforce Challenge. Lead scoring/routing (50,000 leads in 0.64 s), React manager dashboard, Claude (Haiku) Ask box with rule-based fallback, 496 tests. Team repo is private, so the card shows "team repo · private" instead of a link.
- Award added to Certifications & honors; project counts updated from four to five (summary card and Selected work label).
- README project table: Lead Router row.
- Technical skills: Security now leads with the project techniques (SPF/DKIM/DMARC, secret scanning, file integrity monitoring, SHA-256/HMAC, Shannon entropy), then cryptography, web exploitation, binary analysis, network forensics and reverse engineering (kept: Akshith has used them a good amount). Added React and GitHub Actions; moved Linux out of Languages.

## 2026-11-20
- **Canary:** HMAC-SHA256 signed baselines and tamper-proof `.canaryignore`; 47 tests (was 36); new HMAC-SHA256 stack chip.
- **KitchenSense:** restriction-safe ingredient swaps and "ready with swaps" ranking; 19 unit tests.
- **Phishing Risk Analyzer:** IDN homograph and deceptive-link detection, the email-parser bug story, session case log; 101 tests (was 84); new "IDN homographs" chip; call transcripts added to the summary line.
- **Interactive email demo:** new `homograph` toggle shows a Cyrillic `о` posing as `o` while SPF, DKIM and DMARC all pass.
- Section anchor renamed `#scam-shield` to `#phishing-risk-analyzer` (skills map links updated).
