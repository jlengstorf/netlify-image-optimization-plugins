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
const unified = require('unified');
const remarkParse = require('remark-parse');
const remarkSqueezeParagraphs = require('remark-squeeze-paragraphs');
const remarkInterleave = require('./util/remark-interleave');
const mdx = require('remark-mdx');
const useCloudinary = require('remark-local-image-to-cloudinary');
const remarkStringify = require('remark-stringify');

const parser = unified()
  .use(remarkParse, {
    commonmark: true,
    position: false,
  })
  .use(remarkSqueezeParagraphs)
  .use(remarkInterleave)
  .use(mdx)
  .use(useCloudinary, {
    baseDir: 'site/src/pages',
  });

const stringifier = unified()
  .use(remarkStringify, {
    fences: true,
  })
  .use(remarkSqueezeParagraphs)
  .use(mdx);

const parseMDX = md => parser.run(parser.parse(md));
const stringifyMDX = mdast => stringifier.stringify(stringifier.runSync(mdast));

const convertLocalImagesToCloudinary = async filepath => {
  const mdast = await parseMDX(fs.readFileSync(filepath));

  fs.writeFileSync(
    `${process.cwd()}/processed/updated.mdx`,
    stringifyMDX(mdast),
  );
};

const glob = require('glob');
module.exports = () => ({
  name: 'netlify-plugin-use-cloudinary',
  onPreBuild: async ({ pluginConfig }) => {
    const { srcDirectory } = withDefaults(pluginConfig);
    const files = glob.sync(`${srcDirectory}/**/*.mdx`);

    // run all file conversions in parallel and wait for all to complete
    return await Promise.all(files.map(convertLocalImagesToCloudinary));
  },
});
