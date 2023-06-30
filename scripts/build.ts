import { promises as fs } from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import camelcase from 'camelcase';
// eslint-disable-next-line import/no-extraneous-dependencies
import { rimraf } from 'rimraf';
// eslint-disable-next-line import/no-extraneous-dependencies
import { transform } from '@svgr/core';
import { dirname } from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { transformAsync } from '@babel/core';

type Format = 'esm' | 'cjs';
interface Icon {
    svg: string;
    componentName: string;
}

const getReactComponent = async (svg: string, componentName: string, format: Format) => {
    const component = await transform(
        svg,
        {
            icon: true,
            titleProp: true,
            plugins: ['@svgr/plugin-jsx'], // FIXME: @svgr/plugin-svgo is not used as it doesn't provide unique prefix ids
        },
        { componentName },
    );

    const result = await transformAsync(component, {
        plugins: [['@babel/plugin-transform-react-jsx', { useBuiltIns: true }]],
    });
    if (format === 'esm' && result?.code) {
        return result.code;
    }

    if (result?.code) {
        return result.code
            .replace('import * as React from "react"', 'const React = require("react")')
            .replace('export default', 'module.exports =') ?? '';
    }
    return null;
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

function exportAll(icons: Icon[], format: Format, includeExtension = true) {
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

async function ensureWrite(file: string, text: string) {
    await fs.mkdir(dirname(file), { recursive: true });
    await fs.writeFile(file, text, 'utf8');
}

async function buildIcons(format: Format) {
    let outDir = './dist';
    if (format === 'esm') {
        outDir += '/esm';
    }

    const icons = await getIcons();

    await Promise.all(
        icons.flatMap(async ({ componentName, svg }) => {
            const content = await getReactComponent(svg, componentName, format);
            const types = `import * as React from 'react';\ndeclare const ${componentName}: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & { title?: string, titleId?: string } & React.RefAttributes<SVGSVGElement>>;\nexport default ${componentName};\n`;

            if (content) {
                return [
                    ensureWrite(`${outDir}/${componentName}.js`, content),
                    ensureWrite(`${outDir}/${componentName}.d.ts`, types),
                ];
            }
            return [];
        }),
    );

    await ensureWrite(`${outDir}/index.js`, exportAll(icons, format));

    await ensureWrite(`${outDir}/index.d.ts`, exportAll(icons, 'esm', false));
}

async function main() {
    // eslint-disable-next-line no-console
    console.log('Building  package...');

    await Promise.all([
        rimraf('./dist/*'),
    ]);

    await Promise.all([
        buildIcons('cjs'),
        buildIcons('esm'),
    ]);

    // eslint-disable-next-line no-console
    return console.log('Finished building package.');
}

main();
