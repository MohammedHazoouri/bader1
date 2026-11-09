# A Love Letter

An interactive romantic website: welcome screen → sealed envelope → three photo-and-message sections → a quiet ending.
Pure HTML, CSS and vanilla JavaScript. No dependencies, no build step.

## Run it
- Double-click `index.html`, **or** run a local server from this folder:
  `python3 -m http.server 8000` and open http://localhost:8000
- Google Fonts load online; offline it falls back to Georgia / Arial.

## Add your music
Place your own legally obtained file at `assets/audio/love-song.mp3`
(the included file is an empty placeholder). It starts at **134 s (02:14)** when the envelope is clicked.
To change the start time, edit `START` at the top of `js/script.js`.
If the file is missing or the browser blocks playback, the site still works and the corner control says so; tap it to play.

## Replace the photos
Overwrite `assets/images/image1.jpg`, `image2.jpg`, `image3.jpg` (portrait, ~4:5, about 1200×1500 px works well).
The included images are soft gradient placeholders. Suggested: 1 = golden-hour/11:11 mood, 2 = bouquet, 3 = couple holding hands.
If an image is missing, a matching gradient shows instead.

## Edit the text
All wording is in `index.html` inside each `<section class="story">`. The "It’s you" finale is typed from the `data-type` attribute
on `#finale1` — update both if you change it. Colors are CSS variables at the top of `css/style.css`.

## Accessibility
`prefers-reduced-motion` disables animations and particles; parallax, cursor and extras are off on mobile.
