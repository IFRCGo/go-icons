## IFRC-GO Icons
React icons for [IFRC-GO](https://github.com/IFRCGo/) project.

## Installation
```sh
yarn add @ifrc-go/icons
#or
npm install @ifrc-go/icons
```

## Usage

Each icon can be imported as a react component.
```js
import { MenuLineIcon } from '@ifrc-go/icons';

function MyComponent() {
  return (
    <div>
      <MenuLine className={{ color: #3b82f6 }} />
    </div>
  )
}
```
Each icon has its `stroke` and `fill` property set to `currentColor`.  The icon style can be set using the `color` CSS property.

## License

This library is MIT licensed.
