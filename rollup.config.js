import typescript from '@rollup/plugin-typescript';
import node_resolve from '@rollup/plugin-node-resolve';

export default [
    {
        input: 'src/main.ts',
        output: {
            file: 'client/main.js',
            format: 'es'
        },
        plugins: [
            node_resolve(),
            typescript(),
        ],
    }
];
