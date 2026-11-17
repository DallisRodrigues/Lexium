# Logo slot

`lexium-logo.png` — exported unchanged from the supplied `logo.cdr` (CorelDRAW's own embedded render, white background made transparent; source archive kept in `/brand-source/`).
Its fonts (CastleT Light, Calibri) are embedded in a proprietary Corel format, so a vector export would substitute fonts; for a sharper logo, export an SVG from CorelDRAW with text converted to curves and save it here as `lexium-logo.svg` (SVG is preferred automatically), then `npm run build`.

Optional: `lexium-logo-white.svg|png` for the navy footer — otherwise the standard logo is shown on a white plate.
