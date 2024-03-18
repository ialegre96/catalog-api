const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const jsreport = require("jsreport")();
const handlebars = require("handlebars");
const app = express();

app.use(bodyParser.json());

jsreport
  .init()
  .then(() => {
    console.log("jsreport inicializado correctamente");
  })
  .catch((err) => {
    console.error("Error al inicializar jsreport:", err);
  });

app.post("/generar-pdf", async (req, res) => {
  try {
    const jsonData = req.body;

    // Leer el contenido del archivo template.html
    const templateHtml = fs.readFileSync("catalogo.html", "utf8");

    // Renderizar el PDF utilizando jsreport
    const response = await jsreport.render({
      template: {
        content: templateHtml,
        engine: "handlebars",
        recipe: "chrome-pdf",
      },
      data: jsonData,
    });

    // Configurar los encabezados de respuesta para indicar que se está enviando un PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="Catalogo.pdf"');

    // Enviar el PDF como respuesta al cliente
    res.send(response.content);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al generar el PDF");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
