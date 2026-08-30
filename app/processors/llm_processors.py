from google import genai
from google.genai import types, errors
from dotenv import load_dotenv
from app.processors.image_processors import(extract_text_from_image,enhance_image)

import os
import json
import cv2
import numpy as np

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


# ============================================================
# GEMINI TEXT → STRUCTURED JSON
# ============================================================

def analyze_document(text):

    if not text or not text.strip():
        return {
            "document_type": "Unknown",
            "content": "",
            "ai_analysis": {
                "status": "no_text",
                "message": "No readable text could be extracted."
            }
        }

    prompt = f"""
You are DocRescue, an intelligent document analysis system.

Your job is to convert OCR/recovered document text into accurate
structured JSON.

IMPORTANT:

The supplied text may contain OCR mistakes.

You must:
- preserve information from the document
- correct obvious OCR character mistakes ONLY when strongly supported
- never invent information
- never create realistic-looking replacement names, numbers,
  dates, addresses or identifiers
- never assume missing information
- preserve uncertainty when the text cannot be confidently recovered

Rules:

1. Identify the actual document type.
2. Analyze the actual organization of the document.
3. Create JSON keys dynamically.
4. Do NOT use a fixed schema.
5. Do NOT assume the document is a resume, invoice, article, paper,
   identity card, etc.
6. Preserve names, dates, numbers, headings, titles, tables,
   lists and references.
7. Do NOT summarize the document.
8. Do NOT rewrite the document.
9. Do NOT invent information.
10. Do NOT silently replace uncertain OCR with invented values.
11. Use arrays for repeated information.
12. Preserve section hierarchy.
13. Represent tables as structured arrays when possible.
14. If a value is unclear, preserve the closest recoverable value.
15. Never claim 100% confidence unless the source is clearly readable.

Return valid JSON only.

DOCUMENT TEXT:

{text}
"""

    try:

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
            config={
                "response_mime_type": "application/json"
            }
        )

        if not response.text:
            raise RuntimeError("Gemini returned empty response.")

        return json.loads(response.text)

    except errors.ClientError as e:

        if getattr(e, "code", None) == 429:

            print("======================================")
            print("GEMINI QUOTA EXCEEDED")
            print("USING OCR FALLBACK")
            print("======================================")

        else:
            print("GEMINI CLIENT ERROR:", e)

        return create_ocr_fallback(text)

    except json.JSONDecodeError:

        print("GEMINI RETURNED INVALID JSON")
        print("USING OCR FALLBACK")

        return create_ocr_fallback(text)

    except Exception as e:

        print("GEMINI ERROR:", e)
        print("USING OCR FALLBACK")

        return create_ocr_fallback(text)


# ============================================================
# OCR FALLBACK
# ============================================================

def create_ocr_fallback(text):

    return {
        "document_type": "OCR Document",
        "content": text,
        "ai_analysis": {
            "status": "unavailable",
            "message": (
                "AI structuring was unavailable. "
                "The document was processed using OCR."
            )
        }
    }


# ============================================================
# TEXT QUALITY SCORING
# ============================================================

