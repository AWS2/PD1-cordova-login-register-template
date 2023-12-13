const {Builder, Browser, By, Key, until} = require("selenium-webdriver");
const firefox = require('selenium-webdriver/firefox');
const chrome = require('selenium-webdriver/chrome');
const { spawn } = require("child_process");
const assert = require('assert');
const HEADLESS = process.env.HEADLESS=="true" ? true : false;
const CHROME_TESTS = process.env.CHROME_TESTS ? true : false;

console.log("HEADLESS="+HEADLESS)

// Engeguem server amb la APP
var cmd = null;
if( process.platform=="win32" ) {
    cmd = spawn("cordova", ["serve"],{shell:true});
} else {
    // linux, macos (darwin), or other
    cmd = spawn("cordova", ["serve"]);
}

cmd.stdout.on("data", data => {
    console.log(`stdout: ${data}`);
});
cmd.stderr.on("data", data => {
    console.log(`stderr: ${data}`);
});
cmd.on('error', (error) => {
    console.log(`error: ${error.message}`);
});
cmd.on("close", code => {
    console.log(`child process exited with code ${code}`);
});


// TESTS

(async function test_exemple() {
    // Configurem driver
    let firefoxOptions = new firefox.Options();
    let chromeOptions = new chrome.Options();
    if( HEADLESS ) {
        console.log("Running Headless Tests...")
        firefoxOptions = new firefox.Options().headless();
        chromeOptions = new chrome.Options().addArguments('--headless=new');
    }
    let driver = null;
    if( CHROME_TESTS ) {
        driver = await new Builder()
            .forBrowser(Browser.CHROME)
            .setChromeOptions(chromeOptions)
            .build();
    } else {
        driver = await new Builder()
            .forBrowser(Browser.FIREFOX)
            .setFirefoxOptions(firefoxOptions)
            .build();
    }

    try {
        // deixem temps a que el servidor es posi en marxa
        await driver.sleep(2000);

        // testejem LOGIN CORRECTE usuari predefinit
        //////////////////////////////////////////////////////
        await driver.get("http://localhost:8000/browser/www/");
        await driver.findElement(By.id("usuari")).sendKeys("ieti");
        await driver.findElement(By.id("contrasenya")).sendKeys("cordova");
        await driver.findElement(By.xpath("//button[text()='Login']")).click();

        // comprovem que l'alert message és correcte
        await driver.wait(until.alertIsPresent(),2000,"ERROR TEST: després del login ha d'aparèixer un alert amb el resultat de la validació de la contrasenya.");
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        let assertMessage = "Login exitós";
        assert(alertText==assertMessage,"ERROR TEST: l'usuari ieti/cordova hauria d'entrar amb el missatge '"+assertMessage+"' en un alert.");
        await alert.accept();

        console.log("TEST OK");

    } finally {
        // tanquem servidor
        if( process.platform=="win32" ) {
            spawn("taskkill", ["/pid", cmd.pid, '/f', '/t']);
        } else {
            // Linux, MacOS or other
            await cmd.kill("SIGHUP")
        }
        // tanquem browser
        await driver.quit();
    }

})();
