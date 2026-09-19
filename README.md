# Break It. — AI Mind Map Generator 🧠

> **Transform. Understand. Remember.**

Break It. is a web application that transforms learning materials into interactive mind maps. Users can either upload a supported document/image or paste their own notes. The backend processes the material with the Gemini API and returns a structured mind map that is displayed using React Flow.

<img width="1506" height="1771" alt="breakit-project-09-19-2026_11_36_PM" src="https://github.com/user-attachments/assets/38aee8c3-dbfe-44ca-84af-707d54fbf7fe" />

## Features

- Upload learning materials:
  - PDF
  - DOCX
  - PPTX
  - TXT
  - JPG/JPEG
  - PNG
- Paste notes directly into the application.
- Frontend validation before requests are sent to the backend.
- AI-powered mind-map generation using Gemini.
- Structured mind-map output with:
  - Titles
  - Descriptions
  - Key points
  - Child/sub-concepts
- Automatic node positioning using Dagre.
- Interactive React Flow canvas.
- Expand/collapse nodes to reveal additional information.
- Manually drag and reposition nodes.
- Canvas fullscreen mode.
- Export the generated mind map as an image/PNG.
- Processing and error states shown in the interface.
- Backend rate limiting to reduce unnecessary AI requests.

---

## Tech Stack

### Frontend

- React
- Vite
- React Flow
- Dagre
- Axios
- React Dropzone
- Lucide React
- CSS

### Backend

- Node.js
- Express
- Google Gemini API
- Multer
- Mammoth
- PDF Parse
- OfficeParser
- Dagre
- Express Rate Limit
- CORS
- Dotenv

# Getting Started

## 1. Prerequisites

Install:

- Node.js
- npm
- A Google Gemini API key

Check Node.js and npm:

```bash
node --version
npm --version
```

---

# 2. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd BreakIt_Project
```

---

# 3. Install Frontend Dependencies

Open a terminal in the frontend folder:

```bash
cd frontend
npm install
```

If required dependencies have not already been installed:

```bash
npm install axios reactflow react-dropzone lucide-react @dagrejs/dagre
```

Start the frontend:

```bash
npm run dev
```

The Vite development server normally runs at:

```text
http://localhost:5173
```

---

# 4. Install Backend Dependencies

Open another terminal:

```bash
cd backend
npm install
```

The backend uses dependencies such as:

```text
express
cors
dotenv
multer
mammoth
officeparser
pdf-parse
@google/genai
@dagrejs/dagre
express-rate-limit
```

---

# 5. Configure the Gemini API Key

Create a `.env` file inside the `backend` folder:

```text
backend/
└── .env
```

Add:

```
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

```

Do **not** commit `.env` to Git.

Add this to `.gitignore`:

```gitignore
**/node_modules/
**/uploads/
**/.env
**/.env.*
```

The Gemini API key should remain on the backend and should never be placed directly in React/Vite frontend code.

---

# 6. Run Frontend and Backend Together

You need both servers running.

### Terminal 1 — Backend

```bash
cd backend
npm start
```

Expected:

```text
🚀 Server running on http://localhost:5000
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Expected:

```text
http://localhost:5173
```

The application flow is:

```text
React Frontend
      │
      │ Axios POST
      ▼
Express Backend
      │
      │ Extract / process material
      ▼
Gemini API
      │
      │ Structured mind-map data
      ▼
React Flow Formatter
      │
      │ Nodes + Edges
      ▼
React Flow Canvas
```

---

# API

## Generate Mind Map

### Endpoint

```text
POST /api/generate-mindmap
```

### Full local URL

```text
http://localhost:5000/api/generate-mindmap
```

### Request

The endpoint accepts `multipart/form-data`.

Possible fields:

```text
text
file
```

The frontend sends either:

- pasted text,
- a file,
- or the appropriate input depending on the selected mode.

### Example frontend request

```javascript
const formData = new FormData();

if (targetText) {
    formData.append("text", targetText);
}

if (targetFile) {
    formData.append("file", targetFile);
}

const response = await axios.post(
    "http://localhost:5000/api/generate-mindmap",
    formData,
    {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }
);
```

### Successful response

The backend returns:

```json
{
  "summary": "Summary of the learning material",
  "nodes": [],
  "edges": []
}
```

The frontend then updates:

```javascript
setNodes(response.data.nodes);
setEdges(response.data.edges);
setSummary(response.data.summary);
```

---

# Mind Map Generation

The backend performs several stages.

## 1. Validate the Input

The backend checks the submitted text/file before processing it.

```text
User input
    ↓
Validation
    ↓
Valid?
 ┌──┴──┐
No     Yes
↓       ↓
Error   Continue
```

The frontend also performs validation before making the API request.

This prevents empty submissions from unnecessarily reaching Gemini.

---

## 2. Extract Text

Uploaded files are processed by the backend.

The extraction service handles supported formats such as:

```text
PDF
DOCX
PPTX
TXT
Images
```

The extracted material is combined with any submitted text.

---

## 3. Generate the Mind Map

The combined material is passed to `geminiService.js`.

Gemini generates structured information representing the concepts and their relationships.

The application uses information such as:

```text
id
label
description
keyPoints
children
```

---

## 4. Convert to React Flow

