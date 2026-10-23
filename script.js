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

function upload(type){
    cloudinary.openUploadWidget({
        clooudName: cloudName,
        uploadPreset: uploadPreset,
        resourceType: type,
        tags: ["goa"],
        sources: ["local"]
    }, (error, result) => {
        if (result && result.evet === "success"){
            addCard(type, result.info.public_id);
        }
    });
}

loadAll("image");
loadAll("video");