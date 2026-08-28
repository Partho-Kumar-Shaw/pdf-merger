# 📄 PDF-Merger 

A simple yet powerful web application for merging multiple PDF and DOCX files into a single document. Built with Flask and designed for ease of use with a clean, intuitive interface.

---

## 🌟 Features

- **Multi-format Support**: Merge PDF, DOCX, and TXT files
- **Easy Upload Interface**: Drag-and-drop or click to upload multiple files
- **Automatic File Handling**: Intelligently processes different file formats
- **Duplicate Prevention**: Automatically filters out duplicate file uploads
- **Lightweight**: Minimal dependencies and fast processing
- **Secure File Handling**: Uses secure filename handling to prevent security vulnerabilities.
- **Smart Output**: Returns merged PDF if available, otherwise returns merged DOCX

---

## 📋 Requirements

- Python 3.7+
- Flask
- PyPDF2
- python-docx
- docxcompose

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Partho-Kumar-Shaw/pdf-merger.git
cd pdf-merger
```

### 2. Create a Virtual Environment (Optional but Recommended)

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Application

```bash
python app.py
```

The application will start on `http://localhost:5000`

---

## 📖 Usage

1. **Open the Application**: Navigate to `http://localhost:5000` in your web browser
2. **Upload Files**: Click the upload area or drag-and-drop your files
3. **Select Files**: Choose one or more PDF, DOCX, or TXT files
4. **Merge**: Click the merge button
5. **Download**: Your merged file will automatically download

---

## 🗂️ Project Structure

```
pdf-merger/
│
├── app.py                    # Main Flask application
├── requirements.txt          # Python dependencies
├── .gitignore               # Git ignore file
│
├── templates/               # HTML templates folder
│   ├── index.html          # Home page
│   ├── features.html       # Features page
│   └── about.html          # About page
│
├── static/                  # Static assets folder
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript files
│   └── img/                # Images
│
├── uploads/                 # Temporary uploaded files (auto-created)
└── merged/                  # Merged output files (auto-created)
```

---

## 🔧 API Endpoints

### `GET /`
Returns the home page with the upload interface.

**Response**: HTML page

---

### `GET /features`
Returns the features page describing the application capabilities.

**Response**: HTML page

---

### `GET /about`
Returns the about page with information about the project.

**Response**: HTML page

---

### `POST /merge`
Merges uploaded files and returns the combined document.

**Request**:
- `Content-Type`: multipart/form-data
- `files`: List of files to merge (PDF, DOCX, or TXT)

**Response**:
- Success: Downloads the merged file (PDF or DOCX)
- Error: Returns appropriate error message

---

## ⚙️ Configuration

### File Upload Settings

Edit the following variables in `app.py` to customize:

```python
UPLOAD_FOLDER = "uploads"          # Folder for temporary uploads
MERGED_FOLDER = "merged"           # Folder for merged outputs
MAX_FILE_SIZE = 50 * 1024 * 1024   # Maximum file size (50 MB)
ALLOWED_EXTENSIONS = ['pdf', 'docx', 'txt']  # Allowed file types
```

---

## 🎯 How It Works

1. **File Upload**: User uploads multiple files via the web interface
2. **Validation**: Application checks:
   - File format is allowed
   - File is not a duplicate
   - File size is within limits
3. **Processing**:
   - **PDF Files**: Combined using PyPDF2
   - **DOCX Files**: Merged using python-docx and docxcompose
   - **TXT Files**: Accepted but processed as documents
4. **Output**: 
   - If PDFs exist, returns merged PDF
   - Otherwise, returns merged DOCX
   - If nothing to merge, returns error message

---

## 🔒 Security Features

- **Secure Filenames**: Uses `secure_filename()` to prevent path traversal attacks
- **File Validation**: Only allows specified file extensions
- **Duplicate Prevention**: Prevents processing duplicate files
- **File Size Limits**: Enforces maximum file size restrictions

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| Flask | Latest | Web framework |
| PyPDF2 | Latest | PDF manipulation |
| python-docx | Latest | DOCX file handling |
| docxcompose | Latest | DOCX merging |
| Werkzeug | Latest | WSGI utilities |

---

## 🚨 Troubleshooting

### Issue: "ModuleNotFoundError"
**Solution**: Ensure all dependencies are installed:
```bash
pip install -r requirements.txt
```

### Issue: Port 5000 already in use
**Solution**: Change the port in `app.py`:
```python
app.run(debug=True, port=5001)
```

### Issue: Files not merging
**Solution**: 
- Verify file format is supported
- Check file is not corrupted
- Ensure sufficient disk space

### Issue: Permission denied for uploads folder
**Solution**: 
```bash
chmod -R 755 uploads merged
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Partho Kumar Shaw**
- GitHub: [@Partho-Kumar-Shaw](https://github.com/Partho-Kumar-Shaw)

---

## 💡 Future Enhancements

- [ ] Support for additional file formats (PPT, Excel, etc.)
- [ ] Batch processing multiple merge operations
- [ ] Advanced PDF options (page reordering, splitting)
- [ ] User authentication and file management
- [ ] Progress tracking for large files
- [ ] Email delivery of merged files
- [ ] Cloud storage integration (AWS S3, Google Drive)
- [ ] REST API for programmatic access

---

## ⭐ Show Your Support

If you find this project helpful, please consider:
- Starring the repository
- Sharing with others
- Contributing improvements
- Reporting bugs and suggesting features

---

## 📞 Support & Contact

For issues, questions, or suggestions:
- Open an [GitHub Issue](https://github.com/Partho-Kumar-Shaw/pdf-merger/issues)
- Contact via GitHub profile

---


