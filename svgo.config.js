module.exports = {
  plugins: [
    {
      name: 'preset-default',
    },
    {
      name: 'removeDimensions',
    },
    {
        name: 'prefixIds',
    },
    {
      name: 'removeAttrs',
      params: {
        attrs: '(stroke|fill)',
      },
    },
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [
          {
            'aria-hidden': true,
          },
          {
            fill: 'currentColor',
          },
        ],
      },
    },
  ],
};
