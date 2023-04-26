/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs').promises;
const camelcase = require('camelcase');
const { rimraf } = require('rimraf');
const { transform } = require('@svgr/core');
const { dirname } = require('path');
const babel = require('@babel/core');
const babelPluginTransformJxs = require('@babel/plugin-transform-react-jsx');

const getReactComponent = async (svg, componentName, format) => {
  const component = await transform(
    svg,
    {
      icon: true,
      titleProp: true,
      plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
    },
    { componentName },
  );

  const { code } = await babel.transformAsync(component, {
    plugins: [[babelPluginTransformJxs, { useBuiltIns: true }]],
  });

  if (format === 'esm') {
    return code;
  }

  return code
    .replace('import * as React from "react"', 'const React = require("react")')
    .replace('export default', 'module.exports =');
};

async function getIcons() {
  const files = await fs.readdir('./icons');
  return Promise.all(
    files.map(async (file) => ({
      svg: await fs.readFile(`./icons/${file}`, 'utf8'),
      componentName: `${camelcase(file.replace(/\.svg$/, ''), {
        pascalCase: true,
      })}Icon`,
    })),
  );
}

function exportAll(icons, format, includeExtension = true) {
  return icons
    .map(({ componentName }) => {
      const extension = includeExtension ? '.js' : '';
      if (format === 'esm') {
        return `export { default as ${componentName} } from './${componentName}${extension}'`;
      }
      return `module.exports.${componentName} = require("./${componentName}${extension}")`;
    })
    .join('\n');
}

async function ensureWrite(file, text) {
  await fs.mkdir(dirname(file), { recursive: true });
  await fs.writeFile(file, text, 'utf8');
}

async function buildIcons(format) {
  let outDir = './dist';
  if (format === 'esm') {
    outDir += '/esm';
  }

  const icons = await getIcons();

  await Promise.all(
    icons.flatMap(async ({ componentName, svg }) => {
      const content = await getReactComponent(svg, componentName, format);
      const types = `import * as React from 'react';\ndeclare const ${componentName}: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & { title?: string, titleId?: string } & React.RefAttributes<SVGSVGElement>>;\nexport default ${componentName};\n`;

      return [
        ensureWrite(`${outDir}/${componentName}.js`, content),
        ...(types ? [ensureWrite(`${outDir}/${componentName}.d.ts`, types)] : []),
      ];
    }),
  );

  await ensureWrite(`${outDir}/index.js`, exportAll(icons, format));

  await ensureWrite(`${outDir}/index.d.ts`, exportAll(icons, 'esm', false));
}

async function main() {
  console.log('Building  package...');

  await Promise.all([
    rimraf('./dist/*'),
  ]);

  await Promise.all([
    buildIcons('cjs'),
    buildIcons('esm'),
  ]);

  return console.log('Finished building package.');
}

main();
