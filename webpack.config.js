const Encore = require('@symfony/webpack-encore');

if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore.setOutputPath('public/build/')
    .setPublicPath('/build')

    //Default
    .addStyleEntry("styles", "./assets/styles/app.scss")
    .addEntry('app', './assets/app.js')

    //NBK
    .addStyleEntry("NBKStyle", "./assets/react/Apps/NBK/Style/NBK.scss")
    .addEntry("NBK", "./assets/react/Apps/NBK/index.js")


    .copyFiles({
        from: "./assets/images",
        to: "images/[path][name].[ext]",
    })
    .enableSassLoader()
    .enableSingleRuntimeChunk()
    .cleanupOutputBeforeBuild()
  .enableSourceMaps(!Encore.isProduction())
  .enableVersioning(Encore.isProduction())
    .enableReactPreset()
    .autoProvidejQuery()
;

module.exports = Encore.getWebpackConfig();
