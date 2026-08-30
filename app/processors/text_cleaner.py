import re


def clean_text(text: str) -> str:

    # Normalize line endings
    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")

    # Remove extra spaces and tabs
    text = re.sub(r"[ \t]+", " ", text)

    # Split into paragraphs
    paragraphs = re.split(r"\n\s*\n", text)

    cleaned_paragraphs = []

    for paragraph in paragraphs:

        lines = paragraph.split("\n")
        cleaned_lines = []

        for line in lines:
            line = line.strip()

            # Skip empty lines
            if not line:
                continue

            # Remove standalone page numbers
            if re.fullmatch(r"\d{1,4}", line):
                continue

            # Remove page number at the END of a long text line
            # Example:
            # "Quantum computing and the financial system 2"
            if len(line) > 30:
                line = re.sub(r"\s+\d{1,4}$", "", line)

            cleaned_lines.append(line)

        # Join broken lines inside the paragraph
        cleaned_paragraph = " ".join(cleaned_lines)

        if cleaned_paragraph:
            cleaned_paragraphs.append(cleaned_paragraph)

    # Keep paragraph separation
    return "\n\n".join(cleaned_paragraphs)