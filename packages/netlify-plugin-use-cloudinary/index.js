const DEFAULT_CONFIG = {
  cloudinaryBaseURL: 'https://res.cloudinary.com',
  transformations: 'f_auto,q_auto',
};

module.exports = () => ({
  name: 'gatsby-plugin-use-cloudinary',
  onPreBuild: async args => {
    console.log({ args });
  },
});
