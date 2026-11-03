# Security notes

- No keys, wallets, or signing.
- Pure bigint arithmetic; demo does not call market APIs.
- Do not treat `value` as a guaranteed redeemable claim against a real asset without a separate legal and on-chain design.
- Prefer WharfKit if a host app later adds intentional chain actions.
