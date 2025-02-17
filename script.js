function generateQR() {
    let text = document.getElementById("qrText").value;
    let qrContainer = document.getElementById("qr-code");
    qrContainer.innerHTML = ""; // Clear any previous QR code
    new QRCode(qrContainer, text); // Generate QR code
    
    setTimeout(() => {
        document.getElementById("downloadQR").style.display = "block"; // Show download button after QR code is generated
    }, 500);
}

function downloadQR() {
    let qrCanvas = document.querySelector("#qr-code canvas");
    if (qrCanvas) {
        let link = document.createElement("a");
        link.href = qrCanvas.toDataURL("image/png"); // Create image data URL from the QR canvas
        link.download = "qr-code.png"; // Set the file name for the downloaded image
        link.click(); // Trigger the download
    }
}

function startScanner() {
    const video = document.getElementById("camera");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const output = document.getElementById("output");

    // Access the device camera
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
            video.srcObject = stream; // Display video feed from the camera
            video.play(); // Start playing the video

            // Continuously scan for QR codes
            const scanInterval = setInterval(() => {
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    canvas.width = video.videoWidth; // Set canvas size to match video size
                    canvas.height = video.videoHeight;
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw the current frame onto the canvas
                    
                    // Get image data from the canvas
                    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    let code = jsQR(imageData.data, canvas.width, canvas.height); // Scan the QR code in the image data

                    if (code) {
                        // Display the scanned QR code data and stop scanning
                        output.textContent = "Scanned QR Code: " + code.data;
                        clearInterval(scanInterval); // Stop the scanning process once a code is detected
                    }
                }
            }, 300); // Scan every 300 milliseconds
        })
        .catch(err => {
            console.error("Camera access error: ", err);
            output.textContent = "Camera access failed. Please check your device permissions.";
        });
}
