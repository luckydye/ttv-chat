import typescript from '@rollup/plugin-typescript';
import Package from './package.json';

import webWorkerLoader from 'rollup-plugin-web-worker-loader';
import node_resolve from '@rollup/plugin-node-resolve';
import injectProcessEnv from 'rollup-plugin-inject-process-env';

const mode = process.env.NODE_ENV ? 'production' : 'development';
console.log('Mode:', mode, '\n');

const envVars = {
    '__ENV__': mode,
    '__PACKAGE__': {
        version: Package.version,
        name: Package.name,
        description: Package.description,
    }
}

export default [
    {
        input: 'src/main.ts',
        output: {
            file: 'build/main.js',
            format: 'esm'
        },
        plugins: [
            node_resolve(),
            webWorkerLoader(),
            typescript(),
            injectProcessEnv(envVars),
        ],
    }
];
