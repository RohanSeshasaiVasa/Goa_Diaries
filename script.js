const scriptUrl = "https://script.google.com/macros/s/AKfycbyzBZ3onlqAVYETA6sfo5xsGJUQd3tB_gB00hhcv7vg82r0qHu0XCRZhJghP06JKgtOyQ/exec";

function addCard(file){
    if (file.type.startsWith("image/")){
        const img = document.createElement("img");
        img.src = `https://drive.google.com/thumbnail?id=${file.id}&sz=w600`;
        document.querySelector("#photos div").prepend(img);
    } else {
        const video = document.createElement("iframe");
        video.src = `https://drive.google.com/file/d/${file.id}/preview`;
        video.allow = "autolay; fullscreen";
        document.querySelector("#videos div").prepend(video);
    }
}

function loadAll(){
    fetch(scriptUrl)
        .then(response => response.json())
        .then(files => files.forEach(addCard));
}

function readFile(file) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.readAsDataURL(file);
    });
}

async function upload(input) {
    const buttonText = input.previousElementSibling;
    const oldText = buttonText.textContent;
    buttonText.textContent = "Uploading.....";
    for (const file of input.files) {
        if (file.size > 35 * 1024 * 1024) {
            alert(file.name + "is bigger than 35mb, so it cannot be uploaded.");
            continue;
        }
        try {
            const response = await fetch(scriptUrl, {
                method: "POST",
                body: JSON.stringify({ name: file.name, type: file.type, data: await readFile(file) })
            });
            addCard(await response.json());
        } catch {
            alert("COuld not upload " + file.name);
        }
    }
    buttonText.textContent = oldText;
    input.value = "";
}

loadAll();