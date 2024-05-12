const app = require('./src/app')
const config = require('./src/utils/config')
app.listen(config.PORT, () => {
  console.log(`app is running @ port ${config.PORT}`);
});
