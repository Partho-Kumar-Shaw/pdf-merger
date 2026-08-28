document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const browseBtn = document.getElementById("browseBtn");
    const dropZone = document.getElementById("dropZone");
    const previewContainer = document.getElementById("previewContainer");
    const previewContainerWrapper = document.getElementById("previewContainerWrapper");
    const fileCountSpan = document.getElementById("fileCount");
    const clearAllBtn = document.getElementById("clearAllBtn");
    const progressBar = document.getElementById("progressBar");
    const progressPercent = document.getElementById("progressPercent");
    const progressWrapper = document.getElementById("progressWrapper");
    const uploadForm = document.getElementById("uploadForm");
    const submitBtn = document.getElementById("submitBtn");

    let fileList = [];

    if (!fileInput || !uploadForm) return;

    // Trigger file dialog
    if (browseBtn) {
        browseBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            fileInput.click();
        });
    }

    if (dropZone) {
        dropZone.addEventListener("click", () => {
            fileInput.click();
        });

        // Drag & Drop events
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.add("dragover");
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.remove("dragover");
            }, false);
        });

        dropZone.addEventListener("drop", (e) => {
            const dt = e.dataTransfer;
            const droppedFiles = dt.files;
            handleFiles(droppedFiles);
        });
    }

    fileInput.addEventListener("change", () => {
        handleFiles(fileInput.files);
    });

    function handleFiles(files) {
        const allowedExts = ['pdf', 'docx', 'txt', 'png', 'jpg', 'jpeg'];
        const newFiles = Array.from(files);

        newFiles.forEach(file => {
            const ext = file.name.split('.').pop().toLowerCase();
            if (!allowedExts.includes(ext)) {
                showToast(`Unsupported file format: .${ext}`, "danger");
                return;
            }
            if (file.size > 50 * 1024 * 1024) {
                showToast(`${file.name} exceeds maximum size limit of 50MB`, "warning");
                return;
            }
            // Check duplicates
            if (!fileList.some(f => f.name === file.name && f.size === file.size)) {
                fileList.push(file);
            }
        });

        updatePreview();
    }

    function updatePreview() {
        if (!previewContainer) return;
        previewContainer.innerHTML = "";

        if (fileList.length === 0) {
            previewContainerWrapper.classList.add("d-none");
            fileCountSpan.innerText = "0";
            return;
        }

        previewContainerWrapper.classList.remove("d-none");
        fileCountSpan.innerText = fileList.length;

        fileList.forEach((file, index) => {
            const fileItem = document.createElement("div");
            fileItem.classList.add("file-item");
            fileItem.setAttribute("data-index", index);

            const ext = file.name.split('.').pop().toLowerCase();
            let iconClass = "fa-file text-slate-300";
            if (ext === "pdf") iconClass = "fa-file-pdf text-danger";
            else if (ext === "docx") iconClass = "fa-file-word text-primary";
            else if (ext === "txt") iconClass = "fa-file-lines text-info";
            else if (["png", "jpg", "jpeg"].includes(ext)) iconClass = "fa-file-image text-warning";

            const formattedSize = formatBytes(file.size);

            fileItem.innerHTML = `
                <div class="file-info">
                    <div class="file-icon-badge">
                        <i class="fa-solid ${iconClass}"></i>
                    </div>
                    <div>
                        <div class="file-name" title="${file.name}">${file.name}</div>
                        <div class="file-meta"><span class="badge bg-white bg-opacity-10 text-uppercase me-1">${ext}</span> ${formattedSize}</div>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="text-muted fs-7 me-2 d-none d-md-inline"><i class="fa-solid fa-grip-vertical"></i></span>
                    <button type="button" class="btn btn-action-danger remove-btn" data-index="${index}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;

            previewContainer.appendChild(fileItem);
        });

        // Initialize Sortable JS for drag reordering
        if (typeof Sortable !== 'undefined') {
            new Sortable(previewContainer, {
                animation: 180,
                ghostClass: 'sortable-ghost',
                onEnd: function (evt) {
                    const movedItem = fileList.splice(evt.oldIndex, 1)[0];
                    fileList.splice(evt.newIndex, 0, movedItem);
                    updatePreview();
                }
            });
        }

        // Attach remove buttons
        document.querySelectorAll(".remove-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.getAttribute("data-index"));
                fileList.splice(idx, 1);
                updatePreview();
            });
        });
    }

    if (clearAllBtn) {
        clearAllBtn.addEventListener("click", () => {
            fileList = [];
            fileInput.value = "";
            updatePreview();
        });
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // Handle Form Submit
    uploadForm.addEventListener("submit", (e) => {
        if (fileList.length === 0) {
            e.preventDefault();
            showToast("Please upload at least one file before merging.", "warning");
            return;
        }

        // Populate DataTransfer to submit form
        const dt = new DataTransfer();
        fileList.forEach(file => dt.items.add(file));
        fileInput.files = dt.files;

        // Show progress bar
        if (progressWrapper) progressWrapper.classList.remove("d-none");
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-2"></i> Merging Files...`;
        }

        let width = 10;
        const interval = setInterval(() => {
            if (width >= 90) {
                clearInterval(interval);
            } else {
                width += 15;
                if (progressBar) progressBar.style.width = width + "%";
                if (progressPercent) progressPercent.innerText = width + "%";
            }
        }, 150);

        // Reset submit button state after download starts
        setTimeout(() => {
            if (progressBar) progressBar.style.width = "100%";
            if (progressPercent) progressPercent.innerText = "100%";
            setTimeout(() => {
                if (progressWrapper) progressWrapper.classList.add("d-none");
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<i class="fa-solid fa-layer-group fs-5 me-2"></i> Merge & Download Document`;
                }
            }, 1000);
        }, 2000);
    });

    function showToast(message, type = "info") {
        const toast = document.createElement("div");
        toast.classList.add("glass-toast");
        toast.innerHTML = `
            <i class="fa-solid fa-circle-exclamation text-warning fs-5"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 4000);
    }
});