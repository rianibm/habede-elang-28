# Habede, Elang!

A birthday scrapbook for Elang’s 28th, inspired by the open binder, tactile paper, collage, and nostalgic media-player direction of [Taliahhh](https://taliahhh.com/). The layout and CSS illustrations are original; no assets or code were copied from the reference.

## Local preview

Run `npm run dev`, then open http://127.0.0.1:4173. No installation or build step is needed. `dist/` contains the complete static website. Run `npm run check` to check JavaScript syntax.

## Deploy to Vercel

The repository is ready for Vercel as a static site. `vercel.json` sets the framework to **Other**, skips dependency installation, runs `npm run build`, and publishes only `dist/`. No environment variables are required.

1. Save and push the desired changes to [rianibm/habede-elang-28](https://github.com/rianibm/habede-elang-28).
2. In Vercel, select **Add New → Project** and import that repository.
3. Keep the **Root Directory** at the repository root (`./`). The build settings are supplied by `vercel.json`; if the dashboard asks, use:

   | Setting | Value |
   | --- | --- |
   | Framework Preset | Other |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | Empty / skipped |
   | Environment Variables | None |

4. Select **Deploy**. Check the cover, open the book, and play each family video on the resulting URL.

For a CLI deployment from the repository root, run `npx vercel` for a preview, then `npx vercel --prod` when ready for production.

Run `npm run build` locally before pushing. It checks JavaScript syntax and verifies that HTML and video-player asset references resolve to real, nonempty files rather than Git LFS pointers. The static files already live in `dist/`; the build does not regenerate or overwrite them. Keep `dist/` tracked in Git.

`assets/originals/` is outside the published output and excluded from CLI uploads by `.vercelignore`. The optimized photos and the three MP4 files inside `dist/` are included in the website.

Configuration reference: [Vercel project configuration](https://vercel.com/docs/project-configuration/vercel-json).

## Contents

- **Buka buku:** birthday introduction and Polaroids extracted from the supplied videos.
- **Film keluarga:** three selectable family videos presented as an album sleeve with a partially exposed vinyl record. Selecting a track or the album opens a large native dialog player, with previous/next navigation. Closing the dialog pauses playback. Native controls support seeking, volume, and fullscreen. The dialog fits mobile screens.
- **Untuk kamu:** an editable birthday note from his girlfriend.

## Videos and editing

The three supplied MP4s are in `dist/videos/`, with stills extracted at two seconds. These are local copies for reliable playback because the Drive preview returned a playback error. The original Drive permissions were not changed. Video order, titles, and file paths are defined in `dist/app.js`; matching visible labels and letter text are in `dist/index.html`.

The website includes private family media. It is currently local and has not been published. Deploying `dist/` will make the copied videos available to whoever can access that deployment; Drive permissions do not protect those local copies. Choose deployment access accordingly.

Fonts are loaded from Google Fonts with system fallbacks. The layout adapts to narrow screens, includes keyboard focus indicators, and respects reduced motion.

## Validation

JavaScript syntax checked. All three videos were confirmed to load and advance in the browser. Section navigation and the mobile layout were also checked. Album playback, next-track navigation, and pausing on dialog close were verified in the browser.

## Art direction

The current edition uses an orange record jacket, a contact sheet of all three real family videos, handwritten track names, recording durations, and informal Indonesian copy. The cover collage stays fixed as a family portrait across tracks.

The final note includes “created with love by rianibm” and a close-book action. Closing pauses video and reveals a closed cover with the same credit; “buka lagi” returns to the first page. Reduced motion skips the closing animation.

The root URL starts with the closed front cover featuring Elang’s supplied portrait. Opening reveals the scrapbook; closing at the end shows the two supplied couple photos. Every fresh load starts on the closed front cover, including a reload from an internal section. Header text reads Sebastian Elang and 28 tahun.

## Motion and mobile pagination

Desktop retains three two-page spreads. Mobile shows a single page at a time: introduction, family tracks, vinyl, then the note. Previous/next buttons and horizontal touch swipes move between pages. The layout remaps the current section when crossing the mobile breakpoint.

Opening and closing use a shared book transition with a 3D hinge when View Transitions are supported; a Web Animations cover overlay provides the fallback. Page changes curl the outgoing paper on desktop. Dialogs enter with a short depth animation. Reduced motion skips book animations and gestures preserve vertical scrolling.

## Performance pass

Personal photos were converted from PNG (3,513,602 bytes total) to WebP (182,778 bytes total), a 94.8% reduction. Originals are retained outside the published directory in assets/originals/. The front portrait is eager/high-priority; other images use lazy loading and asynchronous decoding, with intrinsic dimensions specified. Video has no source until a track is selected.

The initial local HTML/CSS/JS plus cover image is approximately 115 KB before compression, excluding Google Fonts and any browser-requested thumbnails. No Lighthouse score or production Core Web Vitals has been measured; the local browser does not expose performance timing through its automation interface.

The initial cover lands with a short 3D toss and a small rebound, followed by an occasional gentle invitation wiggle. The cover itself is clickable and keyboard accessible. The invitation stops when opening begins, pauses in a hidden tab, and is disabled for reduced-motion preferences; it does not run on the ending cover.

## Tactile interactions

The closed view hides the site header and uses a larger cover; navigation appears only after opening. The vinyl slides out on reveal and tucks into its sleeve before leaving the mobile record page or closing the book. Polaroids can be moved with pointer/touch drag or the arrow keys, within bounded positions. Drags do not trigger mobile page swipes. Page corners lift on hover/focus and can advance the book (or close it on the final page). The author photo drops into view, and the ending cover receives a small settling pat. All decorative animation respects reduced motion.

The redundant A1–A3 buttons and the track label under the album were removed. The reminder to call home appears only on the final note, before the credit and close-book button.

The book is split into Side A (orang rumah: family films) and Side B (penutup dari Riani: the final note). On the last desktop spread, the right page switches from the record sleeve to a Riani photo/sign-off. On mobile, the final note remains the separate last page.