def score_text_quality(text, confidences=None, real_word_ratio=None):

    if not text:
        return 0

    text = str(text).strip()

    if not text:
        return 0

    score = 0

    # --------------------------------------------------------
    # Length
    # --------------------------------------------------------

    length = len(text)

    if length >= 20:
        score += 20

    if length >= 50:
        score += 10

    if length >= 100:
        score += 10

    # --------------------------------------------------------
    # Alphabetic characters
    # --------------------------------------------------------

    alpha_count = sum(
        1 for c in text if c.isalpha()
    )

    alpha_ratio = alpha_count / max(length, 1)

    if alpha_ratio > 0.25:
        score += 15

    if alpha_ratio > 0.45:
        score += 10

    # --------------------------------------------------------
    # Confidence
    # --------------------------------------------------------

    if confidences:

        normalized = []

        for confidence in confidences:

            try:

                confidence = float(confidence)

                if confidence > 1:
                    confidence /= 100

                normalized.append(confidence)

            except Exception:
                continue

        if normalized:

            avg = sum(normalized) / len(normalized)

            score += int(avg * 25)

    # --------------------------------------------------------
    # Weird character detection
    # --------------------------------------------------------

    allowed = (
        "abcdefghijklmnopqrstuvwxyz"
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        "0123456789"
        " .,;:!?-_()[]{}'\"/@#$%&+*=<>₹"
        "\n\t"
    )

    weird = sum(
        1
        for c in text
        if c not in allowed
    )

    weird_ratio = weird / max(length, 1)

    if weird_ratio < 0.10:
        score += 10

    elif weird_ratio < 0.20:
        score += 5

    score = min(score, 100)

    # --------------------------------------------------------
    # Real-word ratio penalty
    #
    # Everything above measures whether text LOOKS clean
    # (length, character set, confidence). None of it catches
    # blur that confidently swaps letters for similar shapes,
    # producing clean-looking nonsense. This penalty pulls the
    # score down for that failure mode specifically, so both
    # is_ocr_poor() and variant selection during recovery treat
    # it as low quality instead of a false "good OCR" reading.
    # --------------------------------------------------------

    if real_word_ratio is None:
        real_word_ratio = compute_real_word_ratio(text)

    if real_word_ratio is not None:

        if real_word_ratio < 0.35:
            score = int(score * 0.3)

        elif real_word_ratio < 0.55:
            score = int(score * 0.6)

        elif real_word_ratio < 0.70:
            score = int(score * 0.85)

    return min(score, 100)


# ============================================================
# OCR QUALITY CHECK
# ============================================================
import re
from collections import Counter
from spellchecker import SpellChecker

# Loaded once at import time (cheap: bundled frequency dictionary,
# no network calls). Used to catch OCR output that LOOKS clean
# (good confidence, normal characters, right length) but is actually
# "confidently wrong" -- real letters swapped for similar-shaped ones
# under blur (e.g. "premier" -> "pismisi", "quality" -> "quslity").
# Confidence scores and character-ratio checks can't see this;
# only checking words against a real dictionary can.
_spell = SpellChecker()


def compute_real_word_ratio(text, min_word_len=3, min_words=6):
    """
    Returns the fraction of alphabetic "words" in `text` that are
    recognized English words. Returns None when there isn't enough
    alphabetic content to judge fairly (e.g. mostly numbers/tables),
    so callers should skip the check rather than treat None as 0.
    """

    words = re.findall(r"[A-Za-z]+", text)
    words = [w.lower() for w in words if len(w) >= min_word_len]

    if len(words) < min_words:
        return None

    known = _spell.known(words)

    return len(known) / len(words)


# ============================================================
# OCR ARTIFACT DETECTION
# ============================================================

def contains_ocr_artifact(text):
    """
    Detect OCR output that looks like a Paddle/model/system
    artifact instead of actual document text.
    """

    if not text:
        return True

    text_lower = text.lower().strip()

    # Known Paddle / OCR runtime artifacts
    known_artifacts = [
        "reducemeancheckifonednnsupport",
        "onednnsupport",
        "reducemean",
        "checkifonednnsupport",
        "dnnsupport",
        "paddleocr",
        "ocrengine",
    ]

    for artifact in known_artifacts:
        if artifact in text_lower:
            return True

    # --------------------------------------------------------
    # Repeated identical OCR lines
    # --------------------------------------------------------

    lines = [
        line.strip().lower()
        for line in text.splitlines()
        if line.strip()
    ]

    if len(lines) >= 4:

        counts = Counter(lines)

        most_common_line, count = counts.most_common(1)[0]

        repetition_ratio = count / len(lines)

        # Example:
        # same garbage line 11 times
        if count >= 3 and repetition_ratio >= 0.50:
            print(
                "OCR ARTIFACT DETECTED:"
                f" repeated line '{most_common_line}'"
            )
            return True

    # --------------------------------------------------------
    # Extremely repetitive text
    # --------------------------------------------------------

    words = re.findall(
        r"[A-Za-z0-9]+",
        text_lower
    )

    if len(words) >= 8:

        word_counts = Counter(words)

        _, most_common_count = word_counts.most_common(1)[0]

        repetition_ratio = (
            most_common_count /
            len(words)
        )

        if repetition_ratio > 0.50:
            print(
                "OCR ARTIFACT DETECTED:"
                " excessive word repetition"
            )
            return True

    return False


