## IFRC-GO Icons ![npm (scoped)](https://img.shields.io/npm/v/@ifrc-go/icons)
React icons for [IFRC-GO](https://github.com/IFRCGo/) project.

## Installation
```sh
yarn add @ifrc-go/icons
#or
npm install @ifrc-go/icons
```

## Gh Pages
Dev
```
docker-compose up page-dev
```

Build
```
docker-compose up page-build
```
> WHY? next will use icons configuration which can cause issue

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
