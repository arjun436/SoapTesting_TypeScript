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

const xml = fs.readFileSync( 'TestData/multiply.xml', 'utf-8' );
const wsdlURL = 'http://www.dneonline.com/calculator.asmx?wsdl'; // WSDL from https://quicksoftwaretesting.com/sample-wsdl-urls-testing-soapui/

describe( "Test SOAP REQUEST TO MULTIPLY", function() {
    it( 'Soap test Multiply', async () => {
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