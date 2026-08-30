from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import shutil

from app.exporters.csv_expoter import export_to_csv
from app.processors.llm_processors import process_document

from app.exporters.txt_exporter import export_to_txt
from app.exporters.excel_exporter import export_to_excel


app = FastAPI()


# ============================================================
# FOLDERS
# ============================================================

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


# ============================================================
# STATIC OUTPUT FILES
# ============================================================

app.mount(
    "/outputs",
    StaticFiles(directory=OUTPUT_FOLDER),
    name="outputs"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# HOME
@app.get("/")
def home():
    return {
        "message": "Nexus API is running"
    }

# UPLOAD + EXTRACT
@app.post("/documents/upload")
async def upload_document(file: UploadFile = File(...)):

    # Allowed file types
    allowed_extensions = [".pdf", ".jpg", ".jpeg", ".png"]

    file_extension = os.path.splitext(file.filename)[1].lower()

    if file_extension not in allowed_extensions:
        return {
            "error": "Only PDF, JPG, JPEG and PNG files are allowed"
    }

    # Save uploaded PDF
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    #Process PDF with Gemini
    try:
        result = process_document(file_path)

        from app.processors.image_processors import enhance_image

        base_name = os.path.splitext(file.filename)[0]

        enhanced_path = os.path.join(
            OUTPUT_FOLDER,
            f"{base_name}_enhanced.png"
        )

        if file_extension in [".jpg", ".jpeg", ".png"]:
            enhance_image(
                file_path,
                enhanced_path
            )

    except RuntimeError as e:
        return {
                "message": "Document processing failed",
                "error": str(e)
            }

    except Exception as e:
        import traceback
        print("\n========== FULL PROCESSING ERROR ==========")
        traceback.print_exc()
        print("===========================================\n")

        return {
                "message": "Document processing failed",
                "error": "Unexpected document processing error"
            }


    #Create filenames
    base_name = os.path.splitext(file.filename)[0]

    txt_path = os.path.join(OUTPUT_FOLDER,f"{base_name}.txt")

    excel_path = os.path.join(OUTPUT_FOLDER,f"{base_name}.xlsx")

    csv_path = os.path.join(OUTPUT_FOLDER, f"{base_name}.csv")
    #Export
    export_to_txt(result,txt_path)
    export_to_excel(result,excel_path)
    export_to_csv(result, csv_path)

    # IMPORTANT:
    # Do NOT copy the original uploaded image here.
    #
    # The enhanced image was already created earlier using:
    #
    # enhance_image(file_path, enhanced_path)
    #
    # If we copy file_path here, we overwrite the enhanced image
    # with the original/blurry image.

    return {
        "message": "Document Processed Successfully",
        "data": result,
        "downloads": {
            "txt": f"/documents/download/txt/{base_name}.txt",
            "excel": f"/documents/download/excel/{base_name}.xlsx",
            "csv": f"/documents/download/csv/{base_name}.csv",
            "enhanced": f"/outputs/{base_name}_enhanced.png"
        }
    }

@app.get("/documents/download/enhanced/{filename}")
async def download_enhanced(filename: str):

    file_path = os.path.join(
        OUTPUT_FOLDER,
        filename
    )

    if not os.path.exists(file_path):
        return {
            "error": "Enhanced file not found"
        }

    return FileResponse(
        file_path,
        media_type="image/png",
        filename=filename
    )

@app.get("/documents/download/txt/{filename}")
def download_txt(filename: str):

    file_path = os.path.join(
        OUTPUT_FOLDER,
        filename
    )

    return FileResponse(
        path=file_path,
        media_type="text/plain",
        filename=filename
    )

@app.get("/documents/download/excel/{filename}")
def download_excel(filename: str):

    file_path = os.path.join(
        OUTPUT_FOLDER,
        filename
    )

    return FileResponse(
        path=file_path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=filename
    )

@app.get("/documents/download/csv/{filename}")
def download_csv(filename: str):

    file_path = os.path.join(
        OUTPUT_FOLDER,
        filename
    )

    return FileResponse(
        path=file_path,
        media_type="text/csv",
        filename=filename
    )