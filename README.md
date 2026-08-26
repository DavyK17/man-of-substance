# Man of Substance

A SvelteKit and Supabase application that delivers a crowdfunded album's public catalogue and contributor rewards. The public site serves synopses, lyrics and credits; authenticated contributors claim tiered downloads, including personalised videos, under PostgreSQL row-level security and signed-URL file delivery.

The catalogue is a completed project (v2.0.2, Svelte 4). It is also a readable public sample of the same stack used on Koloseum: SvelteKit, Supabase, PostgreSQL, generated database types and database-enforced authorisation.

## Links

- Repository: [github.com/DavyK17/man-of-substance](https://github.com/DavyK17/man-of-substance)
- Live site: [manofsubstance.pages.dev](https://manofsubstance.pages.dev)
- Author: [davyk17.pages.dev](https://davyk17.pages.dev) · [github.com/DavyK17](https://github.com/DavyK17)
- Koloseum engineering showcase: [github.com/koloseum-technologies/engineering-showcase](https://github.com/koloseum-technologies/engineering-showcase)

## How it was built

### Base

- [SvelteKit](https://kit.svelte.dev/) — full-stack web application framework (Svelte 4)
- [Supabase](https://supabase.com/) — Auth, Postgres and Storage
- [TypeScript](https://www.typescriptlang.org/)

### Data and authorisation

- Declarative schema in `supabase/schemas/album.sql`, with a generated migration
- Row-level security on all four tables; object-level Storage policy so personalised `mp4/<id>.mp4` files are readable only by the matching contributor
- A SQL view (`contributor_names`) that derives five contributor tiers from contribution amounts
- `parsePostgrestError` maps PostgreSQL SQLSTATE codes — including `P0001` from PL/pgSQL `RAISE` — onto HTTP statuses

### Testing

- [Vitest](https://vitest.dev/) — 15 unit tests across helper modules (tier thresholds, track limits, credits, navigation, path matching, tracklist assembly, runtime formatting)
- [Playwright](https://playwright.dev/) is configured; end-to-end specs for the locked and unlocked content states are not written yet

### Supporting libraries

- [JS File Downloader](https://github.com/AleeeKoi/js-file-downloader)
- [JSZip](https://stuk.github.io/jszip/)
- [Moment.js](https://momentjs.com/)

## Features

The site is a full-stack app with a simple design that is accessible from desktop, tablet and mobile. A Lighthouse report in this repository records 95 performance, 100 accessibility, 100 best practices and 100 SEO ([report](./readme/lighthouse.pdf)).

### Contributors

The Contributors page lists backers from the database. A contributor signs in with the email used during the campaign and reaches a dashboard to view and claim rewards for their tier — track downloads, a personalised thank-you video where eligible, and related files.

Authentication is a campaign-era trade-off: the server supplies a single shared password for every contributor, so knowing a backer's email is sufficient to reach their rewards. That was acceptable for a 2022 album-rewards gate whose blast radius was music downloads. It is **not** the authentication model used on Koloseum's `public-auth` service, which uses per-user credentials, age gating and third-party identity verification.

### Tracks and credits

Tracklist rows come from Postgres. Synopses, lyrics and credits (including markup) live in a local JSON file, a deliberate split between catalogue content and the database.

## Hidden challenge

One track page hides a puzzle behind a lyric that ships to the browser as `PUBLIC_CHALLENGE_LYRIC`. That public hint was the intended attack surface: an experienced engineer used it to solve the puzzle, which is what the challenge asked them to do. The application-side lesson is that anything in `PUBLIC_*` is visible to the client; secrets and answers do not belong there. The challenge remains as documented release-window colour, not as a security boundary.

## Wireframes

### Home page

![Home page](./readme/wireframe-home.jpg)

### Contributors page

![Contributors page](./readme/wireframe-contributors.jpg)

### Tracklist page

![Tracklist page](./readme/wireframe-tracklist.jpg)

### Track page

![Track page](./readme/wireframe-track.jpg)

## Screenshots

### Desktop version

#### Home page

![Home page](./readme/screenshot-home.png)

#### Contributors page

![Contributors page](./readme/screenshot-contributors.png)
![Contributors login page](./readme/screenshot-contributors-login.png)

#### Tracklist page

![Tracklist page](./readme/screenshot-tracklist.png)

#### Track page

![Track page](./readme/screenshot-track.png)

#### Credits page

![Credits page](./readme/screenshot-credits.png)

### Mobile version

#### Home page

![Home page (mobile version)](./readme/screenshot-mobile-home.png)

#### Contributors page

![Contributors page (mobile version)](./readme/screenshot-mobile-contributors.png)
![Contributors login page (mobile version)](./readme/screenshot-mobile-contributors-login.png)

#### Tracklist page

![Tracklist page (mobile version)](./readme/screenshot-mobile-tracklist.png)

#### Track page

![Track page (mobile version)](./readme/screenshot-mobile-track.png)

#### Credits page

![Credits page (mobile version)](./readme/screenshot-mobile-credits.png)

## Future work

- Playwright specs for the locked and unlocked content states (`e2e/locked`, `e2e/unlocked`)
- Optional Svelte 5 migration; the Koloseum estate has already moved, this completed album site has not

## Author

- GitHub: [@DavyK17](https://github.com/DavyK17) · [profile index](https://github.com/DavyK17/profile)
- Website: [davyk17.pages.dev](https://davyk17.pages.dev)
- Koloseum: [engineering showcase](https://github.com/koloseum-technologies/engineering-showcase)
