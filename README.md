# arsheri.vercel.app

Personal portfolio of **Akshithreddy Sheri**, Computer Science at Texas A&M, focused on cybersecurity and software engineering.

**Live:** [arsheri.vercel.app](https://arsheri.vercel.app)

The design borrows from an email `Authentication-Results` header: every claim on the page is presented as a check that passes, and every link goes to the source.

## Projects featured

| Project | What it is |
|---|---|
| [Credential Leak Scanner](https://github.com/arsheri07/credential-leak-scanner) | CLI that finds leaked API keys and passwords in code and git history |
| [KitchenSense](https://github.com/arsheri07/kitchen-sense) | Full-stack app that turns fridge photos into a PostgreSQL inventory |
| [Canary](https://github.com/arsheri07/canary) | File integrity monitor that detects ransomware through entropy |
| [Phishing Risk Analyzer](https://github.com/arsheri07/phishing-risk-analyzer) | Flask app that scores scam risk with real SPF/DKIM/DMARC checks ([live demo](https://phishing-risk-analyzer-suk0.onrender.com)) |

## Interactive demos

Each project has a small in-browser demo that runs the real idea, not a screenshot:

- **Credential Leak Scanner:** paste or "leak" a key into a config file and watch the same regex + entropy rules flag it (placeholders are ignored)
- **Canary:** measure the Shannon entropy of text, then "encrypt" it and watch entropy jump toward 8 bits/byte
- **Phishing Risk Analyzer:** toggle SPF, DKIM, DMARC and a lookalike domain to see the risk score respond
- **KitchenSense:** toggle allergies and preferences; restrictions remove recipes, preferences reorder them

Also: dark mode, a command palette (`/` or Ctrl/Cmd+K), project filters, and a skill-to-project map.

## Stack

One static `index.html` with inline CSS and vanilla JavaScript, plus `images/`. No framework, no build step, no tracking. Fonts: IBM Plex Mono and IBM Plex Sans.

## Deploy

Hosted on Vercel and connected to this repo: every push to `main` deploys to [arsheri.vercel.app](https://arsheri.vercel.app).
