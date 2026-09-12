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
   PDF.JS CONFIGURATION
================================= */

if (typeof pdfjsLib !== "undefined") {

    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

}


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


    /* ===============================
       COMPRESS PDF
    =============================== */

    if (tool === "Compress PDF") {

        toolTitle.textContent = "Compress PDF";

        toolDescription.textContent =
            "Reduce PDF file size while keeping the document readable.";

        uploadTitle.textContent =
            "Upload your PDF";

        uploadDescription.textContent =
            "Best for scanned PDFs, image-heavy PDFs and large documents.";

        fileInput.accept = ".pdf";

        fileInput.multiple = false;

        processButton.textContent =
            "Compress PDF →";

    }


    /* ===============================
       MERGE PDF
    =============================== */

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


    /* ===============================
       SPLIT PDF
    =============================== */

    else if (tool === "Split PDF") {

        toolTitle.textContent = "Split PDF";

        toolDescription.textContent =
            "Separate every page of your PDF into individual files.";

        uploadTitle.textContent =
            "Upload your PDF";

        uploadDescription.textContent =
            "Choose the PDF you want to split.";

        fileInput.accept = ".pdf";

        fileInput.multiple = false;

        processButton.textContent =
            "Split PDF →";

    }


    /* ===============================
       IMAGE → PDF
    =============================== */

    else if (tool === "Image to PDF") {

        toolTitle.textContent = "Image → PDF";

        toolDescription.textContent =
            "Turn JPG, PNG or WebP images into a PDF.";

        uploadTitle.textContent =
            "Upload your images";

        uploadDescription.textContent =
            "Select one or more images.";

        fileInput.accept =
            ".jpg,.jpeg,.png,.webp";

        fileInput.multiple = true;

        processButton.textContent =
            "Create PDF →";

    }


    /* ===============================
       IMAGE COMPRESSION
    =============================== */

    else if (tool === "Compress Image") {

        toolTitle.textContent = "Compress Image";

        toolDescription.textContent =
            "Reduce image size while keeping good quality.";

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


    /* ===============================
       PDF → JPG
    =============================== */

    else if (tool === "PDF to JPG") {

        toolTitle.textContent = "PDF → JPG";

        toolDescription.textContent =
            "Convert every PDF page into a high-quality JPG image.";

        uploadTitle.textContent =
            "Upload your PDF";

        uploadDescription.textContent =
            "Every page will be converted and downloaded as a ZIP.";

        fileInput.accept = ".pdf";

        fileInput.multiple = false;

        processButton.textContent =
            "Convert to JPG →";

    }

    else if (tool === "PDF to Word") {

    toolTitle.textContent = "PDF → Word";

    toolDescription.textContent =
        "Convert PDF text into an editable Word document.";

    uploadTitle.textContent =
        "Upload your PDF";

    uploadDescription.textContent =
        "Text will be extracted and placed into an editable Word document.";

    fileInput.accept = ".pdf";

    fileInput.multiple = false;

    processButton.textContent =
        "Convert to Word →";
}


    /* ===============================
       AI PROFESSIONAL FIX
    =============================== */

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

    selectedFiles =
        Array.from(fileInput.files);

    fileList.innerHTML = "";

    if (selectedFiles.length === 0) {

        processButton.disabled = true;

        return;

    }


    selectedFiles.forEach((file) => {

        const item =
            document.createElement("div");

        item.className =
            "file-item";

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

        else if (selectedTool === "PDF to JPG") {

            await pdfToJPG();

        }

        else if (selectedTool === "PDF to Word") {

    await pdfToWord();

        }

    }

    catch (error) {

        console.error(error);

        showStatus(
            "Something went wrong. Please try another file.",
            "error"
        );

    }

    finally {

        if (selectedTool !== "AI Professional Fix") {

            processButton.disabled = false;

        }

    }

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

            /*
              PNG and WebP are first converted
              to PNG through the browser canvas.
            */

            const converted =
                await imageFileToPNG(file);

            image =
                await pdf.embedPng(
                    converted
                );

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
            height *
            maxWidth /
            width;

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


    const blob =
        await canvasToBlob(
            canvas,
            "image/jpeg",
            0.75
        );


    downloadFile(
        blob,
        "FixMyFile-Compressed.jpg",
        "image/jpeg"
    );


    showStatus(
        "✅ Image compressed successfully!",
        "success"
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
       Create a ZIP instead of triggering
       many individual browser downloads.
    */

    const zip =
        new JSZip();


    for (
        let i = 0;
        i < pageCount;
        i++
    ) {

        showStatus(
            `⏳ Splitting page ${i + 1} of ${pageCount}...`,
            "loading"
        );


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


        zip.file(
            `FixMyFile-Page-${i + 1}.pdf`,
            result
        );

    }


    const zipBlob =
        await zip.generateAsync({
            type: "blob"
        });


    downloadFile(
        zipBlob,
        "FixMyFile-Split-Pages.zip",
        "application/zip"
    );


    showStatus(
        `✅ Split complete! ${pageCount} pages are inside the ZIP.`,
        "success"
    );

}


/* =================================
   TRUE PDF COMPRESSION
================================= */

async function compressPDF() {

    const file =
        selectedFiles[0];


    const originalBytes =
        await file.arrayBuffer();


    const originalSize =
        originalBytes.byteLength;


    showStatus(
        "⏳ Analyzing PDF pages...",
        "loading"
    );


    /*
       First create a normal optimized copy.
       This is useful for PDFs that contain
       mostly vector/text content.
    */

    const originalPDF =
        await PDFLib.PDFDocument.load(
            originalBytes
        );


    const structuralResult =
        await originalPDF.save({
            useObjectStreams: true
        });


    /*
       Now create an image-compressed version.
       This is particularly useful for scanned
       and image-heavy PDFs.
    */

    const pdfJS =
        await pdfjsLib.getDocument({
            data: originalBytes
        }).promise;


    const compressedPDF =
        await PDFLib.PDFDocument.create();


    for (
        let pageNumber = 1;
        pageNumber <= pdfJS.numPages;
        pageNumber++
    ) {

        showStatus(
            `⏳ Compressing page ${pageNumber} of ${pdfJS.numPages}...`,
            "loading"
        );


        const page =
            await pdfJS.getPage(
                pageNumber
            );


        const baseViewport =
            page.getViewport({
                scale: 1
            });


        /*
           Keep the rendered page reasonably small
           so very large scanned pages don't crash
           the browser.
        */

        const maxPixels =
            4000000;


        const normalScale = 1.25;


        let scale =
            normalScale;


        const estimatedPixels =
            baseViewport.width *
            baseViewport.height *
            scale *
            scale;


        if (
            estimatedPixels >
            maxPixels
        ) {

            scale =
                Math.sqrt(
                    maxPixels /
                    (
                        baseViewport.width *
                        baseViewport.height
                    )
                );

        }


        scale =
            Math.max(
                0.5,
                scale
            );


        const viewport =
            page.getViewport({
                scale: scale
            });


        const canvas =
            document.createElement("canvas");


        canvas.width =
            Math.ceil(viewport.width);

        canvas.height =
            Math.ceil(viewport.height);


        const context =
            canvas.getContext(
                "2d",
                {
                    alpha: false
                }
            );


        context.fillStyle =
            "#ffffff";

        context.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;


        /*
           JPEG quality 0.65 gives a useful
           compression level for scanned PDFs.
        */

        const jpegBlob =
            await canvasToBlob(
                canvas,
                "image/jpeg",
                0.65
            );


        const jpegBytes =
            await jpegBlob.arrayBuffer();


        const image =
            await compressedPDF.embedJpg(
                jpegBytes
            );


        /*
           PDF points are based on the
           unscaled viewport.
        */

        const outputPage =
            compressedPDF.addPage([
                baseViewport.width,
                baseViewport.height
            ]);


        outputPage.drawImage(
            image,
            {
                x: 0,
                y: 0,

                width:
                    baseViewport.width,

                height:
                    baseViewport.height
            }
        );


        canvas.width = 1;

        canvas.height = 1;

    }


    const rasterResult =
        await compressedPDF.save({
            useObjectStreams: true
        });


    /*
       Choose whichever version is actually
       smaller.
    */

    let finalResult =
        structuralResult;

    let method =
        "optimized";


    if (
        rasterResult.byteLength <
        structuralResult.byteLength
    ) {

        finalResult =
            rasterResult;

        method =
            "image compression";

    }


    /*
       If neither method actually reduces the
       file, don't pretend that compression worked.
    */

    if (
        finalResult.byteLength >=
        originalSize
    ) {

        downloadFile(
            originalBytes,
            "FixMyFile-Compressed.pdf",
            "application/pdf"
        );


        showStatus(
            `⚠️ This PDF could not be made smaller. The original file was downloaded unchanged (${formatBytes(originalSize)}).`,
            "error"
        );

        return;

    }


    const savedBytes =
        originalSize -
        finalResult.byteLength;


    const savedPercent =
        (
            savedBytes /
            originalSize *
            100
        ).toFixed(1);


    downloadFile(
        finalResult,
        "FixMyFile-Compressed.pdf",
        "application/pdf"
    );


    showStatus(
        `✅ PDF compressed! ${formatBytes(originalSize)} → ${formatBytes(finalResult.byteLength)} (${savedPercent}% smaller).`,
        "success"
    );

}


/* =================================
   PDF → JPG
================================= */

async function pdfToJPG() {

    const file =
        selectedFiles[0];


    const bytes =
        await file.arrayBuffer();


    const pdf =
        await pdfjsLib.getDocument({
            data: bytes
        }).promise;


    const zip =
        new JSZip();


    for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
    ) {

        showStatus(
            `⏳ Converting page ${pageNumber} of ${pdf.numPages}...`,
            "loading"
        );


        const page =
            await pdf.getPage(
                pageNumber
            );


        const baseViewport =
            page.getViewport({
                scale: 1
            });


        const maxPixels =
            8000000;


        let scale =
            1.5;


        const estimatedPixels =
            baseViewport.width *
            baseViewport.height *
            scale *
            scale;


        if (
            estimatedPixels >
            maxPixels
        ) {

            scale =
                Math.sqrt(
                    maxPixels /
                    (
                        baseViewport.width *
                        baseViewport.height
                    )
                );

        }


        const viewport =
            page.getViewport({
                scale: scale
            });


        const canvas =
            document.createElement("canvas");


        canvas.width =
            Math.ceil(viewport.width);

        canvas.height =
            Math.ceil(viewport.height);


        const context =
            canvas.getContext(
                "2d",
                {
                    alpha: false
                }
            );


        context.fillStyle =
            "#ffffff";

        context.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;


        const jpgBlob =
            await canvasToBlob(
                canvas,
                "image/jpeg",
                0.90
            );


        zip.file(
            `FixMyFile-Page-${pageNumber}.jpg`,
            jpgBlob
        );


        canvas.width = 1;

        canvas.height = 1;

    }


    showStatus(
        "⏳ Creating ZIP file...",
        "loading"
    );


    const zipBlob =
        await zip.generateAsync({
            type: "blob"
        });


    downloadFile(
        zipBlob,
        "FixMyFile-PDF-to-JPG.zip",
        "application/zip"
    );


    showStatus(
        `✅ PDF converted successfully! ${pdf.numPages} JPG images are inside the ZIP.`,
        "success"
    );

}


/* =================================
   IMAGE FILE → PNG
================================= */

async function imageFileToPNG(file) {

    const image =
        await loadImage(file);


    const canvas =
        document.createElement("canvas");


    canvas.width =
        image.width;

    canvas.height =
        image.height;


    const context =
        canvas.getContext("2d");


    context.drawImage(
        image,
        0,
        0
    );


    const blob =
        await canvasToBlob(
            canvas,
            "image/png"
        );


    return blob.arrayBuffer();

}


/* =================================
   LOAD IMAGE
================================= */

function loadImage(file) {

    return new Promise(
        (resolve, reject) => {

            const image =
                new Image();


            const url =
                URL.createObjectURL(file);


            image.onload =
                () => {

                    URL.revokeObjectURL(
                        url
                    );

                    resolve(image);

                };


            image.onerror =
                () => {

                    URL.revokeObjectURL(
                        url
                    );

                    reject(
                        new Error(
                            "Unable to load image."
                        )
                    );

                };


            image.src =
                url;

        }
    );

}


/* =================================
   CANVAS → BLOB
================================= */

function canvasToBlob(
    canvas,
    type,
    quality
) {

    return new Promise(
        (resolve, reject) => {

            canvas.toBlob(
                blob => {

                    if (!blob) {

                        reject(
                            new Error(
                                "Could not create image."
                            )
                        );

                        return;

                    }

                    resolve(blob);

                },
                type,
                quality
            );

        }
    );

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
                {
                    type: type
                }
            );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement("a");


    link.href =
        url;


    link.download =
        filename;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    /*
       Give the browser a moment before
       releasing the object URL.
    */

    setTimeout(
        () => {
            URL.revokeObjectURL(
                url
            );
        },
        1000
    );

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

    if (bytes === 0) {

        return "0 Bytes";

    }


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
                Math.pow(
                    1024,
                    index
                )
            ).toFixed(2)
        )
        + " "
        + units[index]
    );

}

