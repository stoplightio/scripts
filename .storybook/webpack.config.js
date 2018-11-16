const path = require('path');

const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
const styledComponentsTransformer = createStyledComponentsTransformer();

module.exports = (baseConfig, env, config) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    include: [path.resolve(process.cwd(), 'src')],
    use: [
      {
        loader: require.resolve('ts-loader'),
        options: {
          getCustomTransformers: () => ({
            before: [styledComponentsTransformer],
          }),
        },
      },
      {
        loader: require.resolve('react-docgen-typescript-loader'),
        options: {
          // without this, react / html base props will be included and there are a LOT of them
          propFilter: prop => {
            if (prop.parent == null) {
              return true;
            }

            return prop.parent.fileName.indexOf('node_modules/@types/react') < 0;
          },
        },
      },
    ],
  });

  config.resolve.extensions.push('.ts', '.tsx');

  return config;
};
