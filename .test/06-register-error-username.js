// carreguem les llibreries
const { BaseCordovaTest } = require("./BaseCordovaTest.js")
const { By, until } = require("selenium-webdriver");
const assert = require('assert');

// heredem una classe amb un sol mètode test()
// emprem this.driver per utilitzar Selenium

class MyTest extends BaseCordovaTest
{
	async test() {
        // introduim nou usuari
        //////////////////////////////////////////////////////
        let driver = this.driver;
        let nouusuari = "random";
        let novacontrasenya = "mesrandom";
        let nouemail = "encaramesrandom";
        await driver.get("http://localhost:8000/browser/www/");
        await driver.findElement(By.id("reg_usuari")).sendKeys(nouusuari);
        await driver.findElement(By.id("reg_contrasenya_1")).sendKeys(novacontrasenya);
        await driver.findElement(By.id("reg_contrasenya_2")).sendKeys(novacontrasenya);
        await driver.findElement(By.id("reg_email")).sendKeys(nouemail);
        await driver.findElement(By.xpath("//button[text()='Registra']")).click();
        // comprovem que l'alert message és correcte
        await driver.wait(until.alertIsPresent(),2000,"ERROR TEST: després del REGISTRE ha d'aparèixer un alert amb el resultat de la introducció del nou usuari.");
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        let assertMessage = "Nou usuari registrat correctament";
        assert(alertText==assertMessage,"ERROR TEST: al registrar un nou usuari hauria d'aparèixer un alert amb el missatge '"+assertMessage+"'.");
        await alert.accept();

        // Si intentem tornar-lo a registrar, ha de donar error de nom d'usuari
        await driver.findElement(By.xpath("//button[text()='Registra']")).click();
        // comprovem que l'alert message és correcte
        await driver.wait(until.alertIsPresent(),2000,"ERROR TEST: després del REGISTRE ha d'aparèixer un alert amb el resultat de la introducció del nou usuari.");
        alert = await driver.switchTo().alert();
        alertText = await alert.getText();
        assertMessage = "El nom o l'email ja existeix a la base de dades";
        assert(alertText==assertMessage,"ERROR TEST: al registrar un nou usuari amb un nom o email ja present, hauria d'aparèixer un alert amb el missatge '"+assertMessage+"'. TEXT="+alertText);
        await alert.accept();

        console.log("TEST OK");
    }
}

// executem el test

(async function test_example() {
	const test = new MyTest();
	await test.run();
	console.log("END")
})();