/* =================================
   PDF → WORD
================================= */

async function pdfToWord() {

    const file = selectedFiles[0];

    const bytes =
        await file.arrayBuffer();

    if (
        typeof pdfjsLib === "undefined" ||
        typeof docx === "undefined"
    ) {

        throw new Error(
            "Required conversion libraries are not loaded."
        );

    }


    showStatus(
        "⏳ Reading PDF text...",
        "loading"
    );


    const pdf =
        await pdfjsLib.getDocument({
            data: bytes
        }).promise;


    const children = [];


    for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
    ) {

        showStatus(
            `⏳ Reading page ${pageNumber} of ${pdf.numPages}...`,
            "loading"
        );


        const page =
            await pdf.getPage(
                pageNumber
            );


        const textContent =
            await page.getTextContent();


        /*
           PDF.js gives us individual text
           fragments. We group them into
           lines using their Y position.
        */

        const lines = [];

        const tolerance = 4;


        for (
            const item of textContent.items
        ) {

            if (
                !item.str ||
                !item.str.trim()
            ) {

                continue;

            }


            const x =
                item.transform[4];

            const y =
                item.transform[5];


            let line =
                lines.find(
                    existingLine =>
                        Math.abs(
                            existingLine.y - y
                        ) <= tolerance
                );


            if (!line) {

                line = {
                    y: y,
                    items: []
                };

                lines.push(line);

            }


            line.items.push({
                x: x,
                text: item.str
            });

        }


        /*
           Sort lines from top to bottom.
           PDF coordinates start from the
           bottom, so larger Y comes first.
        */

        lines.sort(
            (a, b) =>
                b.y - a.y
        );


        for (
            const line of lines
        ) {

            /*
               Put text fragments in their
               left-to-right order.
            */

            line.items.sort(
                (a, b) =>
                    a.x - b.x
            );


            let lineText = "";


            for (
                let i = 0;
                i < line.items.length;
                i++
            ) {

                const current =
                    line.items[i];

                const previous =
                    line.items[i - 1];


                if (
                    previous &&
                    current.x -
                    (
                        previous.x +
                        estimateTextWidth(
                            previous.text
                        )
                    ) > 8
                ) {

                    lineText += " ";

                }


                lineText +=
                    current.text;

            }


            lineText =
                lineText
                    .replace(/\s+/g, " ")
                    .trim();


            if (!lineText) {

                continue;

            }


            /*
               Basic heading detection.
               This isn't intended to perfectly
               reproduce every PDF layout, but
               gives common documents a cleaner
               Word structure.
            */

            const isHeading =
                lineText.length < 80 &&
                (
                    lineText ===
                    lineText.toUpperCase()
                    ||
                    lineText.endsWith(":")
                );


            children.push(
                new docx.Paragraph({

                    children: [
                        new docx.TextRun({
                            text: lineText,
                            bold: isHeading,
                            size: isHeading
                                ? 26
                                : 22
                        })
                    ],

                    spacing: {
                        after: isHeading
                            ? 180
                            : 100
                    }

                })
            );

        }


        /*
           Add a page break between
           original PDF pages.
        */

        if (
            pageNumber <
            pdf.numPages
        ) {

            children.push(
                new docx.Paragraph({
                    children: [
                        new docx.PageBreak()
                    ]
                })
            );

        }

    }


    if (!children.length) {

        throw new Error(
            "No selectable text was found in this PDF."
        );

    }


    showStatus(
        "⏳ Creating editable Word document...",
        "loading"
    );


    const document =
        new docx.Document({

            sections: [
                {
                    properties: {},
                    children: children
                }
            ]

        });


    const blob =
        await docx.Packer.toBlob(
            document
        );


    downloadFile(
        blob,
        "FixMyFile-PDF-to-Word.docx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );


    showStatus(
        "✅ PDF converted to an editable Word document!",
        "success"
    );

}


/* =================================
   ESTIMATE TEXT WIDTH
================================= */

function estimateTextWidth(text) {

    /*
       Approximate PDF text width.
       Used only to determine whether
       a visible space exists between
       separate text fragments.
    */

    return text.length * 5;

}