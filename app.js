let selectedTool = null;
let selectedFiles = [];

const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const processButton = document.getElementById("processButton");
const statusBox = document.getElementById("status");

const toolTitle = document.getElementById("toolTitle");
const toolDescription = document.getElementById("toolDescription");
const uploadTitle = document.getElementById("uploadTitle");
const uploadDescription = document.getElementById("uploadDescription");


/* =================================
   TOOL SELECTION
================================= */

function selectTool(tool) {

    selectedTool = tool;
    selectedFiles = [];

    fileInput.value = "";

    fileList.innerHTML = "";
    statusBox.innerHTML = "";

    processButton.disabled = true;

    if (tool === "Compress PDF") {

        toolTitle.textContent = "Compress PDF";

        toolDescription.textContent =
            "Reduce the size of your PDF.";

        uploadTitle.textContent =
            "Upload your PDF";

        uploadDescription.textContent =
            "Choose a PDF file.";

        fileInput.accept = ".pdf";

        fileInput.multiple = false;

        processButton.textContent =
            "Compress PDF →";

    }

    else if (tool === "Merge PDF") {

        toolTitle.textContent = "Merge PDF";

        toolDescription.textContent =
            "Combine multiple PDF files into one.";

        uploadTitle.textContent =
            "Upload your PDFs";

        uploadDescription.textContent =
            "Select two or more PDF files.";

        fileInput.accept = ".pdf";

        fileInput.multiple = true;

        processButton.textContent =
            "Merge PDFs →";

    }

    else if (tool === "Split PDF") {

        toolTitle.textContent = "Split PDF";

        toolDescription.textContent =
            "Extract selected pages from a PDF.";

        uploadTitle.textContent =
            "Upload your PDF";

        uploadDescription.textContent =
            "Choose the PDF you want to split.";

        fileInput.accept = ".pdf";

        fileInput.multiple = false;

        processButton.textContent =
            "Split PDF →";

    }

    else if (tool === "Image to PDF") {

        toolTitle.textContent = "Image → PDF";

        toolDescription.textContent =
            "Turn your images into a PDF.";

        uploadTitle.textContent =
            "Upload your images";

        uploadDescription.textContent =
            "Select one or more JPG or PNG images.";

        fileInput.accept =
            ".jpg,.jpeg,.png,.webp";

        fileInput.multiple = true;

        processButton.textContent =
            "Create PDF →";

    }

    else if (tool === "Compress Image") {

        toolTitle.textContent = "Compress Image";

        toolDescription.textContent =
            "Reduce image size while keeping it usable.";

        uploadTitle.textContent =
            "Upload your image";

        uploadDescription.textContent =
            "Choose a JPG, PNG or WebP image.";

        fileInput.accept =
            ".jpg,.jpeg,.png,.webp";

        fileInput.multiple = false;

        processButton.textContent =
            "Compress Image →";

    }

    else if (tool === "AI Professional Fix") {

        toolTitle.textContent =
            "AI Professional Document Fixer";

        toolDescription.textContent =
            "Automatically improve the appearance of your document.";

        uploadTitle.textContent =
            "AI Fixer is coming next";

        uploadDescription.textContent =
            "This will become our premium feature.";

        fileInput.accept = ".pdf";

        fileInput.multiple = false;

        processButton.textContent =
            "AI Fix →";

        processButton.disabled = true;

        statusBox.innerHTML =
            "<div class='info-message'>✨ AI Professional Fix is our next major feature.</div>";
    }

    document.getElementById("uploader").scrollIntoView({
        behavior: "smooth"
    });
}


/* =================================
   FILE SELECTION
================================= */

fileInput.addEventListener("change", function () {

    selectedFiles = Array.from(fileInput.files);

    fileList.innerHTML = "";

    if (selectedFiles.length === 0) {

        processButton.disabled = true;

        return;
    }


    selectedFiles.forEach((file) => {

        const item = document.createElement("div");

        item.className = "file-item";

        item.innerHTML =
            `<span>📄 ${file.name}</span>
             <span>${formatBytes(file.size)}</span>`;

        fileList.appendChild(item);

    });


    processButton.disabled = false;

});


/* =================================
   PROCESS FILES
================================= */

async function processFiles() {

    if (!selectedFiles.length) {

        showStatus(
            "Please choose a file first.",
            "error"
        );

        return;
    }


    processButton.disabled = true;

    showStatus(
        "⏳ FixMyFile is processing your file...",
        "loading"
    );


    try {

        if (selectedTool === "Merge PDF") {

            await mergePDFs();

        }

        else if (selectedTool === "Image to PDF") {

            await imagesToPDF();

        }

        else if (selectedTool === "Compress Image") {

            await compressImage();

        }

        else if (selectedTool === "Split PDF") {

            await splitPDF();

        }

        else if (selectedTool === "Compress PDF") {

            await compressPDF();

        }

    }

    catch (error) {

        console.error(error);

        showStatus(
            "Something went wrong. Please try another file.",
            "error"
        );

    }

    processButton.disabled = false;

}


/* =================================
   MERGE PDFs
================================= */

