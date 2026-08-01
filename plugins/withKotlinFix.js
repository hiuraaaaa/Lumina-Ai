const { withProjectBuildGradle } = require('@expo/config-plugins');

/**
 * Fix Kotlin version incompatibility in EAS Build.
 * expo-modules-autolinking is compiled with Kotlin 2.1.x but
 * expo-module-gradle-plugin expects 1.9.x — force resolution to 2.1.20.
 */
module.exports = function withKotlinFix(config) {
  return withProjectBuildGradle(config, (config) => {
    const contents = config.modResults.contents;

    const resolutionBlock = `
        configurations.all {
            resolutionStrategy {
                force "org.jetbrains.kotlin:kotlin-stdlib:2.1.20"
                force "org.jetbrains.kotlin:kotlin-stdlib-jdk7:2.1.20"
                force "org.jetbrains.kotlin:kotlin-stdlib-jdk8:2.1.20"
                force "org.jetbrains.kotlin:kotlin-gradle-plugin:2.1.20"
            }
        }`;

    // Jangan inject duplikat kalau sudah ada
    if (contents.includes('kotlin-stdlib:2.1.20')) {
      return config;
    }

    // Inject setelah opening brace dari buildscript block
    config.modResults.contents = contents.replace(
      /buildscript\s*\{/,
      `buildscript {${resolutionBlock}`
    );

    return config;
  });
};
