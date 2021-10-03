module.exports = {
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("tailwindcss-image-rendering")(),
  ],
  variants: {
    extend: {
      borderWidth: ["hover"],
    },
  },
};
