## Tutorcat conventions (read before designing)

Tutorcat is a directory of tutors and university counselors for Gulf families. Calm, editorial, forest green on warm off-white; DM Sans for text, Manrope for headings.

### Setup
- Wrap everything in `<I18nProvider>`. Every component reads its copy from it (`useI18n`); outside it they throw. It also handles Arabic: `?lang=ar` or the header's عربي toggle switches the page to Arabic and right-to-left.
- Light is the default. Dark mode is the `dark` class on any container (or `<html>`); all tokens flip under it, so give that container `background: var(--background); color: var(--foreground)`.

```jsx
const { I18nProvider, SiteHeader, SpecialistCard, profiles } = window.Tutorcat;
const tones = ["sage", "peach", "lavender"];
<I18nProvider>
  <SiteHeader savedCount={0} onShortlist={() => {}} onJoin={() => {}} />
  <section className="shell catalogue">
    <div className="section-head"><div>
      <p className="eyebrow">Good people. The right support.</p>
      <h2>Meet your next great match</h2>
    </div></div>
    <div className="specialist-grid">
      {profiles.map((p, i) => (
        <SpecialistCard key={p.id} profile={p} tone={tones[i % 3]} saved={false} onToggleSave={() => {}} onOpen={() => {}} />
      ))}
    </div>
  </section>
</I18nProvider>
```

### Styling idiom: the site's own classes + CSS variables
- No utility-class system to lean on (only the utilities the site itself uses are compiled). Lay out with inline styles or these classes, and colour with the tokens.
- Tokens: `--background`, `--foreground`, `--card`, `--primary` (forest green; light green in dark), `--primary-foreground`, `--secondary` (pale green), `--muted`, `--muted-foreground`, `--border`, `--destructive`, card covers `--sage` / `--peach` / `--lavender`, `--logo`, `--cat`, `--shadow-soft`, `--shadow-dialog`, `--backdrop`; fonts `--font-body`, `--font-heading`, `--font-arabic`.
- Layout classes: `shell` (1184px centred container), `eyebrow` (small uppercase green label above a heading), `section-head`, `section-title`, `specialist-grid` (3-column card grid), `profile-cover` + `sage`/`peach`/`lavender`, `dialog-panel` (the white dialog box), `logo` / `footer-logo` (logo sizes).
- Shape: 8px cards and dialogs, 5-6px inputs and buttons, pill-shaped filter chips; soft shadows only (`--shadow-soft`).

### Content rules (strict)
- Tutor data comes only from `profiles` (the real tutors). Never invent tutors, ratings, reviews, permits, prices or stats. `RatingSummary` and `PermitBadge` show only verified data; today no tutor has reviews or a permit, so they show the empty state or nothing.
- Card colour (`tone`) cycles sage, peach, lavender in profile order.
- Forms (`RequestForm`, `JoinForm`, `ReviewForm`) produce an English email draft via `onDraft`; show it with `DraftReady`. There is no contact inbox yet, so never claim a request was "sent".

### The cat
- `CatPeek` (head) + `CatPaws` peek over the top edge of a box: put both and the box in a `position: relative` wrapper, give the box `position: relative; z-index: 1`, and leave about 50px of space above it.
- `CatSprite` is the pixel cat running in place (126×72); move it with your own transform and flip it with `transform: scaleX(-1)`. `LoadingBuffer open` is the full-screen loading skeleton with the cat running.

### Where the truth lives
`styles.css` (it imports `_ds_bundle.css`, the site's compiled stylesheet with every token and class above), plus each component's `.d.ts` (props) and `.prompt.md` (usage).
