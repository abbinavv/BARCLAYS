// Wait for the DOM to fully load before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Select DOM elements
    const analyzeBtn = document.getElementById('analyze-btn');
    const textInput = document.getElementById('text-input');
    const fileInput = document.getElementById('file-input');
    const resultSummary = document.getElementById('result-summary');
    const downloadLinks = document.getElementById('download-links');
    const downloadWord = document.getElementById('download-word');
    const downloadExcel = document.getElementById('download-excel');

    // Check if all required elements are found
    if (!analyzeBtn || !textInput || !fileInput || !resultSummary || !downloadLinks || !downloadWord || !downloadExcel) {
        console.error('One or more required DOM elements are missing.');
        return;
    }

    // Add click event listener to the "Analyze with AI" button
    analyzeBtn.addEventListener('click', () => {
        // Get input values
        const text = textInput.value.trim();
        const file = fileInput.files[0];

        // Validate input
        if (!text && !file) {
            alert('Please provide text or upload a document to analyze.');
            return;
        }

        // Show loading state
        analyzeBtn.disabled = true;
        analyzeBtn.textContent = 'Analyzing...';

        // Prepare data to send to the backend
        const formData = new FormData();
        if (text) {
            formData.append('text', text);
        }
        if (file) {
            formData.append('file', file);
        }

        // Send the data to the backend for analysis
        fetch('/process-input', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            // Check for errors in the response
            if (data.error) {
                throw new Error(data.error);
            }

            // Display the summary of extracted requirements
            let summaryText = 'Analysis Complete!\n';
            summaryText += 'Functional Requirements:\n';
            summaryText += data.requirements.functional.length > 0
                ? data.requirements.functional.join('\n') + '\n'
                : 'None identified.\n';
            summaryText += 'Non-Functional Requirements:\n';
            summaryText += data.requirements.non_functional.length > 0
                ? data.requirements.non_functional.join('\n') + '\n'
                : 'None identified.\n';
            summaryText += 'Priority (MoSCoW Method):\n';
            for (const [label, score] of Object.entries(data.requirements.priority)) {
                summaryText += `${label}: ${score}\n`;
            }

            // Display clarification questions if any
            if (data.requirements.clarifications && data.requirements.clarifications.length > 0) {
                summaryText += '\nClarifications Needed:\n';
                summaryText += data.requirements.clarifications.join('\n');
            }

            resultSummary.textContent = summaryText;

            // Trigger download for Word document
            fetch('/download-word', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requirements: data.requirements })
            })
            .then(res => res.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                downloadWord.href = url;
                downloadWord.style.display = 'block';
            })
            .catch(err => {
                console.error('Error downloading Word document:', err);
                alert('Error downloading Word document: ' + err.message);
            });

            // Trigger download for Excel file
            fetch('/download-excel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requirements: data.requirements })
            })
            .then(res => res.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                downloadExcel.href = url;
                downloadExcel.style.display = 'block';
            })
            .catch(err => {
                console.error('Error downloading Excel file:', err);
                alert('Error downloading Excel file: ' + err.message);
            });

            // Show the download links
            downloadLinks.style.display = 'block';
        })
        .catch(err => {
            console.error('Error during analysis:', err);
            resultSummary.textContent = 'Error during analysis: ' + err.message;
        })
        .finally(() => {
            // Reset the analyze button
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = 'Analyze with AI';
        });
    });
});