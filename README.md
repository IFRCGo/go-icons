## IFRC-GO Icons ![npm (scoped)](https://img.shields.io/npm/v/@ifrc-go/icons) [![Build](https://github.com/IFRCGo/go-icons/actions/workflows/ci.yml/badge.svg)](https://github.com/IFRCGo/go-icons/actions/workflows/ci.yml) [![Release & Publish](https://github.com/IFRCGo/go-icons/actions/workflows/release.yml/badge.svg)](https://github.com/IFRCGo/go-icons/actions/workflows/release.yml)
React icons for [IFRC-GO](https://github.com/IFRCGo/) project.

## Installation
```sh
yarn add @ifrc-go/icons
#or
npm install @ifrc-go/icons
```

## GitHub Pages
For local development
```
docker-compose up page-dev
```

For building the NextJS project
```
docker-compose up page-build
```

## Usage

Each icon can be imported as a react component.
```js
import { MenuLineIcon } from '@ifrc-go/icons';

function MyComponent() {
  return (
    <div>
      <MenuLineIcon className={{ color: #3b82f6 }} />
    </div>
  )
}
```
Each icon has its `stroke` and `fill` property set to `currentColor`.  The icon style can be set using the `color` CSS property.

## License

This library is MIT licensed.