# ============================================================
# OCR TEXT QUALITY
# ============================================================

def is_ocr_poor(ocr_result, blur_score=None):

    # blur_score is measured on the ORIGINAL (pre-enhancement) image.
    # Very low values mean the source photo itself is too degraded to
    # trust -- skip straight to recovery rather than scoring garbage.
    # Kept conservative on purpose: this metric is unreliable on bold
    # text/graphics, so it only catches the most extreme cases. The
    # real-word-ratio check below is what catches "looks fine but is
    # actually wrong" OCR, which is the more common failure mode.
    if blur_score is not None and blur_score < 40:
        print(
            f"OCR FAILURE: ORIGINAL IMAGE BLUR SCORE "
            f"{blur_score:.2f} TOO LOW TO TRUST"
        )
        return True

    if not ocr_result:
        return True

    texts = []
    confidences = []

    for item in ocr_result:

        text = str(
            item.get("text", "")
        ).strip()

        if text:
            texts.append(text)

        confidence = item.get("confidence")

        if confidence is not None:

            try:

                confidence = float(confidence)

                if confidence > 1:
                    confidence /= 100

                confidences.append(confidence)

            except (ValueError, TypeError):
                pass

    combined_text = " ".join(texts).strip()

    # --------------------------------------------------------
    # Basic checks
    # --------------------------------------------------------

    if len(combined_text) < 30:
        print("OCR TEXT TOO SHORT")
        return True

    # --------------------------------------------------------
    # Repetition detection
    # --------------------------------------------------------

    if len(texts) >= 5:

        unique_texts = set(
            t.lower()
            for t in texts
        )

        repetition_ratio = (
            len(unique_texts) / len(texts)
        )

        print(
            f"OCR UNIQUE LINE RATIO: "
            f"{repetition_ratio:.2f}"
        )

        # Same OCR output repeated many times
        if repetition_ratio < 0.40:

            print(
                "OCR FAILURE: "
                "HIGH TEXT REPETITION"
            )

            return True

    # --------------------------------------------------------
    # Detect suspicious technical OCR hallucinations
    # --------------------------------------------------------

    suspicious_terms = [
        "reducemean",
        "checkifonednnsupport",
        "onednn",
        "dnnsupport",
        "layernorm",
        "softmax",
        "conv2d",
        "matmul",
        "tensor",
        "backend",
        "kernel",
        "cuda",
        "paddleocr"
    ]

    lowered_text = combined_text.lower()

    suspicious_hits = sum(
        1
        for term in suspicious_terms
        if term in lowered_text
    )

    if suspicious_hits >= 1:

        print(
            "OCR FAILURE: "
            "SUSPICIOUS TECHNICAL TEXT DETECTED"
        )

        return True

    # --------------------------------------------------------
    # Confidence check
    # --------------------------------------------------------

    if confidences:

        average_confidence = (
            sum(confidences) /
            len(confidences)
        )

        print(
            f"OCR average confidence: "
            f"{average_confidence:.2f}"
        )

        if average_confidence < 0.72:

            print(
                "OCR FAILURE: "
                "LOW CONFIDENCE"
            )

            return True

    # --------------------------------------------------------
    # Character sanity check
    # --------------------------------------------------------

    total_chars = len(combined_text)

    weird_chars = sum(
        1
        for char in combined_text
        if not (
            char.isalnum()
            or char.isspace()
            or char in
            ".,;:!?-_()[]{}'\"/@#$%&+*=<>"
        )
    )

    if total_chars > 50:

        weird_ratio = (
            weird_chars /
            total_chars
        )

        print(
            f"OCR WEIRD CHARACTER RATIO: "
            f"{weird_ratio:.2f}"
        )

        if weird_ratio > 0.15:

            print(
                "OCR FAILURE: "
                "TOO MANY INVALID CHARACTERS"
            )

            return True

    # --------------------------------------------------------
    # Real-word ratio check
    #
    # This is the check that catches "confidently wrong" OCR:
    # blur that swaps letters for similar shapes produces text
    # that passes every check above (right length, high confidence,
    # normal characters) while being nonsense -- e.g. "CVPR" read
    # as "CVVR", "premier" read as "pismisi". Comparing against a
    # real dictionary is the only reliable way to catch this.
    # --------------------------------------------------------

    real_word_ratio = compute_real_word_ratio(combined_text)

    if real_word_ratio is not None:

        print(
            f"OCR REAL WORD RATIO: "
            f"{real_word_ratio:.2f}"
        )

        if real_word_ratio < 0.45:

            print(
                "OCR FAILURE: "
                "TEXT DOES NOT MATCH REAL WORDS "
                "(LIKELY GARBLED BY BLUR)"
            )

            return True

    # --------------------------------------------------------
    # Text quality score
    # --------------------------------------------------------

    quality = score_text_quality(
        combined_text,
        confidences,
        real_word_ratio=real_word_ratio
    )

    print(
        f"OCR text quality score: "
        f"{quality}/100"
    )

    if quality < 65:

        print(
            "OCR FAILURE: "
            "LOW TEXT QUALITY"
        )

        return True

    return False

