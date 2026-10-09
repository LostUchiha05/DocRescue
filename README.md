<h1>DocRescue</h1>
DocRescue is an intelligent document processing and OCR recovery system designed to convert unstructured, blurry, or degraded document images and PDFs into structured JSON data and downloadable exports. The engine combines computer vision image enhancement, multi-engine OCR, spell-checking metrics, and multimodal AI models to salvage low-quality documents.

Key Features
<ul>
<li>Image Enhancement Pipeline: Utilizes OpenCV to upscale images, apply non-local means denoising (fastNlMeansDenoising), sharpen via unsharp masking, and enhance local contrast using CLAHE.</li>

<li>Hybrid OCR Engine: Employs PaddleOCR for initial text detection, line extraction, bounding boxes, and confidence scoring.</li>

<li>OCR Quality & Artifact Detection: Evaluates text quality using length, confidence scores, invalid character ratios, and real-word dictionary matching via pyspellchecker. It automatically detects repeated OCR artifacts and suspicious runtime output.</li>

<li>Multi-Variant Enhancement Recovery: Generates multiple image variants (upscaled, high contrast, sharpened, adaptive threshold) when initial OCR quality drops.</li>

<li>Gemini Vision Fallback: Triggers multimodal recovery using gemini-3.7-flash to visually re-read severely degraded documents if local OCR fails or produces poor quality text.</li>

<li>Smart PDF Extraction: Extracts native text from digital PDFs via PyMuPDF (fitz) and automatically falls back to page-by-page rendering at 200 DPI for scanned documents.</li>

<li>Text Normalization: Cleans extracted text using regex to eliminate broken lines, excess whitespace, and standalone/trailing page numbers.</li>

<li>Dynamic AI Structuring: Sends normalized text to gemini-3.6-flash to dynamically construct hierarchical JSON without rigid schemas, preserving nested tables, lists, and key-value pairs.</li>

<li>Multi-Format Exporting: Converts structured document outputs into formatted .txt files, flattened key-value .csv files, and nested .xlsx Excel spreadsheets.</li>

<li>FastAPI Backend: Provides API endpoints for file uploading, processing, serving enhanced preview images, and serving file downloads.</li>
</ul>
<h2>Tech Stack</h2>
<ul>
  <li>Backend Framework: FastAPI, Uvicorn, Python-Multipart, Pydantic</li>
  <li>PDF Processing: PyMuPDF (fitz)</li>
  <li>Computer Vision & OCR: OpenCV (opencv-python-headless), PaddleOCR, PaddlePaddle, NumPy</li>
  <li>AI & LLM Services: Google GenAI SDK (google-genai), Gemini 3.6 Flash, Gemini 3.7 Flash</li>
  <li>Text Analysis: pyspellchecker, Regex</li>
  <li>Data Exporters: openpyxl, pandas, csv</li>
</ul>
<h2>Installation & Setup</h2>

<dt>1. Clone the Repository</dt>
<dd>git clone https://github.com/your-username/DocRescue.git</dd>
<dd>cd DocRescue</dd><br>

<dt>2. Set Up Virtual Environment</dt>
<dd>Linux / macOS</dd>
<dd>python3 -m venv venv<dd>
<dd>source venv/bin/activate</dd><br>

<dt>Windows</dt>
<dd>python -m venv venv</dd>
<dd>venv\Scripts\activate</dd><br>

<dt>3. Install Dependencies</dt>
<dd>pip install -r requirements.txt</dd>

<dt>4. Configure Environment Variables</dt>

<dd>Create a .env file in the root directory and add your Gemini API key:
GEMINI_API_KEY=your_gemini_api_key_here</dd><br>

<dt>5. Start the API Server</dt>
<dd>uvicorn app.main:app --reload</dd><br>

<h3>API Endpoints</h3>
Document Upload & ProcessingEndpoint:
<ol>
<li>POST /documents/upload</li>
<li>Content-Type: multipart/form-data</li>
<li>Accepted Formats: .pdf, .jpg, .jpeg, .png</li>
<li>Response: Formatted document JSON, extracted fields, and output download links for TXT, Excel, CSV, and enhanced preview images.</li>
</ol> 
Download Endpoints
<ol>
<li>GET /documents/download/txt/{filename} - Download generated .txt report.</li>   
<li>GET /documents/download/excel/{filename} - Download generated .xlsx report.</li>   
<li>GET /documents/download/csv/{filename} - Download generated .csv report.</li>   
<li>GET /documents/download/enhanced/{filename} - Download the OpenCV enhanced image.</li>   
</ol>
