# Niks Designer Portfolio

A static website (HTML, CSS, JavaScript). No build step, no server, no database.

## Preview on your computer
Double-click `index.html`. Fonts load from Google Fonts, so the typefaces need internet; everything else works offline.

## Publish it online (free)
**Netlify Drop (easiest):** go to app.netlify.com/drop, sign in, drag the whole `niks-designer-portfolio` folder onto the page. You get a live link, and you can connect your own domain later.
**GitHub Pages:** create a repository, upload everything in this folder (`index.html` at the top level), then Settings, Pages, branch `main`, folder `/ (root)`.
**Cloudflare Pages or Vercel** also work: upload the folder, no build command.

## How the site is organised
- Every project belongs to exactly one category (`category` in `js/projects-data.js`): `social-media`, `banners` (currently empty, so hidden), `visiting-cards`, `posters`, `logos`, `packaging`, `invitations`, `brochures`, `other`. A category with no work is hidden automatically (Invitation Card Designs is hidden for now).
- Visiting Card Designs shows every card on its own scene. All other categories show one card per project.
- The slider at the top shows only `social-media` projects (up to 2 designs each).

## What to edit
| What | Where |
|---|---|
| Project details: brand, overview, objective, concept, process, typography, software | `js/projects-data.js` |
| Move a project to another category | change its `category` in `js/projects-data.js` |
| About text, services, contact details | `index.html` |
| Slide speed | `SLIDE_MS` at the top of `js/main.js` |
| Hide the dashed placeholder boxes | `SHOW_PLACEHOLDERS = false` at the top of `js/main.js` |
| Themes (6) | `[data-theme=...]` blocks at the top of `css/style.css` |
| Visiting card scene looks (10 styles) | `.v1` to `.v10` in `css/style.css` |

## Add a new project
1. Run: `python3 tools/add_project.py my-id "My Title" social-media a.jpg b.jpg` (needs `pip install pillow`).
2. Paste the printed block into the `PROJECTS` array in `js/projects-data.js` and fill in the details.
Without Python: export WebP images (max 1600 px long edge) into `assets/img/full/` and 720 px copies into `assets/img/thumb/`, named `<project-id>-<number>.webp`, then write the entry by hand.
