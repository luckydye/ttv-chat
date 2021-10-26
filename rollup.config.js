import typescript from '@rollup/plugin-typescript';
import node_resolve from '@rollup/plugin-node-resolve';
import preact from 'rollup-plugin-preact';

export default [
    {
        input: 'src/main.ts',
        output: {
            file: 'client/main.js',
            format: 'esm'
        },
        plugins: [
            node_resolve(),
            typescript(),
        ],
    }
];
