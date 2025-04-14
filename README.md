# Man of Substance

_Man of Substance_ is my debut studio album as DVK. To accompany the album, I created this app allowing the user to view the synopsis, lyrics and credits for each track, as well as the album's credits and other content added periodically. Prior to the production of the album, I ran a crowdfunding campaign that yielded part of the funds used; as such, contributors are also able to claim their rewards on the app.

## Links

-   Repository: [github.com/DavyK17/man-of-substance](https://github.com/DavyK17/man-of-substance)
-   Live link: [man-of-substance.pages.dev](https://mos.davykamanzi.com)

## How it was built

### Base libraries/techonolgies

-   [SvelteKit](https://kit.svelte.dev/) - Full-stack web application framework
-   [Supabase](https://supabase.com/) - Open source backend-as-a-service (BaaS)
-   [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript programming language

#### Testing and monitoring

-   [Playwright](https://playwright.dev/) - End-to-end testing framework
-   [Vitest](https://vitest.dev/) - Unit testing framework

### Supporting libraries/technologies

-   [JS File Downloader](https://github.com/AleeeKoi/js-file-downloader) - JavaScript library for downloading files on the browser
-   [JSZip](https://stuk.github.io/jszip/) - JavaScript library for creating, reading, and editing .zip files
-   [Moment.js](https://momentjs.com/) - JavaScript time manipulation library

## Features

The _Man of Substance_ website is a full-stack app with a simple design that is accessible from desktop, tablet and mobile devices with all modern browsers, with Lighthouse scores of 74 for performance, 100 for accessibility, 92 for best practices, and 100 for SEO (full report can be viewed by [clicking here](./readme/lighthouse.pdf)).

Prior to the album's release, each page on the site displayed messages indicating locked content, depending on what was requested (these can be revisited in detail by looking through the app's tests).

### Contributors

The Contributors page displays a list of all contributors present in the app's database. Contributors are able to log in using their email address, giving them access to a simple dashboard that allows them to view and claim their rewards, depending on the tier they belong to. Rewards include track downloads, personalised "thank you" videos, and more.

### Tracks and credits

The app loads basic tracklist information from the database, with data on synopses, lyrics, and credits (including HTML) stored in a local JSON file as a separation of concerns between the frontend and backend.

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

![Contributors page](./readme/screenshot-tracklist.png)

#### Track page

![Track page](./readme/screenshot-track.png)

#### Credits page

![Credits page (mobile version)](./readme/screenshot-credits.png)

### Mobile version

#### Home page

![Home page (mobile version)](./readme/screenshot-mobile-home.png)

#### Contributors page

![Contributors page (mobile version)](./readme/screenshot-mobile-contributors.png)
![Contributors login page (mobile version)](./readme/screenshot-mobile-contributors-login.png)

#### Tracklist page

![Contributors page (mobile version)](./readme/screenshot-mobile-tracklist.png)

#### Track page

![Track page (mobile version)](./readme/screenshot-mobile-track.png)

#### Credits page

![Credits page (mobile version)](./readme/screenshot-mobile-credits.png)

## Author

-   GitHub: [@DavyK17](https://github.com/DavyK17)
-   Website: [davyk17.pages.dev](https://davyk17.pages.dev)
