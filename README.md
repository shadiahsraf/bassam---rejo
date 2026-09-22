# Bassam & Rejoyce — Engagement Invitation
Static site: HTML + CSS + vanilla JS. No build step, no backend.

## Edit the content
| What | Where |
|---|---|
| **Names** | Search "Bassam" in `index.html` (cover, hero, finale, `<title>`). |
| **Date** | Countdown: `WEDDING_DATE` in `js/script.js` (keep the `+03:00` offset). Displayed date `03 · 10 · 2026`: search in `index.html`. |
| **Story timeline** | `STORY` array at the top of `js/script.js`. Add/remove entries; `image` is optional. |
| **Photos** | Replace `images/couple-01.jpg` … `couple-06.jpg` (same names) or edit the `PHOTOS` list (src, caption, tilt, shape). Use ~1200px-wide JPGs under 300 KB. |
| **Music** | Put your file at `music/wedding-song.mp3` (or change `src` on `<audio id="audio">`). It never autoplays. |
| **Location** | Replace the `<iframe src>` in `#place` (Google Maps → Share → Embed a map) and the `destination=lat,lng` in the **Get directions** link. |
| **Colors / fonts** | `:root` variables at the top of `css/style.css`. |
| **Text** | All copy is plain text in `index.html`. |
| **Guestbook** | `guestMessages` array (manual) or `LOAD_GUESTBOOK_FROM_SHEET` (see below). |

## Connect Google Sheets
1. Create a Google Sheet with three tabs named exactly **RSVP**, **Songs**, **Messages**.
2. Header rows — RSVP: `Timestamp | Name | Attendance | Guests` · Songs: `Timestamp | Name | Song | Platform | Link` · Messages: `Timestamp | Name | Message | Approved`.
3. **Extensions → Apps Script**. Delete the sample code and paste `apps-script/Code.gs`. Save.
4. **Deploy → New deployment → ⚙ Select type → Web app.**
5. Execute as: **Me**. Who has access: **Anyone**. Click **Deploy** and authorize when asked.
6. Copy the **Web app URL** and paste it into `js/script.js`: `const GOOGLE_SCRIPT_URL = "…";`
7. Test each form, and check the rows arrive.

Notes: no keys or credentials are in the site; it only calls that public URL. If you edit the script later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same. A brand-new deployment creates a *new* URL. Until the URL is set, forms run in preview mode (they show success but save nothing).

**Live guestbook:** set `LOAD_GUESTBOOK_FROM_SHEET = true`, then type `yes` in the **Approved** column of any message you want shown. (Redeploy a new version after pasting `Code.gs`.)

## Deploy
Upload the whole folder to any static host: Netlify Drop, GitHub Pages, Cloudflare Pages, or Vercel. Open `index.html` locally to preview.
