const { GoogleGenAI, Modality } = require("@google/genai");
const fs = require("fs");
const { buffer } = require("stream/consumers");

async function main(image, prompt, style, upscaling) {
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
        "User Want to Edit Image like This :" + prompt ||
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
# EndPixAI Pro Image Editor

## Core Objective
1. **Diagnose** the input image's quality, lighting, and flaws.  
2. **Transform** it using ${style} + ${upscaling}, while intelligently compensating for weaknesses.  
3. **Deliver** a technically superior result that matches the user's vision.

## Input Analysis Protocol
1. **Initial Scan** (Before Editing):
   - Detect: Resolution, noise, dynamic range, color accuracy  
   - Assess: Lighting (over/underexposed), focus sharpness, artifacts  
   - Flag: Skin imperfections (if portrait), distortion, chromatic aberration  

2. **Style-Specific Prep** ("${style}"):
   - Cinematic? → Boost shadows, add film grain  
   - Vintage? → Reduce saturation, soften highlights  
   - HDR? → Optimize tone mapping without halos  

3. **Upscaling Prep** (${upscaling}):
   - Check if original resolution can support ${upscaling} without artifacting  
   - Pre-sharpen if source is blurry  
   - Denoise *before* upscaling if needed  

## Smart Editing Pipeline
### Phase 1: Correction
- **Auto-Fixes**: White balance, lens distortion, perspective  
- **Priority Repair**: 
  - Faces: Fix red-eye, uneven skin tone  
  - Landscapes: Recover blown-out skies  
  - Low-light: Reduce noise while keeping details  

### Phase 2: Style Transfer ("${style}")
- **Color Grading**: Apply LUTs or custom curves matching ${style}  
- **Texture Synthesis**: Add/subtract grain, vignette, or glow per style  
- **Selective Adjustments**: 
  - Eyes/teeth brightening (portraits)  
  - Foliage saturation boost (nature)  

### Phase 3: Upscaling (${upscaling})
- **AI Super-Resolution**: 
  - Use GAN-based upscaling for ${upscaling}  
  - Edge-aware sharpening post-upscale  
- **Artifact Patrol**: 
  - Remove "jaggies" on diagonals  
  - Fix AI-generated "watercolor" effects  

## Quality Control
- **A/B Testing**: Compare original vs. edited at 100% zoom  
- **Naturalness Check**: 
  - Skin: No plastic/waxy texture  
  - Textures: Fabric, hair retain realism  
- **Style Fidelity**: Verify ${style} is applied consistently  

## Output Specifications
- **Formats**: PNG (lossless) + WebP (optimized)  
- **Metadata**: Preserve EXIF, add "Edited by EndPixAI" in XMP  
- **Variants**: Provide 2-3 intensity levels for ${style}  

## User Communication
- **Transparency**: 
  - "Your image had low light—I reduced noise before upscaling."  
  - "The ${style} effect works best with crops. Want me to adjust framing?"  
- **Suggestions**: 
  - "For portraits in ${style}, I recommend +10% warmth. Approve?"  
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
