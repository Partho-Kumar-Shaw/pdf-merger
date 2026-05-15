from flask import Flask, render_template, request, send_file
from PyPDF2 import PdfMerger
from werkzeug.utils import secure_filename
from docx import Document
from docxcompose.composer import Composer

import os
import uuid

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
MERGED_FOLDER = "merged"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(MERGED_FOLDER, exist_ok=True)

MAX_FILE_SIZE = 50 * 1024 * 1024

ALLOWED_EXTENSIONS = ['pdf', 'docx', 'txt']


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/features")
def features():
    return render_template("features.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/merge", methods=["POST"])
def merge_files():

    uploaded_files = request.files.getlist("files")

    if not uploaded_files:
        return "No Files Uploaded"

    pdf_merger = PdfMerger()

    docx_files = []

    output_id = str(uuid.uuid4())

    merged_pdf_path = os.path.join(MERGED_FOLDER, f"{output_id}.pdf")
    merged_docx_path = os.path.join(MERGED_FOLDER, f"{output_id}.docx")

    duplicate_checker = set()

    for file in uploaded_files:

        if file.filename == '':
            continue

        if not allowed_file(file.filename):
            continue

        filename = secure_filename(file.filename)

        if filename in duplicate_checker:
            continue

        duplicate_checker.add(filename)

        save_path = os.path.join(UPLOAD_FOLDER, filename)

        file.save(save_path)

        extension = filename.rsplit('.', 1)[1].lower()

        if extension == "pdf":
            pdf_merger.append(save_path)

        elif extension == "docx":
            docx_files.append(save_path)

    # Merge PDFs
    if len(pdf_merger.pages) > 0:
        pdf_merger.write(merged_pdf_path)
        pdf_merger.close()

    # Merge DOCX
    if len(docx_files) > 0:

        master = Document(docx_files[0])
        composer = Composer(master)

        for doc in docx_files[1:]:
            composer.append(Document(doc))

        composer.save(merged_docx_path)

    # Download PDF if exists else DOCX
    if os.path.exists(merged_pdf_path):
        return send_file(merged_pdf_path, as_attachment=True)

    elif os.path.exists(merged_docx_path):
        return send_file(merged_docx_path, as_attachment=True)

    return "Nothing to Merge"


if __name__ == "__main__":
    app.run(debug=True)