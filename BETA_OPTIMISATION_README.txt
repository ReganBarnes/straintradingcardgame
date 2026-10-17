STRAIN ADVENTURES - OPTIMISED BETA RELEASE (Based on original V255 zip)

CONTENT / COMPATIBILITY
- All 1054 original and additional source files retained, including all original asset paths.
- Original assets and editor JSON files are preserved without resizing, recompression, or deletion.
- Only index.html was modified. New css/, js/, and sw.js files were added.

PERFORMANCE CHANGES
- Replace two byte-identical embedded CSS image copies with URL references to their original assets.
- Extract existing CSS and larger inline scripts into separate files without changing execution order.
- Viewport culling for static Leaf Town perimeter mountains, trees, and building images.
- Cache only Eastern Grove's static terrain, paths, flowers and fixed pathways in a canvas; dynamic clouds, lake, houses, NPCs and map-editor data draw as before.
- Existing audio lookahead scheduler improved with 25-ms polling, a longer forward window, and earliest possible audio unlock on PLAY.
- Cache images on demand with a versioned service worker on HTTPS or localhost. Mutable code/JSON is not service-worker cached.

BETA NOTES
- The host entry point is index.html at ZIP root. Upload entire ZIP contents, not the ZIP itself, to your website.
- Never selectively upload only index.html; upload css/, js/, assets/, editor/, eastern_grove/ and sw.js together.
- The game uses browser storage. Test save compatibility on the SAME origin and URL scheme as the previous build.
- Browser autoplay: music can start after user presses PLAY, not before.
- Service workers cannot register from file://. Play locally using the separate standalone HTML.
- If assets seem stale right after publishing a new beta, perform a second reload while the service worker updates.
- For future releases, increment the SW VERSION to invalidate old cached art.

BUILD HASH: c8e18ddce4bc759c
EXTERNAL SCRIPTS: 14
EXTERNAL STYLE BLOCKS: 19
