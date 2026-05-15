const fileInput = document.getElementById("fileInput");
const browseBtn = document.getElementById("browseBtn");
const previewContainer = document.getElementById("previewContainer");
const progressBar = document.getElementById("progressBar");

browseBtn.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", previewFiles);

function previewFiles(){

    previewContainer.innerHTML = "";

    const files = Array.from(fileInput.files);

    files.forEach((file,index)=>{

        if(file.size > 50 * 1024 * 1024){
            alert(`${file.name} exceeds 50MB`);
            return;
        }

        const div = document.createElement("div");

        div.classList.add("file-item");

        div.innerHTML = `
        <i class="fa-solid fa-file"></i>
        ${file.name}
        <span class="float-end text-danger remove-btn" style="cursor:pointer">
        <i class="fa-solid fa-trash"></i>
        </span>
        `;

        previewContainer.appendChild(div);

    });

    new Sortable(previewContainer,{
        animation:150
    });

}

document.getElementById("uploadForm").addEventListener("submit",(e)=>{

    let width = 0;

    const interval = setInterval(()=>{

        if(width >= 100){
            clearInterval(interval);
        }else{
            width += 10;
            progressBar.style.width = width + "%";
            progressBar.innerText = width + "%";
        }

    },200);

});