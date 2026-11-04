# Portfolio v6, public version

Plain HTML, CSS and JS. No framework, no build step.

## Deploy to GitHub Pages

Repo: `amir-sohel-builds.github.io` (already created, public).

Upload the **contents** of this folder to the root of that repo, so `index.html`
sits at the top level next to `styles.css`, `script.js`, `resume.pdf` and the
`posts` folder. The site goes live at https://amir-sohel-builds.github.io
a few minutes after the commit.

## Files

- `index.html`, the whole site: Overview, Work, Skills, Notes, Contact tabs
- `styles.css`, palette is defined as custom properties at the top
- `script.js`, theme toggle (saved, falls back to system), tabs with hash deep
  links and arrow key support, and the stat counters
- `posts/`, the Notes posts, plus `template.html` for new ones
- `favicon.svg`, the A. monogram tile, site icon and nav mark
- `resume.pdf`, the resume linked from the nav and the Contact tab

## Add a note

1. Copy `posts/template.html`, rename it, fill in the TODO spots.
2. Add a card for it in the Notes tab of `index.html`.
3. Upload both files.
