module.exports = {
  content: [
    './app/views/**/*.erb',
    './app/helpers/**/*.rb',
    './app/javascript/controllers/**/*.js',
    './app/javascript/react/**/*.{js,jsx}',
    './app/content/helpers/**/*.rb',
    './app/content/layouts/**/*.erb',
    './app/content/pages/index.html.erb',
    './app/content/pages/**/*.{md,erb}',
    './app/content/application/**/*.erb',
    './app/markdown/**/*.rb',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms")
  ]
}
