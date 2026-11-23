# Changelog

All notable changes to the FrostBanner widget. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.5.0] - 2026-11-23

### Added
- Global Privacy Control: when the browser sends the GPC signal, "Accept all" leaves Marketing off; the visitor can still switch it on in the preferences (`respectGpc: false` turns this off).
- `consentVersion`: raise it to ask every visitor again (for example after a cookie policy change).
- Google Consent Mode options in the inline config: `consentMode.waitForUpdate`, `adsDataRedaction`, `urlPassthrough`, `region`.
- Google Tag Manager mode: with `gtm: true` in the inline config FrostBanner sends no Consent Mode commands of its own and leaves them to the GTM template; banner, blocking, log and events work as usual.
- The consent log record includes the banner language (`lang`), a fingerprint of the texts shown (`text_hash`), `consent_version` and, with Global Privacy Control, `gpc`.
- When a visitor withdraws a category whose scripts already ran on the page, the page reloads so they stop (`reloadOnWithdraw: false` turns this off; event `reload`). Not in editor previews; `configure({ container: null })` leaves preview mode.
- Blocked scripts and iframes added after page load (single-page apps, lazy-loaded content) are handled.
- `FrostBanner.languages` lists the built-in languages.
- `FrostBanner.getStatus()` (`'pending'`, `'shown'`, `'decided'`) and `FrostBanner.getSource()` (source of the applied choice, as in the `change` event, or `null`) for integrations such as the GTM template.
- `package.json` with `npm run build`; `test/release-check.html`, a browser check of the built widget.

### Changed
- Blocked scripts run in page order after consent: an inline script waits for the external scripts above it (at most 15 seconds).
- Keyboard: in the centred window Tab stays inside the banner; after a choice the focus moves to the floating button; Escape leaves the preferences.
- Centred window: the page behind is made inert while it is open, so a mouse click cannot move the focus out of it either (elements the site made inert itself stay inert; not in editor previews).
- Custom category texts are merged per category instead of replacing all of them.
- Blocked inline scripts wait for the external scripts above them (at most 15 seconds); in 0.4.x everything started at once. Mark independent tags `async`.
- `consentMode.region` writes a console warning listing the EU/EEA/UK/CH countries that are not in the list.
- The bundle is about 60 KB minified (about 23 KB compressed), up from about 55 KB. Built with terser 5.51.4.
- Documentation: the README documents the whole JavaScript API, the Consent Mode options and the build; its screenshots are WebP and much lighter.

### Fixed
- The stored choice now expires after `maxAgeDays` also when it is read from local storage.
- An invalid `maxAgeDays`, `texts` or `container` value no longer breaks the banner.
- Placeholders of iframes that are moved, replaced or removed are kept in sync.
- The script queue no longer stops on scripts the browser never loads (`nomodule`, non-JavaScript types).
- With Global Privacy Control, "Accept all" no longer switches off Marketing that the visitor had turned on.
- Integration options set on the page (`reloadOnWithdraw`, `respectGpc`, `consentVersion`, `consentMode`) are kept when dashboard settings arrive, unless the dashboard sends its own value.
- A choice made before FrostBanner has started (preferences opened from the page while it loads) keeps the visitor's consent ID and stays in force if it fits the final settings; otherwise it is withdrawn — announced by a `change` event with `source: 'withdrawn'` — and the banner asks again (if its scripts already ran, the page reloads right after that event, without showing the banner first). Preferences opened before the start stay open and keep the switches the visitor changed.

### Security
- Configuration values that end up in the banner's HTML and CSS (accent colour, category keys, policy link) are validated more strictly. Category keys: a letter, then letters, digits, `_` or `-`, at most 32 characters (`socialMedia`, `ads2`, `my-cat` keep working); other keys are ignored with a console warning.
- Policy links and embed addresses accept only `http(s)` and relative URLs.
- A category counts as accepted only when the visitor accepted it: category names that match built-in JavaScript object properties are no longer treated as accepted.

## [0.4.2] - 2026-11-04

### Changed
- On sites that use the WordPress plugin the "Powered by FrostBanner" credit is plain text.

## [0.4.1] - 2026-11-01

### Added
- Banner texts in 29 languages.

### Changed
- The "Powered by" label links to frostbanner.com (`nofollow`) and sits inside the button bar.
- The default banner text lists only the active categories.

## [0.4.0] - 2026-10-22

### Added
- First public release of the widget source: 14 styles, script and iframe blocking, Google Consent Mode v2, consent log.