# ============================================================
# GEMINI VISION RECOVERY
# ============================================================

def extract_text_with_gemini_vision(
    original_path,
    enhanced_path=None
):

    print("=" * 60)
    print("GEMINI VISION OCR RECOVERY")
    print("=" * 60)

    mime_types = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png"
    }

    extension = os.path.splitext(
        original_path
    )[1].lower()

    mime_type = mime_types.get(
        extension,
        "image/png"
    )

    try:

        with open(original_path, "rb") as f:
            original_bytes = f.read()

        contents = []

        # ----------------------------------------------------
        # ORIGINAL IMAGE
        # ----------------------------------------------------

        contents.append(
            types.Part.from_bytes(
                data=original_bytes,
                mime_type=mime_type
            )
        )

        # ----------------------------------------------------
        # ENHANCED IMAGE
        # ----------------------------------------------------

        if enhanced_path and os.path.exists(enhanced_path):

            with open(enhanced_path, "rb") as f:
                enhanced_bytes = f.read()

            contents.append(
                types.Part.from_bytes(
                    data=enhanced_bytes,
                    mime_type="image/png"
                )
            )

        # ----------------------------------------------------
        # RECOVERY PROMPT
        # ----------------------------------------------------

        prompt = """
You are DocRescue's high-accuracy document OCR recovery engine.

The document image may be blurry, noisy, low-resolution, distorted,
or partially degraded.

Your task is to recover the ACTUAL TEXT VISIBLE IN THE IMAGE.

IMPORTANT:
- Do not trust OCR text supplied by another OCR engine.
- Inspect the image itself.
- Do not hallucinate text.
- Do not invent missing characters.
- Do not summarize.
- Do not explain anything.
- Do not correct the document's meaning.
- Preserve the exact wording as much as the image allows.

RECOVERY RULES:

1. Read the image visually.
2. Recover every readable word.
3. Preserve the original reading order.
4. Preserve headings and paragraphs.
5. Preserve names exactly.
6. Preserve dates exactly.
7. Preserve numbers exactly.
8. Preserve punctuation when visible.
9. Preserve capitalization when reasonably readable.
10. Preserve lists and bullet points.
11. Preserve tables in a readable row/column representation.
12. If a character is genuinely impossible to determine,
    do not invent it.
13. Never replace uncertain text with generic or unrelated text.
14. Ignore OCR hallucinations such as technical library names,
    model names, programming terms, or repeated nonsense.
15. If the document contains normal English prose, prioritize
    visually recognizable English words and sentence structure.
16. Return ONLY the recovered document text.

QUALITY CONTROL:

Before returning the answer, internally check:
- Does the text correspond to what is visibly present?
- Are words repeated unnaturally?
- Are there obvious OCR hallucinations?
- Are names, dates and numbers preserved?
- Does the result follow the visual layout/order?

Return only the recovered text.
"""

        response = client.models.generate_content(
            model="gemini-3.7-flash",
            contents=[
                *contents,
                prompt
            ]
        )

        recovered_text = (
            response.text.strip()
            if response.text
            else ""
        )

        if not recovered_text:

            raise RuntimeError(
                "Gemini Vision returned empty text."
            )

        print(
            "GEMINI VISION RECOVERED:",
            len(recovered_text),
            "characters"
        )

        return recovered_text

    except errors.ClientError as e:

        if getattr(e, "code", None) == 429:

            print("=" * 60)
            print("GEMINI VISION QUOTA EXCEEDED")
            print("=" * 60)

            return None

        print(
            "GEMINI VISION CLIENT ERROR:",
            e
        )

        return None

    except Exception as e:

        print(
            "GEMINI VISION ERROR:",
            e
        )

        return None
    
