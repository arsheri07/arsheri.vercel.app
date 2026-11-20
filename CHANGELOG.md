# Changelog

Live at https://arsheri.vercel.app (Vercel deploys every push to `main`).

## 2026-11-20
- **Canary:** HMAC-SHA256 signed baselines and tamper-proof `.canaryignore`; 47 tests (was 36); new HMAC-SHA256 stack chip.
- **KitchenSense:** restriction-safe ingredient swaps and "ready with swaps" ranking; 19 unit tests.
- **Phishing Risk Analyzer:** IDN homograph and deceptive-link detection, the email-parser bug story, session case log; 101 tests (was 84); new "IDN homographs" chip; call transcripts added to the summary line.
- **Interactive email demo:** new `homograph` toggle shows a Cyrillic `о` posing as `o` while SPF, DKIM and DMARC all pass.
- Section anchor renamed `#scam-shield` to `#phishing-risk-analyzer` (skills map links updated).
