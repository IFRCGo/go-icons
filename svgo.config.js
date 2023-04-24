module.exports = {
  plugins: [
    'preset-default',
    'removeDimensions',
    'removeXMLNS',
    {
      name: 'removeAttrs',
      params: {
        attrs: '(fill|stroke)',
      },
    },
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [
          {
            stroke: 'currentColor',
          },
          {
            fill: 'currentColor',
          },
        ],
      },
    },
  ],
};
