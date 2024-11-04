module.exports = {
  content: [
    './app/views/**/*.html.erb',
    './app/helpers/**/*.rb',
    './app/assets/stylesheets/**/*.css',
    './app/javascript/**/*.{js,jsx}',
    './app/content/helpers/**/*.rb',
    './app/content/layouts/**/*.{md,erb,haml,html,slim}',
    './app/content/pages/**/*.{md,erb,haml,html,slim}',
    './app/content/application/**/*.{md,erb,haml,html,slim}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms")
  ]
}
