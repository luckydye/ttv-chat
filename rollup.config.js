import typescript from '@rollup/plugin-typescript';
import node_resolve from '@rollup/plugin-node-resolve';

export default [
    {
        input: 'src/main.ts',
        output: {
            file: 'build/main.js',
            format: 'esm'
        },
        plugins: [
            node_resolve(),
            typescript(),
        ],
    }
];
