const tsConfig = require("./tsconfig.json");
var {
    SpecReporter
} = require('jasmine-spec-reporter');
var jasmineReporters = require('jasmine-reporters');
var htmlReporter = require('protractor-html-reporter-2');
var fs = require('fs-extra');

exports.config = {
    // seleniumAddress : 'http://localhost:4444/wd/hub',
    directConnect: true,
    specs: ['./TestScripts/*.ts'],
    baseUrl: 'http://10,87.31.253:8080',
    allScriptsTimeout: 30000,
   
    //wdio-allure-reporter https://docs.qameta.io/allure/#_reporting
    reporters: ['allure'],
    reporterOptions: {
        allure: {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: true,
            useCucumberStepReporter: false
        }
    },
    
    // framework: 'jasmine2',

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 360000,
        includeStackTrace: true,
        isVerbose: false,
        print: function () {}
    },
    capabilities: {
        'browserName': 'chrome',
        chromeOptions: {
            w3c: false,
            useAutomationExtension: false,
            args: ["--no-sandbox --start-maximized --headless"] //--test-type --incognito
        }
    },
    onPrepare: function () {
        browser.getCapabilities().then(function (cap) {
            browser.browserName = cap.get('browserName');
            console.log('browserName:', browser.browserName);
        });
        // Angular sync for non angular apps
        browser.ignoreSynchronization = true;
        require('ts-node').register({
            project: './tsconfig.json'
        });
        require("tsconfig-paths").register({
            project: './tsconfig.json',
            baseUrl: './',
            paths: tsConfig.compilerOptions.paths
        });
        var AllureReporter = require('jasmine-allure-reporter');
        jasmine.getEnv().addReporter(new AllureReporter({
                resultsDir: 'allure-results'
            }));
        jasmine.getEnv().afterEach(function (done) {
            browser.takeScreenshot().then(function (png) {
                allure.createAttachment('Screenshot', function () {
                    return new Buffer.from(png, 'base64')
                }, 'image/png')();
                done();
            })
        });

        jasmine.getEnv().addReporter(new SpecReporter({
                spec: {
                    displayStacktrace: true
                },
                summary: {
                    displayDuration: false
                }
            }));

        fs.emptyDir('./reports/', function (err) {
            console.log(err);
        });

        fs.emptyDir('./allure-results/', function (err) {
            console.log(err);
        });

        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
                consolidateAll: true,
                savePath: './reports/xml/',
                filePrefix: 'xmlresults'

            }));

        jasmine.getEnv().addReporter({
            specDone: function (result) {
                browser.getCapabilities().then(function (caps) {
                    var browserName = caps.get('browserName');
                    if (!fs.existsSync('./reports/screenshots/')) {
                        fs.mkdirSync('./reports/screenshots/');

                    }
                    browser.takeScreenshot().then(function (png) {
                        var stream = fs.createWriteStream('./reports/screenshots/' + browserName + '-' + result.fullName + '.png');
                        stream.write(new Buffer.from(png, 'base64'));
                        stream.end();
                    }, function (error) {
                        console.log("failed to take screenshot");
                    });
                });
            }
        });

    },
    onComplete: function () {

        var browserName,
        browserVersion;
        var capsPromise = browser.getCapabilities();

        capsPromise.then(function (caps) {

            browserName = caps.get('browserName');

            browserVersion = caps.get('version');

            platform = caps.get('platform');

            testConfig = {
                reportTitle: 'Protractor Test Execution Report',
                outputPath: './reports/',
                outputFilename: 'ProtractorTestReport',
                screenshotPath: './screenshots',
                testBrowser: browserName,
                browserVersion: browserVersion,
                modifiedSuiteName: false,

                screenshotsOnlyOnFailure: false,
                testPlatform: platform
            };

            new htmlReporter().from('./reports/xml/xmlresults.xml', testConfig);
        });
    },
};
