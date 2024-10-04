async function exportData() {
    const { jsPDF } = window.jspdf;

    // Check if jsPDF is available
    if (!jsPDF) {
        console.error('jsPDF library not loaded.');
        return;
    }

    // Capture the HTML content
    html2canvas(document.getElementById('profile-content')).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const doc = new jsPDF();

        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        doc.save('employee-profile.pdf');
    }).catch(error => {
        console.error('Error generating PDF:', error);
    });
}