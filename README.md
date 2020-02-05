<p align="center">
<img src= "https://github.com/arjun436/SoapTesting_TypeScript/blob/master/SoapServices_Typescript/image/soap.png"/>
</p>

<p align="center">
   <i><strong>This project demonstrates the basic SoapTesting-typescript-ExtetnReports framework project setup.
</strong></i>
<p>

<p align="center">
<a href="https://opensource.org/licenses/MIT"><img alt="MIT License" src="https://img.shields.io/dub/l/vibe-d.svg"></a>
</p>

---


### SoapTesting-typescript-ExtetnReports Setup Guide   

### Features
* Soap services testing using typescript
* No typings.json or typings folder, they have been replaced by better **'@types'** modules in package.json.
* All scripts written with > Typescript2.0.
* Neat folder structures with transpiled js files in separate output folder.
* Page Object design pattern implementation.
* Allure Reporting
* Screenshots on failure feature scenarios.

## Table of Contents (Optional)

- [Preconditions](#Preconditions)
- [MAVEN_Dependencies](#MAVEN_Dependencies)
- [SetUp](#SetUp)
- [Configuration](#Configuration)
- [Results](#Results)
- [Support](#Support)

---

## Preconditions
```bash
- Maven 
- Java 8
- Cucumber Eclipse plugin
- NodeJS installed globally in the system.
https://nodejs.org/en/download/
- Chrome or Firefox browsers installed.
```

## MAVEN_Dependencies
Add the following dependencies to your `pom.xml`
All below dependencies are compatible.

```maven
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-1nstance "
	xsi:schemaLocation="http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<groupId>ru.yandex.allure</groupId>
	<artifactId>protractor</artifactId>
	<version>1.0-SNAPSHOT</version>
	<properties>
		<allure.version>1.4.15</allure.version>
		<allure.maven.version>2.2</allure.maven.version>
		<!-- Relative to the dir you're running from -->
		<allure.results_pattern>allure-results</allure.results_pattern>
	</properties>
	<dependencies>
		<dependency>
			<groupId>ru.yandex.qatools.allure</groupId>
			<artifactId>allure-report-face</artifactId>
			<version>${allure.version}</version>
			<type>war</type>
		</dependency>
		<!-- https://mvnrepository.com/artifact/io.qameta.allure/allure-commandline -->
		<dependency>
			<groupId>io.qameta.allure</groupId>
			<artifactId>allure-commandline</artifactId>
			<version>2.13.1</version>
		</dependency>

	</dependencies>
	<build>
		<plugins>
			<plugin>
				<groupId>org.eclipse.jetty</groupId>
				<artifactId>jetty-maven-plugin</artifactId>
				<version>9.2.10.v20150310</version>
				<configuration>
					<webAppSourceDirectory>target/site/allure-
						maven-plugin
					</webAppSourceDirectory>
					<stopKey>stop</stopKey>
					<stopPort>2299</stopPort>
				</configuration>
			</plugin>
			<plugin>
				<groupId>io.qameta.allure</groupId>
				<artifactId>allure-maven</artifactId>
				<version>2.8</version>
				<configuration>
					<properties>
						<allure.issues.tracker.pattern>http://example.com/%s
						</allure.issues.tracker.pattern>
					</properties>
					<!-- <reportDirectory>allure-results</reportDirectory> -->
				</configuration>
			</plugin>
		</plugins>
	</build>
	<reporting>
		<excludeDefaults>true</excludeDefaults>
		<plugins>
			<plugin>
				<groupId>ru.yandex.qatools.allure</groupId>
				<artifactId>allure-maven-plugin</artifactId>
				<version>${allure.maven.version}</version>
				<configuration>
					<resultsPattern>${allure.results_pattern}</resultsPattern>
					<!--<reportVersion>l.4.15</reportVersion> -->
				</configuration>
			</plugin>
		</plugins>
	</reporting>
</project>
```

## SetUp
* Clone the repository into a folder
* Import the project as maven project
* Go inside the folder and run following command from terminal/command prompt
```
npm install 
```
* All the dependencies from package.json and ambient typings would be installed in node_modules folder.

#### Run Scripts

* First step is update the protractors webdriver if we are using any UI testing. 
* Then you can run test. 
* Then Generate allure report and Open it. Please look into package.json scripts section
```
npm run preprotractor && npm run test && npm run allureGenerate && npm run allureOpen '**
```

## Configuration

* Install ```npm i wdio-allure-reporter``` for allure reporting
* Install ```npm i easy-soap-request``` for soap webservices testing
* Include following script in package.json file
```
"scripts": {
		"preinstall": "npm cache clear",
		"test": "protractor protractor.conf.js",
		"allureGenerate": "allure generate allure-results -c",
		"allureOpen": "allure open allure-report",
		"preprotractor": "webdriver-manager update --versions.chrome=2.40 --versions.standalone=3.141.59 --ignore_ssl"
	},
```

* Demo script for Soap testing:

```
import { factory } from "../ConfigLog4j";

const reporter = require('wdio-allure-reporter')
const soapRequest = require( 'easy-soap-request' );
const fs = require( 'fs' );
const log = factory.getLogger( "protractor" );

// example data
//const url = 'http://10.87.31.253:8080/HIEServices/ClinicalV2XDS/vl';
const headerss = {
    //'user-agent': ' Apache-HttpClient/4.1.l (java l.5)',
    'Content-Type': 'text/xml;charset=UTF-8',//'application/soap+xml;charset=UTF-8;',
    'soapAction': 'http://tempuri.org/Add',

};

const xml = fs.readFileSync( 'TestData/add.xml', 'utf-8' );
const wsdlURL = 'http://www.dneonline.com/calculator.asmx?wsdl'; // WSDL from https://quicksoftwaretesting.com/sample-wsdl-urls-testing-soapui/

describe( "Test SOAP REQUEST TO ADD", function() {
    it( 'Soap test Add', async () => {
        try {
            reporter.feature('Feature')
            const { response } = await soapRequest( {
                url: wsdlURL,
                headers: headerss,
                xml: xml,
                timeout: 10000,

            } );

            const { body } = response;
            const { statusCode } = response;

            log.info( "status code :: " + statusCode );
            log.info( "response body :: " + body );

            expect( statusCode ).toEqual( 200 );
        } catch ( e ) {
            log.info( "Exception occurred : " + e );
        }
    } );
})

```

## Results

* Terminal Log
```
C:\Users\arjun\protractor\SoapServices_Typescript>npm run preprotractor && npm run test && npm run allureGenerate && npm run allureOpen

> soapservices_typescript@1.0.0 preprotractor C:\Users\arjun\protractor\SoapServices_Typescript
> webdriver-manager update --versions.chrome=2.40 --versions.standalone=3.141.59 --ignore_ssl

[19:49:23] I/http_utils - ignoring SSL certificate
[19:49:23] I/config_source - curl -ok C:\Users\arjun\protractor\SoapServices_Typescript\node_modules\protractor\node_modules\webdriver-manager\selenium\sta
ndalone-response.xml https://selenium-release.storage.googleapis.com/
[19:49:23] I/http_utils - ignoring SSL certificate
[19:49:23] I/config_source - curl -ok C:\Users\arjun\protractor\SoapServices_Typescript\node_modules\protractor\node_modules\webdriver-manager\selenium\chr
ome-response.xml https://chromedriver.storage.googleapis.com/
[19:49:23] I/http_utils - ignoring SSL certificate
[19:49:23] I/config_source - curl -ok C:\Users\arjun\protractor\SoapServices_Typescript\node_modules\protractor\node_modules\webdriver-manager\selenium\gec
ko-response.json https://api.github.com/repos/mozilla/geckodriver/releases
[19:49:25] I/http_utils - ignoring SSL certificate
[19:49:25] I/http_utils - ignoring SSL certificate
[19:49:25] I/http_utils - ignoring SSL certificate
[19:49:25] I/http_utils - ignoring SSL certificate
[19:49:25] I/http_utils - ignoring SSL certificate
[19:49:25] I/http_utils - ignoring SSL certificate
[19:49:25] I/update - chromedriver: file exists C:\Users\arjun\protractor\SoapServices_Typescript\node_modules\protractor\node_modules\webdriver-manager\se
lenium\chromedriver_2.40.zip
[19:49:25] I/update - chromedriver: unzipping chromedriver_2.40.zip
[19:49:25] I/update - chromedriver: chromedriver_2.40.exe up to date
[19:49:25] I/update - selenium standalone: file exists C:\Users\arjun\protractor\SoapServices_Typescript\node_modules\protractor\node_modules\webdriver-man
ager\selenium\selenium-server-standalone-3.141.59.jar
[19:49:25] I/update - selenium standalone: selenium-server-standalone-3.141.59.jar up to date
[19:49:27] I/update - geckodriver: file exists C:\Users\arjun\protractor\SoapServices_Typescript\node_modules\protractor\node_modules\webdriver-manager\sel
enium\geckodriver-v0.26.0.zip
[19:49:27] I/update - geckodriver: unzipping geckodriver-v0.26.0.zip
[19:49:27] I/update - geckodriver: geckodriver-v0.26.0.exe up to date

> soapservices_typescript@1.0.0 test C:\Users\arjun\protractor\SoapServices_Typescript
> protractor protractor.conf.js

[19:49:29] I/launcher - Running 1 instances of WebDriver
[19:49:29] I/direct - Using ChromeDriver directly...

DevTools listening on ws://127.0.0.1:57746/devtools/browser/eb053d46-ec0d-4928-aeaa-13a0a71f5fcd
Jasmine started
browserName: chrome
2020-02-05 19:49:32,300 INFO [protractor] Exception occurred : TypeError: _process2.default.send is not a function
undefined
undefined

  Test SOAP REQUEST TO ADD
    √ Soap test Add

2020-02-05 19:49:32,691 INFO [protractor] Exception occurred : TypeError: _process2.default.send is not a function
  Test SOAP REQUEST TO DIVIDE
    √ Soap test divide

2020-02-05 19:49:33,337 INFO [protractor] Exception occurred : TypeError: _process2.default.send is not a function
  Test SOAP REQUEST TO MULTIPLY
    √ Soap test Multiply

Executed 3 of 3 specs SUCCESS.
[19:49:34] I/launcher - 0 instance(s) of WebDriver still running
[19:49:34] I/launcher - chrome #01 passed

> soapservices_typescript@1.0.0 allureGenerate C:\Users\arjun\protractor\SoapServices_Typescript
> allure generate allure-results -c

Report successfully generated to allure-report

> soapservices_typescript@1.0.0 allureOpen C:\Users\arjun\protractor\SoapServices_Typescript
> allure open allure-report
```
Allure reports:

<img src= "https://github.com/arjun436/SoapTesting_TypeScript/blob/master/SoapServices_Typescript/image/Capture1.png"/>
</p>
<img src= "https://github.com/arjun436/SoapTesting_TypeScript/blob/master/SoapServices_Typescript/image/Capture2.png"/>
</p>
<img src= "https://github.com/arjun436/SoapTesting_TypeScript/blob/master/SoapServices_Typescript/image/Capture3.png"/>
</p>


## Support

Reach out to me at one of the following places!

- FaceBook at <a href="https://www.facebook.com/chinna.mir.3" target="_blank">`arjun`</a>
- Twitter at <a href="https://twitter.com/arjun436" target="_blank">`@arjun436`</a>

---
