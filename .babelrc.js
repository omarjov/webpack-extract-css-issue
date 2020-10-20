module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: 'current'
        },
        "useBuiltIns": "entry" // Transforms import babel/polyfill to only needed requires
      }
    ]
  ],
  env: {
    "development": {
      "presets": [
        ["@babel/preset-react", { "development": true }] // Enables some more transforms that can be useful for development
      ]
    },
    "test": {
      "presets": [
        ["@babel/preset-react", { "development": true }] // Enables some more transforms that can be useful for development
      ]
    }
  },
  plugins: [
    ["@babel/plugin-proposal-decorators", { "legacy": true }], // For jest. Must be before class properties plugin
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-optional-chaining"
  ]
};
