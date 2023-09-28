const userName = document.getElementById("name");
const submitBtn = document.getElementById("submitBtn");

const { PDFDocument, rgb } = PDFLib;

const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
    match.toUpperCase()
  );

submitBtn.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent the default form submission behavior

  const val = capitalize(userName.value);

  // Check if the text is empty or not
  if (val.trim() !== "" && userName.checkValidity()) {
    generatePDF(val);
  } else {
    userName.reportValidity();
  }
});

const generatePDF = async (name) => {
  const existingPdfBytes = await fetch("./sample_cert.pdf").then((res) =>
    res.arrayBuffer()
  );

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Get the first page of the document
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Draw a string of text diagonally across the first page
  firstPage.drawText(name, {
    x: 330,
    y: 310,
    size: 21,
    color: rgb(0.0, 0.0, 0.0),
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  console.log("Done creating");

  // Create a Blob containing the PDF data
  const blob = new Blob([pdfBytes], { type: "application/pdf" });

  // Create a download link for the Blob
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = `${name}.pdf`; // Set the filename for the download

  // Trigger a click event on the download link to start the download
  link.click();

  // Redirect to the congratulations page after a brief delay (e.g., 2 seconds)
  setTimeout(() => {
    window.location.href = "confirmation.html";
  }, 2000); // Adjust the delay time as needed
};
