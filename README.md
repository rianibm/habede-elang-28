# Habede, Elang!

A birthday scrapbook for Elang’s 28th, inspired by the open binder, tactile paper, collage, and nostalgic media-player direction of [Taliahhh](https://taliahhh.com/). The layout and CSS illustrations are original; no assets or code were copied from the reference.

## Local preview

Run `npm run dev`, then open http://127.0.0.1:4173. No installation or build step is needed. `dist/` contains the complete static website. Run `npm run check` to check JavaScript syntax.

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
