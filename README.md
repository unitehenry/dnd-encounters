# D&D Encounter Stat Block Generator

A simple nodejs app that accesses [D&D Byond](https://dndbeyond.com/) content and gets the stat blocks of monsters for your encounters. It uses [puppeteer](https://github.com/puppeteer/puppeteer) to autmomate browsing the D&D Beyond app. It only allows access to basic content, but you can manually [run this app locally](#running-locally) and [provide your cookies](#accessing-premium-content) to let the app act on your behalf.

## Running Locally

```sh

# Clone the Repo

$ git clone https://github.com/unitehenry/dnd-statblocks

# Install dependencies

$ npm install

# Start the App

$ npm start

```

### Accessing Premium Content

In order to access premium content on behalf of you D&D Beyond account, you must provide your browser session cookies to the app and run it locally on your machine.

#### Getting your Session Cookies

1. Navigate to D&D Beyond
2. Sign In and Authenticate
3. Open Chrome Dev Tools
4. In the console, run the script ```document.cookie``` and print your cookies
5. Copy the string and add it to the ```cookies.js``` file
