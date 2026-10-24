const scriptUrl = "https://script.google.com/macros/s/AKfycbyzBZ3onlqAVYETA6sfo5xsGJUQd3tB_gB00hhcv7vg82r0qHu0XCRZhJghP06JKgtOyQ/exec";
const storiesUrl = "https://script.google.com/macros/s/AKfycbzv56eG5YKzZr_zX1Yiapkv-yfrleiEnYD2zL62fmQPCPbv0St9NllhOM8R8oIWBzStFQ/exec";
const photoIds = [];
let page = 0;

function showPage(n){
    if(photoIds.length === 0) return;
    page = (n + photoIds.length) % photoIds.length;
    document.querySelector("#photos img").src = `https://drive.google.com/thumbnail?id=${photoIds[page]}&sz=w1000`;
    document.querySelector("#photos p span").textContent = `${page+1} of ${photoIds.length}`;
}

function addCard(file){
    if (file.type.startsWith("image/")){
        photoIds.push(file.id);
    } else {
        const video = document.createElement("iframe");
        video.src = `https://drive.google.com/file/d/${file.id}/preview`;
        video.allow = "autoplay; fullscreen";
        document.querySelector("#videos div").prepend(video);
    }
}

function loadAll(){
    fetch(scriptUrl)
        .then(response => response.json())
        .then(files => {
            files.forEach(addCard);
            showPage(0);
        });
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
    showPage(photoIds.length-1);
    buttonText.textContent = oldText;
    input.value = "";
}

loadAll();


const form = document.querySelector("#write form");

const draft = JSON.parse(localStorage.getItem("goaDraft"));
if (draft) {
    for (const name in draft) {
        form.elements[name].value = draft[name];
    }
}

form.oninput = () => {
    const story = Object.fromEntries(new FormData(form));
    localStorage.setItem("goaDraft", JSON.stringify(story));
};

form.onsubmit = async event => {
    event.preventDefault();
    const button = form.querySelector("button");
    button.textContent + "Sending............";
    button.disabled = true;

    try {
        const story = Object.fromEntries(new FormData(form));
        const response = await fetch(storiesUrl, { method: "POST", body: JSON.stringify(story) });
        await response.json();

        localStorage.removeItem("goaDraft");
        form.outerHTML = `<p>Thank you, your story has been shared and saved. !! <a href="stories.html">Read everyone's stories</p>`
    } catch {
        alert("Your story could not be sent. Check your wifi and try again. Do not worry your writing is still saved.");
        button.textContent = "Submit my story";
        button.disabled = false;
    }
};