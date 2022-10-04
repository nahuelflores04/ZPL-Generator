import escpos from "escpos";
import escnet from "escpos-network";
escpos.Network = escnet;

export const zpl_printer = async (zpl, ip, res) => {
  try {
    const networkDevice = new escpos.Network(ip);
    const networkPrinter = new escpos.Printer(networkDevice);

    networkDevice.open(() => {
      networkPrinter
        .text(zpl)
        .feed()
        .cut()
        .close(() => {
          console.log("Etiqueta lista");
        });
    });
  } catch (error) {
    console.log(error);
    res.render("error_admin");
  }
};
