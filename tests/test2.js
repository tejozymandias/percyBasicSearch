const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const percySnapshot = require('@percy/selenium-webdriver');
const httpServer = require('http-server');
const spawn = require('child_process').spawn;
const server = httpServer.createServer();

const PORT = process.env.PORT_NUMBER || 8000;

server.listen(PORT);

async function cleanup({ driver, server, isError = 0 }) {
  driver && (await driver.quit());
  server && server.close();

  process.exit(isError);
}

(async function() {
  let driver;

  try {
    driver = await new Builder()
      .forBrowser('firefox').setFirefoxOptions(
        new firefox.Options().headless()
      ).build();

    async function googlePage() {
    await driver.get('https://www.google.com')
    let searchBox = await driver.findElement(By.name('q'));
    await searchBox.sendKeys('cats', Key.RETURN);
    await percySnapshot(driver, 'GoogleSearch Results');
    }


    await googlePage();
  } catch (error) {
    console.log(error);
    await cleanup({ driver, server, isError: 1 });
  } finally {
    await cleanup({ driver, server });
  }
})();
