import os
import unicodedata


def get_project_root():
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def normalize_text(text: str) -> str:
    normalized = unicodedata.normalize("NFD", text)
    ascii_text = "".join(
        c for c in normalized if unicodedata.category(c) != "Mn"
    )
    return ascii_text


def slugify(text: str) -> str:
    text = normalize_text(text)
    text = text.lower()
    text = text.replace(" ", "-")
    text = "".join(c for c in text if c.isalnum() or c == "-")
    return text