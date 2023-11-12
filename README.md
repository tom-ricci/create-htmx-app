# create-htmx-app
Bootstrap an HTMX app with npx!

### Usage
Run `npx create-htmx-app@latest`.

### Contributing
This project runs on Node.js 20. You can either install node yourself, or use [Devbox](https://www.jetpack.io/devbox) and [direnv](https://direnv.net/).
#### Setting up Environment with Devbox
First, [install Devbox](https://www.jetpack.io/devbox/docs/quickstart/) and [direnv](https://direnv.net/).
> Note:\
> Normally this takes a couple steps, however I've developed a simple Devbox and direnv installer for systems with bash and apt-get. Run `bash <(curl -s https://raw.githubusercontent.com/tom-ricci/easy-devbox/master/script.sh)` to install everything this way.

Next, reload your shell and `cd` into the project. Once you're there, run `devbox generate direnv` and `.. && .`.

Finally, `npm i` the dependencies.
