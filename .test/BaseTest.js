const {Builder, Browser, By, Key, until} = require("selenium-webdriver");
const firefox = require('selenium-webdriver/firefox');
const chrome = require('selenium-webdriver/chrome');
const { spawn } = require("child_process");
const assert = require('assert');


class BaseTest {

	constructor() {
		this.headless = process.env.HEADLESS=="false" ? false : true;
		this.browser = process.env.CHROME_TESTS ? "chrome" : "firefox";
		this.cmd = null;
		this.driver = null;
	}
	
	async setUp() {
		console.log("HEADLESS:"+this.headless);
		console.log("BROWSER:"+this.browser);

		await this.setupDriver();
		//this.runServer( "cordova", ["serve"] );
		await this.driver.sleep(5000);
		resolve(this.driver);
	}

	async tearDown() {
		this.driver.sleep(2000);
		//this.stopServer();
		// tanquem browser
        await this.driver.quit();
	}

	async setupDriver() {
	    let firefoxOptions = new firefox.Options();
	    let chromeOptions = new chrome.Options();
	    if( this.headless ) {
	        console.log("Running Headless Tests...")
	        firefoxOptions = new firefox.Options().headless();
	        chromeOptions = new chrome.Options().addArguments('--headless=new');
	    }
	    if( this.browser=="chrome" ) {
	        this.driver = await new Builder()
	            .forBrowser(Browser.CHROME)
	            .setChromeOptions(chromeOptions)
	            .build();
	    } else {
	        this.driver = await new Builder()
	            .forBrowser(Browser.FIREFOX)
	            .setFirefoxOptions(firefoxOptions)
	            .build();
	    }
	}

	runServer( command, options ) {
		// Engeguem server amb la APP
		if( process.platform=="win32" ) {
		    this.cmd = spawn(command,options,{shell:true});
		} else {
		    // linux, macos (darwin), or other
		    this.cmd = spawn(command,options);
		}

		this.cmd.stdout.on("data", data => {
		    console.log(`stdout: ${data}`);
		});
		this.cmd.stderr.on("data", data => {
		    console.log(`stderr: ${data}`);
		});
		this.cmd.on('error', (error) => {
		    console.log(`error: ${error.message}`);
		});
		this.cmd.on("close", code => {
		    console.log(`child process exited with code ${code}`);
		});
	}

	async stopServer() {
        // tanquem servidor
        if( process.platform=="win32" ) {
            spawn("taskkill", ["/pid", cmd.pid, '/f', '/t']);
        } else {
            // Linux, MacOS or other
            await this.cmd.kill("SIGHUP")
        }
	}

}


const test = new BaseTest();
test.setUp();

//test.tearDown();
console.log("END")
