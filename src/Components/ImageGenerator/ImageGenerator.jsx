import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import default_image from '../Assets/default_image.svg';

const ImageGenerator = () => {
    const [imageUrl, setImageUrl] = useState("/"); // State for the image URL
    const [loading, setLoading] = useState(false); // State to track loading
    const inputRef = useRef(null); // Ref for the input field

    const generateImage = async () => {
        const prompt = inputRef.current.value.trim();

        // Check if input is empty or just spaces
        if (!prompt) {
            alert("Please enter a valid description.");
            return;
        }
        const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
        console.log('API Key:', apiKey);
        console.log("hello")

        setLoading(true); // Set loading to true when making the request

        try {
            const response = await fetch(
                "https://api.openai.com/v1/images/generations", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // Use environment variable for API key
                        "User-Agent": "Chrome",
                    },
                    body: JSON.stringify({
                        prompt: prompt,
                        n: 1,
                        size: "512x512",
                    }),
                }
            );

            // Log the response status and headers for debugging
            console.log("Response Status:", response.status);
            console.log("Response Headers:", response.headers);
            console.log("API Key:", process.env.REACT_APP_OPENAI_API_KEY);


            // Try to get the response text if it's not a JSON error
            const responseText = await response.text();
            console.log("Response Text:", responseText);

            // If response is not OK, throw an error with more details
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.status} - ${responseText}`);
            }

            // Try parsing the JSON response
            const data = await response.json();
            const imageUrl = data?.data?.[0]?.url;

            if (imageUrl) {
                setImageUrl(imageUrl); // Set the image URL if found
            } else {
                alert("No image generated. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching image:", error);
            alert("Error fetching image. Please try again later.");
        } finally {
            setLoading(false); // Set loading to false when the request is finished
        }
    };

    return (
        <div className='ai-image-generator'>
            <div className='header'>AI Image Generator</div>
            <div className="img-loading">
                <div className="image">
                    {/* Display a loading message or image */}
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <img src={imageUrl === "/" ? default_image : imageUrl} alt="Generated" />
                    )}
                </div>
            </div>
            <div className="search-box">
                <input
                    type="text"
                    ref={inputRef}
                    className='search-input'
                    placeholder='Describe what you want'
                />
                <div className="generate-btn" onClick={generateImage}>
                    Generate
                </div>
            </div>
        </div>
    );
};

export default ImageGenerator; // Ensure default export here
