const { GoogleGenAI, Modality } = require("@google/genai");
const fs = require("fs");
const { buffer } = require("stream/consumers");

async function main(image, prompt, style) {
  const ai = new GoogleGenAI({
    apiKey: process.env.IMAGE_AI_API,
  });

  // Load the image from the local file system
  // const imagePath = image;
  // const imageData = fs.readFileSync(imagePath);
  // const base64Image = imageData.toString("base64");

  let base64Image;

  // Handle both base64 input and file path input
  if (image.startsWith("data:image")) {
    base64Image = image.replace(/^data:image\/\w+;base64,/, "");
  } else {
    const imageData = fs.readFileSync(image);
    base64Image = imageData.toString("base64");
  }

  // Prepare the content parts
  const contents = [
    {
      text:
        prompt ||
        "Enhance the image quality and details. also make it's color more vibrant.",
    },
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image,
      },
    },
  ];

  const SystemInstructions = `
  User's want's Image in this Style : ${style}
  `;

  // Set responseModalities to include "Image" so the model can generate an image
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-preview-image-generation",
    contents: contents + SystemInstructions,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const imageData = part.inlineData.data; // Already base64 encoded by Gemini
      return `data:image/png;base64,${imageData}`;
    }
  }
}

module.exports = main;
