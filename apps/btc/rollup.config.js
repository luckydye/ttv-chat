import typescript from '@rollup/plugin-typescript';
import replace from 'rollup-plugin-replace';
import node_resolve from '@rollup/plugin-node-resolve';


export default [
    {
        input: 'src/main.ts',
        output: {
            file: 'client/main.js',
            format: 'es'
        },
        plugins: [
            replace({
                'process.env.NODE_ENV': JSON.stringify( 'production' )
            }),
            node_resolve(),
            typescript(),
        ],
    }
];
