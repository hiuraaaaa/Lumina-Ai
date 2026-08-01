const { withAndroidStyles } = require('@expo/config-plugins');

module.exports = function withDarkBackground(config) {
  return withAndroidStyles(config, (config) => {
    const styles = config.modResults.resources.style;
    if (!Array.isArray(styles)) return config;

    const appTheme = styles.find(s => s?.$?.name === 'AppTheme');
    if (!appTheme) return config;

    appTheme.item = appTheme.item || [];
    appTheme.item = appTheme.item.filter(
      item => item?.$?.name !== 'android:windowBackground'
    );
    appTheme.item.push(
      { $: { name: 'android:windowBackground' }, _: '#08080a' },
    );

    return config;
  });
};
