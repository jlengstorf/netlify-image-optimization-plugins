const path = require('path');
const visit = require('unist-util-visit');
const upload = require('./upload');
const getImageUrl = require('./build-url');

module.exports = ({
  baseDir,
  uploadFolder = 'netlify',
  transformations = 'f_auto,q_auto',
  maxWidth = 1800,
}) => tree =>
  new Promise(async (resolve, reject) => {
    const convertToCloudinary = async node => {
      const imagePath = path.join(process.cwd(), baseDir, node.url);

      try {
        // upload the local image to Cloudinary
        const cloudinaryName = await upload({
          imagePath,
          uploadFolder,
        });

        // replace the local image path with the Cloudinary asset URL
        node.url = getImageUrl({
          fileName: cloudinaryName,
          uploadFolder,
          transformations: `${transformations},w_${maxWidth}`,
        });

        resolve();
      } catch (err) {
        reject(err);
      }
    };

    visit(tree, node => node.type === 'image', convertToCloudinary);
  });
