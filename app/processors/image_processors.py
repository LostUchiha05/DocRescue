from paddleocr import PaddleOCR
import cv2
import os


# ============================================================
# PADDLE OCR
# ============================================================

ocr = PaddleOCR(
    lang="en"
)


# ============================================================
# IMAGE ENHANCEMENT
# ============================================================

def preprocess_image(input_path):
    """
    Document enhancement pipeline.
    Creates an enhanced/sharpened image for Document Comparison & OCR fallback.
    """

    image = cv2.imread(input_path)

    if image is None:
        raise ValueError(
            f"Could not read image: {input_path}"
        )

    # --------------------------------------------------------
    # 1. Upscale for fine text details
    # --------------------------------------------------------

    height, width = image.shape[:2]

    max_dimension = 3000
    scale = 2.0

    if max(height, width) * scale > max_dimension:
        scale = max_dimension / max(height, width)

    if scale > 1.0:
        image = cv2.resize(
            image,
            None,
            fx=scale,
            fy=scale,
            interpolation=cv2.INTER_CUBIC
        )

    # --------------------------------------------------------
    # 2. Grayscale
    # --------------------------------------------------------

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    # --------------------------------------------------------
    # 3. Gentle Denoising
    # --------------------------------------------------------

    gray = cv2.fastNlMeansDenoising(
        gray,
        None,
        h=4,
        templateWindowSize=7,
        searchWindowSize=21
    )

    # --------------------------------------------------------
    # 4. Sharpening (Unsharp Masking for heavy optical blur)
    # --------------------------------------------------------

    gaussian = cv2.GaussianBlur(gray, (0, 0), sigmaX=3.0)
    sharpened = cv2.addWeighted(gray, 2.2, gaussian, -1.2, 0)

    # --------------------------------------------------------
    # 5. Local Contrast Boost (CLAHE)
    # --------------------------------------------------------

    clahe = cv2.createCLAHE(
        clipLimit=2.5,
        tileGridSize=(8, 8)
    )

    enhanced = clahe.apply(sharpened)

    # --------------------------------------------------------
    # 6. Convert back to 3-channel BGR for consistent output
    # --------------------------------------------------------

    enhanced_bgr = cv2.cvtColor(enhanced, cv2.COLOR_GRAY2BGR)

    return enhanced_bgr


# ============================================================
# SAVE ENHANCED IMAGE
# ============================================================

def enhance_image(input_path, output_path):
    """
    Create enhanced image for Document Comparison.

    IMPORTANT:
    This function ALWAYS creates the enhanced file.
    """

    enhanced = preprocess_image(
        input_path
    )

    success = cv2.imwrite(
        output_path,
        enhanced
    )

    if not success:
        raise RuntimeError(
            f"Could not save enhanced image: {output_path}"
        )

    print(
        f"ENHANCED IMAGE CREATED: {output_path}"
    )

    return output_path


# ============================================================
# PADDLE OCR
# ============================================================

def run_ocr(image_path):
    """
    Run PaddleOCR on the supplied image.
    """

    results = list(
        ocr.predict(image_path)
    )

    extracted = []

    for result in results:

        texts = result.get(
            "rec_texts",
            []
        )

        scores = result.get(
            "rec_scores",
            []
        )

        boxes = result.get(
            "rec_boxes",
            []
        )

        for text, score, box in zip(
            texts,
            scores,
            boxes
        ):

            text = str(text).strip()

            if not text:
                continue

            try:
                confidence = float(score)
            except (ValueError, TypeError):
                continue

            if confidence > 1:
                confidence /= 100.0

            # Don't throw away everything below 0.30.
            # We need those results when deciding whether
            # the OCR itself is poor.
            if confidence < 0.15:
                continue

            try:
                box_data = box.tolist()
            except AttributeError:
                box_data = box

            extracted.append({
                "text": text,
                "confidence": confidence,
                "box": box_data
            })

    return extracted


# ============================================================
# OCR QUALITY
# ============================================================