def create_enhancement_variants(image_path, output_dir):
    """
    Create several enhanced versions of an image.
    These are used when PaddleOCR produces unreliable text.
    """

    os.makedirs(output_dir, exist_ok=True)

    image = cv2.imread(image_path)

    if image is None:
        raise ValueError(
            f"Could not read image: {image_path}"
        )

    base_name = os.path.splitext(
        os.path.basename(image_path)
    )[0]

    # --------------------------------------------------------
    # 1. Upscale
    # --------------------------------------------------------

    h, w = image.shape[:2]

    upscaled = cv2.resize(
        image,
        None,
        fx=2.5,
        fy=2.5,
        interpolation=cv2.INTER_CUBIC
    )

    # --------------------------------------------------------
    # 2. Grayscale + contrast
    # --------------------------------------------------------

    gray = cv2.cvtColor(
        upscaled,
        cv2.COLOR_BGR2GRAY
    )

    clahe = cv2.createCLAHE(
        clipLimit=2.5,
        tileGridSize=(8, 8)
    )

    contrast = clahe.apply(gray)

    # --------------------------------------------------------
    # 3. Denoising
    # --------------------------------------------------------

    denoised = cv2.fastNlMeansDenoising(
        contrast,
        None,
        h=7,
        templateWindowSize=7,
        searchWindowSize=21
    )

    # --------------------------------------------------------
    # 4. Sharpen
    # --------------------------------------------------------

    blurred = cv2.GaussianBlur(
        denoised,
        (0, 0),
        1.2
    )

    sharpened = cv2.addWeighted(
        denoised,
        1.5,
        blurred,
        -0.5,
        0
    )

    # --------------------------------------------------------
    # 5. Adaptive threshold
    # --------------------------------------------------------

    threshold = cv2.adaptiveThreshold(
        sharpened,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        31,
        11
    )

    # --------------------------------------------------------
    # Save variants
    # --------------------------------------------------------

    variants = {
        "upscaled": upscaled,
        "contrast": contrast,
        "sharpened": sharpened,
        "threshold": threshold
    }

    paths = []

    for name, variant in variants.items():

        output_path = os.path.join(
            output_dir,
            f"{base_name}_{name}.png"
        )

        cv2.imwrite(
            output_path,
            variant
        )

        paths.append(output_path)

        print(
            f"ENHANCEMENT VARIANT SAVED: {output_path}"
        )

    return paths

# ============================================================
# MAIN DOCUMENT PROCESSOR
# ============================================================