`reactFlowFormatter.js` converts the generated tree into React Flow nodes and edges.

Dagre is used to automatically calculate node positions.

This means node positions do not need to be manually hard-coded.

Conceptually:

```text
Gemini Tree
     ↓
Dagre Layout
     ↓
React Flow Nodes
     +
React Flow Edges
```

---

# Interactive Nodes

Each mind-map node uses a custom React Flow node.

The node can display:

```text
+---------------------------+
| Topic                 [+] |
+---------------------------+
```

Clicking the `+` button expands the node:

```text
+---------------------------+
| Topic                 [-] |
|                           |
| Description               |
|                           |
| Key Points                |
| • Point 1                 |
| • Point 2                 |
| • Point 3                 |
+---------------------------+
```

The node can also be manually dragged around the canvas.

---

# Frontend Validation

Before calling the backend, `UploadPanel.jsx` determines the active input mode.

For file mode:

```javascript
const targetFile = files[0];
```

For text mode:

```javascript
const targetText = text;
```

The application then calls:

```javascript
validateInputs(
    targetText,
    targetFile,
    setError
);
```

If validation fails:

```javascript
if (!valid) return;
```

This prevents the request from being sent to the backend.

For example, if the user clicks **Generate Mind Map** without entering anything, the frontend should display an input error instead of calling Gemini.

---

# Backend Error Handling

The backend catches errors during generation.

Example:

```javascript
catch (error) {

    console.error(
        "Mind map generation failed:",
        error
    );

    res.status(500).json({
        success: false,
        message: "Mind map generation failed.",
        details: error.message
    });

}
```

The frontend displays the backend error:

```javascript
setError(
    err.response?.data?.message ||
    "Unable to generate mind map."
);
```

---

# Security

## Never expose the Gemini API key

The API key belongs in:

```text
backend/.env
```

Not:

```text
frontend/src/
```

Do not write:

```javascript
const apiKey = "YOUR_API_KEY";
```

inside frontend code.

The intended architecture is:

```text
Browser
  ↓
Your Backend
  ↓
Gemini API
```

rather than:

```text
Browser
  ↓
Gemini API directly
```

---

# Development Troubleshooting

## `npm ERR! Missing script: "dev"`

Check the `scripts` section of the relevant `package.json`.

For a Vite frontend, it should normally contain something similar to:

```json
"scripts": {
  "dev": "vite",
  "build": "vite",
  "preview": "vite preview"
}
```

Then run:

```bash
npm run dev
```

---

## `Cannot access 'app' before initialization`

Make sure:

```javascript
const app = express();
```

appears before:

```javascript
app.use(limiter);
```

For example:

```javascript
const app = express();

app.use(limiter);
```

---

## `500 Internal Server Error`

A `500` means the request reached the backend but something failed while processing it.

Look at the backend terminal for:

```text
MIND MAP BACKEND ERROR
```

The backend error is usually more informative than the browser console.

---

## Gemini model unavailable

If Gemini returns a `404` stating that a particular model is unavailable, check the current models supported by your Gemini API project and update the model name in `geminiService.js`.

Do not assume an old model name will remain available indefinitely.

---

# Recommended Development Workflow

When developing the application:

```text
1. Start backend
       ↓
2. Start frontend
       ↓
3. Enter text / upload file
       ↓
4. Frontend validates input
       ↓
5. Axios sends request
       ↓
6. Backend validates request
       ↓
7. Backend extracts file contents
       ↓
8. Gemini generates mind-map structure
       ↓
9. Dagre calculates layout
       ↓
10. Backend returns nodes + edges
       ↓
11. React Flow displays mind map
```

---

# Future Improvements

Potential improvements include:

- User accounts and saved mind maps.
- Database storage.
- Multiple mind maps per user.
- Editing node titles and descriptions.
- Add/delete nodes.
- Collapsing entire branches.
- Better mobile responsiveness.
- More export formats.
- PDF export.
- Shareable mind-map links.
- Usage monitoring.
- User-specific AI quotas.
- Authentication and authorisation.
- Production API rate limiting.
- Caching repeated requests.
- Improved AI prompt engineering.
- Streaming AI responses.
- Alternative/local AI models for development.

---

# Deployment

For public deployment, the frontend and backend can be hosted separately or through a suitable full-stack hosting setup.

Example:

```text
                 Users
                   │
                   ▼
          ┌─────────────────┐
          │ Frontend Host   │
          │ React / Vite    │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │ Backend Host    │
          │ Node / Express  │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │ Gemini API      │
          └─────────────────┘
```

Before deployment:

- Move API URLs into environment variables.
- Keep the Gemini API key on the backend.
- Configure production CORS.
- Configure backend rate limiting.
- Validate uploaded files.
- Limit upload sizes.
- Monitor Gemini usage.
- Configure appropriate billing/quota controls.
- Do not commit `.env`.

---

# Project Status

**Break It.** is an AI-powered learning-material visualisation project designed to help users transform large amounts of information into a more structured and interactive format.

The current architecture supports:

- React frontend
- Express backend
- Gemini-powered generation
- File/text input
- Structured mind maps
- Dagre automatic layout
- React Flow interaction
- Expandable node information
- Manual node movement
- Fullscreen canvas
- PNG/image export

