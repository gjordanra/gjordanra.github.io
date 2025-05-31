document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const inputTextarea = document.getElementById('inputText');
    const languageSelect = document.getElementById('languageSelect');
    const toneSelect = document.getElementById('toneSelect');
    const convertButton = document.getElementById('convertButton');
    const outputTextarea = document.getElementById('outputText');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // Add event listener to the convert button
    convertButton.addEventListener('click', async () => {
        const textToConvert = inputTextarea.value.trim();
        const selectedLanguage = languageSelect.value;
        const selectedTone = toneSelect.value;

        // Basic validation
        if (!textToConvert) {
            outputTextarea.value = 'Please enter some text to convert.';
            return;
        }

        // Show loading indicator and disable button
        loadingIndicator.classList.remove('hidden');
        convertButton.disabled = true;
        outputTextarea.value = ''; // Clear previous output

        try {
            // Construct the prompt for the LLM
            const prompt = `Convert the following text to ${selectedLanguage} with a ${selectedTone} tone of voice. Ensure the output is natural and fluent in the target language and perfectly captures the requested tone.

            Text to convert:
            "${textToConvert}"

            Converted text:`;

            // Prepare the payload for the Gemini API
            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };

            // IMPORTANT: Leave apiKey as an empty string. Canvas will automatically provide it at runtime.
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            // Make the API call
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // Check if the response was successful
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                outputTextarea.value = `Error: Failed to convert text. Please try again. (Status: ${response.status})`;
                return;
            }

            const result = await response.json();

            // Extract the converted text from the API response
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const convertedText = result.candidates[0].content.parts[0].text;
                outputTextarea.value = convertedText;
            } else {
                outputTextarea.value = 'Could not get a valid response from the AI. Please try rephrasing or try again.';
            }

        } catch (error) {
            console.error('Fetch error:', error);
            outputTextarea.value = `An unexpected error occurred: ${error.message}. Please check your internet connection or try again.`;
        } finally {
            // Hide loading indicator and enable button
            loadingIndicator.classList.add('hidden');
            convertButton.disabled = false;
        }
    });
});
