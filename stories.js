const storiesUrl = "https://script.google.com/macros/s/AKfycbzv56eG5YKzZr_zX1Yiapkv-yfrleiEnYD2zL62fmQPCPbv0St9NllhOM8R8oIWBzStFQ/exec";

let stories = [];

fetch(storiesUrl)
    .then(Response => Response.json())
    .then(data => {
        stories = data;
        const select = document.querySelector("select");
        stories.forEach((story, i) => select.add(new Option(story.name, i)));
    });

function showStory(i) {
    document.querySelector("#friends div").replaceChildren();
    if(i === "")return;

    stories[i].days.forEach((text, day) => addArticle(`Day ${day + 1}`, text));
    if (stories[i].conclusion) addArticle("Conclusion", stories[i].conclusion);
}

function addArticle(title, text) {
    const article = document.createElement("article");
    const heading = document.createElement("h3");
    heading.textContent = title;
    article.append(heading, text);
    document.querySelector("#friends div").append(article);
}