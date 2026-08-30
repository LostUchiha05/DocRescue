import pymupdf
import os
import uuid


def extract_text_from_pdf(file_path: str):

    print("\n==============================")
    print("PDF PROCESSOR STARTED")
    print("File:", file_path)
    print("==============================")

    document = pymupdf.open(file_path)

    print("PDF opened successfully")
    print("Total pages:", len(document))

    all_text = []

    for page_number, page in enumerate(document, start=1):

        print(f"\n--- Processing page {page_number} ---")

        # --------------------------------
        # 1. Try normal PDF text extraction
        # --------------------------------

        text = page.get_text().strip()

        if text:

            print(
                f"Page {page_number}: "
                f"normal text found ({len(text)} characters)"
            )

            all_text.append({
                "page": page_number,
                "method": "text",
                "text": text
            })

            continue

        # --------------------------------
        # 2. No text → scanned PDF
        # --------------------------------

        print(
            f"Page {page_number}: "
            "no text found, using OCR"
        )

        # Give every temporary image a unique name
        temp_filename = (
            f"temp_pdf_{uuid.uuid4().hex}_page_{page_number}.png"
        )

        image_path = os.path.join(
            "uploads",
            temp_filename
        )

        try:

            # Render PDF page
            print(
                f"Rendering page {page_number} "
                "at 200 DPI..."
            )

            pixmap = page.get_pixmap(
                dpi=200,
                alpha=False
            )

            pixmap.save(image_path)

            print(
                f"Temporary image created: "
                f"{image_path}"
            )

            # --------------------------------
            # 3. OCR
            # --------------------------------

            print(
                f"Starting OCR for page "
                f"{page_number}..."
            )

            from app.processors.image_processors import (
                extract_text_from_image
            )

            ocr_result = extract_text_from_image(
                image_path
            )

            print(
                f"OCR completed for page "
                f"{page_number}"
            )

            page_text = "\n".join(
                item.get("text", "")
                for item in ocr_result
                if item.get("text")
            )

            if page_text.strip():

                print(
                    f"Page {page_number}: "
                    f"OCR extracted "
                    f"{len(page_text)} characters"
                )

                all_text.append({
                    "page": page_number,
                    "method": "ocr",
                    "text": page_text.strip()
                })

            else:

                print(
                    f"WARNING: Page {page_number} "
                    "OCR returned no text"
                )

        finally:

            # --------------------------------
            # 4. Always remove temp image
            # --------------------------------

            if os.path.exists(image_path):

                os.remove(image_path)

                print(
                    f"Temporary image deleted: "
                    f"{image_path}"
                )

    document.close()

    print("\n==============================")
    print("PDF PROCESSING COMPLETE")
    print("Pages processed:", len(all_text))
    print("==============================\n")

    return all_text


def process_document(file_path: str):
    """
    Decide which processor to use based
    on the uploaded file type.
    """

    extension = os.path.splitext(
        file_path
    )[1].lower()

    if extension == ".pdf":

        return extract_text_from_pdf(
            file_path
        )

    elif extension in [
        ".jpg",
        ".jpeg",
        ".png"
    ]:

        from app.processors.image_processors import (
            extract_text_from_image
        )

        return extract_text_from_image(
            file_path
        )

    else:

        raise ValueError(
            "Unsupported file type"
        )
