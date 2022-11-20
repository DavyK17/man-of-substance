# Man of Substance (frontend)

*Man of Substance* is my debut studio album, under my pseudonym DVK. To accompany the album, I created this React app, which allows the user to view the synopsis, lyrics and credits for each track, as well as the album's credits and other content added periodically. Prior to the production of the album, I ran a crowdfunding campaign that yielded part of the funds used for it, and contributors are also able to claim their rewards on the app.

## Links
- Repository: [github.com/DavyK17/man-of-substance](https://github.com/DavyK17/man-of-substance)
- Live link: [mos.davykamanzi.com](https://mos.davykamanzi.com)

## How it was built
### Base libraries/techonolgies
- [React](https://reactjs.org/) - JavaScript user interface library
- [React Router](https://reactrouter.com/) - React routing library
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - React testing utility

### Additional libraries/techonolgies
- [AWS Amplify](https://aws.amazon.com/amplify/) - JavaScript library for frontend and mobile development
- [JSZip](https://stuk.github.io/jszip/) - JavaScript library for creating, reading and editing .zip files
- [Moment.js](https://momentjs.com/) - JavaScript time manipulation library
- [React Loading Skeleton](https://www.npmjs.com/package/react-loading-skeleton) - Animated loading skeleton tool
- [React Swipeable](https://github.com/FormidableLabs/react-swipeable) - React swipe event handler
- [StreamSaver.js](https://github.com/jimmywarting/StreamSaver.js) - JavaScript library for saving streams on the front end

## Features
The *Man of Substance* website is a single page app (SPA) with a simple design that is accessible from desktop, tablet and mobile devices with all modern browsers, with Lighthouse scores of 72 for performance, 100 for accessibility, 92 for best practices, and 100 for SEO (full report can be viewed by [clicking here](./readme/lighthouse.pdf)).

Prior to the album's release, each page on the site displayed certain messages showing that content was locked, depending on the content requested (these can be revisited in detail by looking at the app's tests). 

### Contributors
The Contributors page communicates with the [backend](https://github.com/DavyK17/man-of-substance-server) via a REST API to display a list of all contributors present in the app's database. Contributors are able to log in using their email address, which gives them access to a simple dashboard that allows them to view and claim their rewards, depending on the tier they belong to. Rewards including track downloads, personalised "thank you" videos and more.

Downloadable files are stored using [Amazon S3](https://aws.amazon.com/s3), while the app uses the Amplify library to allow contributors to retrieve their rewards from the web app's S3 bucket.

### Tracklist, tracks and credits
The app instantly loads all track and credits data from a JSON file, allowing for easy viewing.

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
![Contributors page](./readme/screenshot-tracklist.png.png)

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
![Contributors page (mobile version)](./readme/screenshot-mobile-tracklist.png.png)

#### Track page
![Track page (mobile version)](./readme/screenshot-mobile-track.png)

#### Credits page
![Credits page (mobile version)](./readme/screenshot-mobile-credits.png)

## Future work
Looking to potentially keep my listeners engaged with periodic content on the app, such as secret challenges.

## Author
- GitHub: [@DavyK17](https://github.com/DavyK17)
- Website: [davyk17.github.io](https://davyk17.github.io)
