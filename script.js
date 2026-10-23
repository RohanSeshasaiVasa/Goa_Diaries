const cloudName = "fnorb2k1";
const uploadPreset = "goa-trip";

function addCard(type, id) {
    if (type === "image"){
        const img = document.createElement("img");
        img.src = `https://res.cloudinary.com/${cloudName}/image/upload/w_600/${id}.jpg`;
        document.querySelector("#photos div").prepend(img);
    } else {
        const video = document.createElement("video");
        video.src = `https://res.cloudinary.com/${cloudName}/video/upload/${id}`;
        video.controls = true;
        document.querySelector("#videos div").prepend(video);
    }
}

function loadAll(type) {
    fetch(`https://res.cloudinary.com/${cloudName}/${type}/list/goa.json`)
        .then(response => response.json())
        .then(data => data.resources.forEach(file => addCard(type, file.public_id)))
        .catch(() => {}); 
}

async function upload(type, input) {
    const buttonText = input.previousElementSibling;
    const oldtext = buttonText.textContent;
    buttonText.textContent = "Uploading.....................";

    for(const file of input.files){
        const form = new FormData();
        form.append("file", file);
        form.append("upload_preset", uploadPreset);
        form.append("tags", "goa");

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`, {
            method: "POST",
            body: form
        });
        const result = await response.json();

        if(resizeTo.public_id) {
            addCard(type, result.public_id);
        } else {
            alert("Upload failed: " + result.error.message);
        }
    }

    buttonText.textContent = oldtext;
    input.value = "";
}

loadAll("image");
loadAll("video");