def calculate_ocr_quality(ocr_result):
    """
    Calculate a simple OCR quality score.

    Returns:
        0.0 - 1.0
    """

    if not ocr_result:
        return 0.0

    text = " ".join(
        item.get("text", "")
        for item in ocr_result
    ).strip()

    if not text:
        return 0.0

    # --------------------------------------------------------
    # Confidence
    # --------------------------------------------------------

    confidences = [
        float(item.get("confidence", 0))
        for item in ocr_result
    ]

    average_confidence = (
        sum(confidences) / len(confidences)
        if confidences
        else 0.0
    )

    # --------------------------------------------------------
    # Text length
    # --------------------------------------------------------

    length_score = min(
        len(text) / 120.0,
        1.0
    )

    # --------------------------------------------------------
    # Alphabetic ratio
    # --------------------------------------------------------

    alphabetic_count = sum(
        char.isalpha()
        for char in text
    )

    alpha_ratio = (
        alphabetic_count / len(text)
        if text
        else 0.0
    )

    # --------------------------------------------------------
    # Combine
    # --------------------------------------------------------

    quality = (
        average_confidence * 0.60
        + length_score * 0.20
        + alpha_ratio * 0.20
    )

    return round(
        float(quality),
        4
    )


# ============================================================
# OCR RESULT COMPARISON
# ============================================================

def choose_best_ocr(
    original_result,
    enhanced_result
):
    """
    Compare OCR from original and enhanced images.

    Enhanced OCR must be meaningfully better before
    replacing the original result.
    """

    original_quality = calculate_ocr_quality(
        original_result
    )

    enhanced_quality = calculate_ocr_quality(
        enhanced_result
    )

    print(
        f"ORIGINAL OCR QUALITY: {original_quality:.3f}"
    )

    print(
        f"ENHANCED OCR QUALITY: {enhanced_quality:.3f}"
    )

    # Enhanced result wins only when it is clearly better.
    if enhanced_quality > original_quality + 0.03:

        print(
            "USING ENHANCED OCR RESULT"
        )

        return enhanced_result

    print(
        "USING ORIGINAL OCR RESULT"
    )

    return original_result


# ============================================================
# EXTRACT TEXT FROM IMAGE
# ============================================================

def extract_text_from_image(
    original_path,
    enhanced_path=None
):
    """
    Smart OCR pipeline.

    1. OCR original image.
    2. If enhanced_path exists, OCR enhanced image.
    3. Compare both.
    4. Return the better OCR result.

    The return format remains the same as before:

        [
            {
                "text": "...",
                "confidence": 0.95,
                "box": [...]
            }
        ]
    """

    # ========================================================
    # OCR ORIGINAL
    # ========================================================

    print(
        "\n========== ORIGINAL IMAGE OCR =========="
    )

    original_result = run_ocr(
        original_path
    )

    original_quality = calculate_ocr_quality(
        original_result
    )

    print(
        f"ORIGINAL OCR TEXT LENGTH: "
        f"{len(' '.join(x['text'] for x in original_result))}"
    )

    print(
        f"ORIGINAL OCR QUALITY: "
        f"{original_quality:.3f}"
    )

    # ========================================================
    # GOOD ENOUGH
    # ========================================================

    if original_quality >= 0.65:

        print(
            "PADDLE OCR QUALITY GOOD"
        )

        return original_result

    # ========================================================
    # ENHANCED OCR
    # ========================================================

    if not enhanced_path or not os.path.exists(
        enhanced_path
    ):

        print(
            "NO ENHANCED IMAGE AVAILABLE"
        )

        return original_result

    print(
        "\n========== ENHANCED IMAGE OCR =========="
    )

    enhanced_result = run_ocr(
        enhanced_path
    )

    # ========================================================
    # COMPARE
    # ========================================================

    return choose_best_ocr(
        original_result,
        enhanced_result
    )


# ============================================================
# PLAIN TEXT
# ============================================================

def get_plain_text(ocr_result):

    return "\n".join(
        item["text"]
        for item in ocr_result
        if item.get("text")
    )

# ============================================================
# SAVE ENHANCED IMAGE
# ============================================================

def enhance_image(input_path, output_path):
    """
    Creates and saves the enhanced image for Document Comparison.
    Returns the path to the saved enhanced image.
    """
    # 1. Run full enhancement pipeline
    enhanced_bgr = preprocess_image(input_path)

    # 2. Save image to destination folder
    success = cv2.imwrite(output_path, enhanced_bgr)

    if not success:
        raise RuntimeError(f"Could not save enhanced image to: {output_path}")

    print(f"ENHANCED IMAGE SAVED: {output_path}")
    return output_path