async function mergePDFs() {

    if (selectedFiles.length < 2) {

        showStatus(
            "Please select at least 2 PDF files.",
            "error"
        );

        return;
    }


    const mergedPDF =
        await PDFLib.PDFDocument.create();


    for (const file of selectedFiles) {

        const bytes =
            await file.arrayBuffer();

        const pdf =
            await PDFLib.PDFDocument.load(bytes);

        const pages =
            await mergedPDF.copyPages(
                pdf,
                pdf.getPageIndices()
            );

        pages.forEach(page => {
            mergedPDF.addPage(page);
        });

    }


    const result =
        await mergedPDF.save();


    downloadFile(
        result,
        "FixMyFile-Merged.pdf",
        "application/pdf"
    );


    showStatus(
        "✅ PDFs successfully merged!",
        "success"
    );
}


/* =================================
   IMAGE → PDF
================================= */

async function imagesToPDF() {

    const pdf =
        await PDFLib.PDFDocument.create();


    for (const file of selectedFiles) {

        const imageBytes =
            await file.arrayBuffer();

        let image;


        if (
            file.type === "image/jpeg" ||
            file.type === "image/jpg"
        ) {

            image =
                await pdf.embedJpg(imageBytes);

        }

        else {

            image =
                await pdf.embedPng(imageBytes);

        }


        const imageWidth =
            image.width;

        const imageHeight =
            image.height;


        const page =
            pdf.addPage([
                imageWidth,
                imageHeight
            ]);


        page.drawImage(image, {

            x: 0,
            y: 0,

            width: imageWidth,
            height: imageHeight

        });

    }


    const result =
        await pdf.save();


    downloadFile(
        result,
        "FixMyFile-Images.pdf",
        "application/pdf"
    );


    showStatus(
        "✅ PDF created successfully!",
        "success"
    );
}


/* =================================
   IMAGE COMPRESSION
================================= */

async function compressImage() {

    const file =
        selectedFiles[0];


    const image =
        await loadImage(file);


    const canvas =
        document.createElement("canvas");


    const maxWidth = 1600;


    let width =
        image.width;

    let height =
        image.height;


    if (width > maxWidth) {

        height =
            height * maxWidth / width;

        width =
            maxWidth;

    }


    canvas.width = width;
    canvas.height = height;


    const ctx =
        canvas.getContext("2d");


    ctx.drawImage(
        image,
        0,
        0,
        width,
        height
    );


    canvas.toBlob(

        function(blob) {

            downloadFile(
                blob,
                "FixMyFile-Compressed.jpg",
                "image/jpeg"
            );


            showStatus(
                "✅ Image compressed successfully!",
                "success"
            );

        },

        "image/jpeg",

        0.75

    );

}


/* =================================
   SPLIT PDF
================================= */

async function splitPDF() {

    const file =
        selectedFiles[0];


    const bytes =
        await file.arrayBuffer();


    const sourcePDF =
        await PDFLib.PDFDocument.load(bytes);


    const pageCount =
        sourcePDF.getPageCount();


    if (pageCount < 2) {

        showStatus(
            "This PDF only contains one page.",
            "error"
        );

        return;
    }


    /*
       MVP behaviour:
       Create a separate PDF for every page.
    */

    for (
        let i = 0;
        i < pageCount;
        i++
    ) {

        const newPDF =
            await PDFLib.PDFDocument.create();


        const [page] =
            await newPDF.copyPages(
                sourcePDF,
                [i]
            );


        newPDF.addPage(page);


        const result =
            await newPDF.save();


        downloadFile(
            result,
            `FixMyFile-Page-${i + 1}.pdf`,
            "application/pdf"
        );

    }


    showStatus(
        `✅ Split complete! ${pageCount} pages created.`,
        "success"
    );
}


/* =================================
   PDF COMPRESSION
================================= */

async function compressPDF() {

    const file =
        selectedFiles[0];


    const bytes =
        await file.arrayBuffer();


    const pdf =
        await PDFLib.PDFDocument.load(bytes);


    /*
       Initial MVP optimization.

       This rewrites the PDF using
       compressed object streams.

       Later we will add true
       image downsampling/raster
       compression.
    */

    const result =
        await pdf.save({
            useObjectStreams: true
        });


    downloadFile(
        result,
        "FixMyFile-Optimized.pdf",
        "application/pdf"
    );


    showStatus(
        "✅ PDF optimized successfully!",
        "success"
    );
}


/* =================================
   IMAGE LOADER
================================= */

function loadImage(file) {

    return new Promise((resolve, reject) => {

        const image =
            new Image();


        image.onload =
            () => resolve(image);


        image.onerror =
            reject;


        image.src =
            URL.createObjectURL(file);

    });

}


/* =================================
   DOWNLOAD
================================= */

function downloadFile(
    data,
    filename,
    type
) {

    const blob =
        data instanceof Blob
            ? data
            : new Blob(
                [data],
                { type: type }
            );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        filename;


    document.body.appendChild(link);

    link.click();

    link.remove();


    URL.revokeObjectURL(url);

}


/* =================================
   STATUS
================================= */

function showStatus(
    message,
    type
) {

    statusBox.className =
        "status " + type;

    statusBox.textContent =
        message;

}


/* =================================
   FILE SIZE
================================= */

function formatBytes(bytes) {

    if (bytes === 0)
        return "0 Bytes";


    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];


    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );


    return (
        parseFloat(
            (
                bytes /
                Math.pow(1024, index)
            ).toFixed(2)
        )
        + " "
        + units[index]
    );

}