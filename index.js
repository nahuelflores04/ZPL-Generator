var fs = require('fs');
var request = require('request');
const escpos = require('escpos');
escpos.Network = require('escpos-network')


var zpl = 
`

^XA

^FO90,15^GFA,2717,2717,19,,::::::Y018,X03FFC,X0JF,W03JF8,W07JFE,W0LF,V01LF8,V03LF8,V03LFC,V07LFE,::V0NF,::::::::V0MFE,V07LFE,:V03LFC,:V01LF8,W0LF,W07JFE,W03JFC,W01JF8,X07FFE,Y0FF,,::::P0LF8001LF,:O01LFC001LF8,O01LFC003LF8,:O03LFE007LFC,:O03LFE007LFE,O07MF00MFE,:O0NF80NF,O0NF81NF,:O0NFC1NF8,O0NFC0NF8,O07MFC0NF8,O07MFE0NFC,O07MFE07MFC,O03MFE07MFE,O03NF07MFE,O01NF03MFE,N081NF03NF,N0C1NF83NF,N0C0NF81NF,M01C0NFC1NF8,M01E0NFC1NF8,M01E07MFC0NFC,M03E07MFE0NFC,M03F07MFE07MFC,M07F03MFE07MFE,M07F03NF07MFE,M07F81NF03MFE,M0FF81NF03NF,M0FFC1NF83NF,M0FFC0NF81NF,L01FFC0NFC1NF8,L01FFE0NFC1NF8,L01FFE07MFC0NFC,L03FFE07MFE0NFC,L03IF07MFE07MFC,L03IF03MFE07MFE,L07IF83NF07MFE,L07IF83NF03MFE,L0JF81NF83NF,L0JFC1NF83NF,L0JFC0NF81NF,K01JFC0NFC1NF8,K01JFE0NFC0NF8,K01JFE07MFC0NF8,K03JFE07MFE0NFC,K03KF07MFE07MFC,K03KF03MFE07MFE,K07KF03NF07MFE,K07KF81NF03MFE,K0LF81NF03NF,K0LFC1NF83NF,K0LFC0NF81NF,J01LFC0NFC1NF8,J01LFE0NFC0NF8,J01LFE07MFC0NF8,J03LFE07MFE0NFC,J03MF07MFE07MFC,J03MF03MFE07MFE,J07MF03NF07MFE,J07MF81NF03MFE,J0NF81NF03NF,J0NFC1NF83NF,J0NFC0NF81NF,I01NFC0NFC1NF8,I01NFE0NFC1NF8,I01NFE07MFC0NFC,I03NFE07MFE0NFC,I03OF07MFE07MFC,I07OF03MFE07MFE,I07OF83NF07MFE,I07OF81NF03MFE,I0PF81NF83NF,I0PFC1NF83NF,I0PFC0NF81NF,001PFC0NFC1NF8,001PFE0NFC1NF8,003PFE07MFC0NF8,003PFE07MFE0NFC,003QF07MFE07MFC,007QF03MFE07MFE,007QF03NF07MFE,007QF81NF03MFE,00RF81NF83NF,00RFC1NF83NF,,::::::::^FS

^CF0,27
^FO270,40^FDMagna seating^FS
^CF0,23
^FO270,80^FDPART NUMBER.^FS
^FO270,120^FDPart number description^FS


^FX Second section with recipient address and permit information.
^CF0,23
^FO100,180^FDLinea de texto 1^FS
^FO100,220^FDLinea de texto 2^FS
^FO100,260^FDLinea de texto 3^FS


^FX Third section with bar code.
^BY5,2,100
^FO465,65^BQ,2,6^FD12345678^FS

^XZ
`


var options = {
    encoding: null,
    formData: { file: zpl },
    // omit this line to get PNG images back
    headers: { 'Accept': 'application/pdf' },
    // adjust print density (8dpmm), label width (4 inches), label height (6 inches), and label index (0) as necessary
    url: 'http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/'
    
};

request.post(options, function(err, resp, body){
    if (err) {
        return console.log(err);
    }
    var filename = 'nombre_archivo.ext'; // change file name for PNG images
    fs.writeFile(filename, body, function(err) {
        if (err) {
            console.log(err);
        }
        
        for(var i=0; i<3; i++){
            
            const networkDevice = new escpos.Network('INSERTAR IP');
            const networkPrinter = new escpos.Printer(networkDevice);

            networkDevice.open(() => {
            networkPrinter
                .text(zpl)
                .feed()
                .cut()  
                .close(() => {
                console.log('Terminado')
                });
            });
        };
    });
});