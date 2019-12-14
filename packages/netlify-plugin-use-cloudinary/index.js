const withDefaults = config =>
  Object.assign(
    {
      cloudinaryBaseURL: 'https://res.cloudinary.com',
      transformations: 'f_auto,q_auto',
      srcDirectory: 'src',
    },
    config,
  );

const fs = require('fs');
const path = require('path');
const useCloudinary = require('remark-local-image-to-cloudinary');
const { parseMDX, stringifyMDX } = require('@blocks/serializer');

const astSmasher = async filepath => {
  // TODO port this over so we can add the cloudinary plugin
  // https://github.com/blocks/blocks/blob/4fa5593bb4b7c95d7dae928372492860b69706a1/packages/mdx/serializer/src/index.js#L13-L33
  const contents = await parseMDX(fs.readFileSync(filepath));

  console.log(contents);

  fs.writeFileSync(
    `${process.cwd()}/processed/updated.mdx`,
    stringifyMDX(contents),
  );
};

const glob = require('glob');
module.exports = () => ({
  name: 'netlify-plugin-use-cloudinary',
  onPreBuild: async ({ pluginConfig }) => {
    const { srcDirectory } = withDefaults(pluginConfig);

    const files = glob.sync(`${srcDirectory}/**/*.mdx`);

    const promises = files.map(file => astSmasher(file));

    return await Promise.all(promises);
  },
});