def process_document(file_path):

    import os
    import cv2

    from app.processors.pdf_processor import (
        extract_text_from_pdf
    )

    from app.processors.image_processors import (
        extract_text_from_image,
        enhance_image
    )

    from app.processors.text_cleaner import (
        clean_text
    )

    extension = os.path.splitext(
        file_path
    )[1].lower()

    enhanced_path = None
    raw_text = ""

    # ========================================================
    # IMAGE PROCESSING
    # ========================================================

    if extension in [
        ".jpg",
        ".jpeg",
        ".png"
    ]:

        base_name = os.path.splitext(
            os.path.basename(file_path)
        )[0]

        os.makedirs(
            "outputs",
            exist_ok=True
        )

        # ----------------------------------------------------
        # MAIN ENHANCED IMAGE
        # ----------------------------------------------------

        enhanced_path = os.path.join(
            "outputs",
            f"{base_name}_enhanced.png"
        )

        print("======================================")
        print("IMAGE ENHANCEMENT")
        print("======================================")

        enhance_image(
            file_path,
            enhanced_path
        )

        print(
            f"ENHANCED IMAGE SAVED: "
            f"{enhanced_path}"
        )

        # ----------------------------------------------------
        # BLUR SCORE
        # ----------------------------------------------------

        original_image = cv2.imread(
            file_path,
            cv2.IMREAD_GRAYSCALE
        )

        if original_image is not None:

            blur_score = cv2.Laplacian(
                original_image,
                cv2.CV_64F
            ).var()

        else:

            blur_score = None

        print(
            f"IMAGE BLUR SCORE: {blur_score}"
        )

        # ----------------------------------------------------
        # FIRST PADDLE OCR
        # ----------------------------------------------------

        print("======================================")
        print("PADDLE OCR")
        print("======================================")

        ocr_result = extract_text_from_image(
            file_path,
            enhanced_path
        )

        raw_text = "\n".join(
            item.get("text", "")
            for item in ocr_result
            if item.get("text")
        ).strip()

        print(
            f"INITIAL OCR TEXT LENGTH: "
            f"{len(raw_text)}"
        )

        # ----------------------------------------------------
        # OCR QUALITY
        # ----------------------------------------------------

        poor = is_ocr_poor(
            ocr_result,
            blur_score=blur_score
        )

        # ====================================================
        # BAD OCR
        # ====================================================

        if poor:

            print("======================================")
            print("PADDLE OCR FAILED / UNTRUSTWORTHY")
            print("STARTING RECOVERY PIPELINE")
            print("======================================")

            # ------------------------------------------------
            # CREATE ENHANCEMENT VARIANTS
            # ------------------------------------------------

            variants_dir = os.path.join(
                "outputs",
                f"{base_name}_variants"
            )

            variant_paths = create_enhancement_variants(
                file_path,
                variants_dir
            )

            best_text = ""
            best_score = -1
            best_image = enhanced_path

            # ------------------------------------------------
            # TRY OCR ON ALL VARIANTS
            # ------------------------------------------------

            for variant_path in variant_paths:

                print("======================================")
                print(
                    f"TRYING OCR VARIANT:\n"
                    f"{variant_path}"
                )
                print("======================================")

                try:

                    variant_ocr = extract_text_from_image(
                        variant_path,
                        None
                    )

                    variant_text = "\n".join(
                        item.get("text", "")
                        for item in variant_ocr
                        if item.get("text")
                    ).strip()

                    variant_confidences = [
                        item.get("confidence")
                        for item in variant_ocr
                        if item.get("confidence") is not None
                    ]

                    # ----------------------------------------
                    # Reject known artifacts
                    # ----------------------------------------

                    if contains_ocr_artifact(
                        variant_text
                    ):

                        print(
                            "VARIANT REJECTED:"
                            " OCR ARTIFACT"
                        )

                        continue

                    # ----------------------------------------
                    # Score variant
                    # ----------------------------------------

                    try:

                        variant_score = score_text_quality(
                            variant_text,
                            variant_confidences
                        )

                    except Exception:

                        variant_score = 0

                    print(
                        f"VARIANT SCORE: "
                        f"{variant_score}/100"
                    )

                    if (
                        variant_text
                        and
                        variant_score > best_score
                    ):

                        best_score = variant_score
                        best_text = variant_text
                        best_image = variant_path

                except Exception as e:

                    print(
                        "VARIANT OCR ERROR:",
                        e
                    )

            # ------------------------------------------------
            # If a variant produced something useful
            # ------------------------------------------------

            if best_text:

                raw_text = best_text

            print("======================================")
            print(
                f"BEST PADDLE OCR SCORE: "
                f"{best_score}/100"
            )
            print(
                f"BEST OCR IMAGE: "
                f"{best_image}"
            )
            print("======================================")

            # =================================================
            # GEMINI VISION RECOVERY
            # =================================================

            print("======================================")
            print("GEMINI VISION RECOVERY")
            print("======================================")

            print(
                "Sending ORIGINAL image + "
                "BEST ENHANCED image to Gemini..."
            )

            vision_text = (
                extract_text_with_gemini_vision(
                    file_path,
                    best_image
                )
            )

            if vision_text:

                print("======================================")
                print("GEMINI VISION SUCCESS")
                print("======================================")

                print(
                    f"RECOVERED TEXT LENGTH: "
                    f"{len(vision_text)}"
                )

                # ------------------------------------------------
                # IMPORTANT
                #
                # Gemini Vision is specifically being used as
                # the recovery engine.
                #
                # Do NOT compare it against the broken Paddle
                # score. If Vision returns meaningful text,
                # trust it as the recovery result.
                # ------------------------------------------------

                raw_text = vision_text

                print(
                    "USING GEMINI VISION RECOVERED TEXT"
                )

            else:

                print("======================================")
                print("GEMINI VISION UNAVAILABLE")
                print("======================================")

                if best_text:

                    raw_text = best_text

                    print(
                        "FALLING BACK TO BEST PADDLE OCR"
                    )

                else:

                    raw_text = ""

                    print(
                        "NO TRUSTWORTHY OCR TEXT FOUND"
                    )

        # ====================================================
        # GOOD OCR
        # ====================================================

        else:

            print("======================================")
            print("PADDLE OCR QUALITY GOOD")
            print("USING PADDLE OCR")
            print("======================================")

    # ========================================================
    # PDF
    # ========================================================

    elif extension == ".pdf":

        pages = extract_text_from_pdf(
            file_path
        )

        raw_text = "\n\n".join(
            page["text"]
            for page in pages
        )

    else:

        raise ValueError(
            "Unsupported file type"
        )

    # ========================================================
    # CLEAN TEXT
    # ========================================================

    cleaned_text = clean_text(
        raw_text
    )

    print("======================================")
    print("FINAL TEXT")
    print("======================================")
    print(cleaned_text)
    print("======================================")

    # ========================================================
    # GEMINI STRUCTURING
    # ========================================================

    result = analyze_document(
        cleaned_text
    )

    # ========================================================
    # DOWNLOAD INFORMATION
    # ========================================================

    if (
        extension in [
            ".jpg",
            ".jpeg",
            ".png"
        ]
        and enhanced_path
    ):

        result["_enhanced_image"] = (
            f"/outputs/"
            f"{os.path.basename(enhanced_path)}"
        )

        base_name = os.path.splitext(
            os.path.basename(file_path)
        )[0]

        result["downloads"] = {

            "txt":
                f"/documents/download/txt/"
                f"{base_name}.txt",

            "excel":
                f"/documents/download/excel/"
                f"{base_name}.xlsx",

            "csv":
                f"/documents/download/csv/"
                f"{base_name}.csv",

            "enhanced":
                f"/outputs/"
                f"{base_name}_enhanced.png"
        }

    return result


# ============================================================
# PDF PROCESSOR
# ============================================================

def process_pdf(file_path):

    from app.processors.pdf_processor import (
        extract_text_from_pdf
    )

    from app.processors.text_cleaner import (
        clean_text
    )

    pages = extract_text_from_pdf(
        file_path
    )

    raw_text = "\n\n".join(
        page["text"]
        for page in pages
    )

    cleaned_text = clean_text(
        raw_text
    )

    return analyze_document(
        cleaned_text
    )