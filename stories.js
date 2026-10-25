const storiesUrl = "https://script.google.com/macros/s/AKfycbzv56eG5YKzZr_zX1Yiapkv-yfrleiEnYD2zL62fmQPCPbv0St9NllhOM8R8oIWBzStFQ/exec";

let stories = [];

fetch(storiesUrl)
    .then(Response => Response.json())
    .then(data => {
        stories = data;
        const select = document.querySelector("select");
        select.options[0].textContent = stories.length === 0 ? "No stories yet" : "Pick a frined";
        stories.forEach((story, i) => select.add(new Option(story.name, i)));
        showStats();
        const friend = new URLSearchParams(location.search).get("friend");
        if (friend){
            const i = stories.findIndex(story => String(story.name).toLowerCase() === friend.toLowerCase());
            if (i !== -1){
                select.value = i;
                showStory(i);
            }
        }
    })
    .catch(()=> {
        document.querySelector("select").options[0].textContent = "Couldn't load stories. Refresh to try again brehhhh.";
    });

function showStory(i) {
    document.querySelector("#friends div").replaceChildren();
    document.querySelector("#friends p button").hidden = i === "";
    if(i === ""){
        history.replaceState(null, "", location.pathname);
        return;
    }
    history.replaceState(null, "", "?friend=" + encodeURIComponent(stories[i].name));

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

async function copyLink(button){
    await navigator.clipboard.writeText(location.href);
    button.textContent = "Link copied !!!!!!!!";
    setTimeout(() => button.textContent = "Copy Link to this story if you wanna share it", 2000);
}

const places = {
    "Baga Beach": ["baga"],
    "Candolim Beach": ["candolim"],
    "Fort Agogda": ["fort", "agoda"],
    "Dona paula": ["paula"],
    "the cruise": ["cruise", "boat", "ship"],
    "Bom Jesus church": ["church", "basilica"],
    "Mangeshi Temple": ["temple", "mangeshi", "mangeshri"],
    "Hotel Citrus": ["citrus"]
};

function countWords(text){
    return text.split(/\s+/).filter(word => word !== "").length;
}

function showStats() {
    if (stories.length === 0) return;

    let totalWords = 0;
    let longest = { name: "", works: 0 };
    const mentions = {};

    for (const story  of stories){
        const allText = [...story.days, story.conclusion].join(" ");
        const words = countWords(allText);
        totalWords += words;
        if (words > longest.words)
            longest = { name: story.name, words: words };

        const wordList = allText.toLowerCase().split(/[^a-z]+/);
        for (const place in places){
            if (places[place].some(keyword => wordList.includes(keyword))){
                mentions[place]= (mentions[place] || 0) +1;
            }
        }
    }

    let topPlace = "";
    for (const place in mentions) {
        if(topPlace === "" || mentions[place] > mentions[topPlace]) topPlace = place;

    }

    const friends = stories.length === 1 ? "friend has" : "friends have";
    addStat(stories.length, `${friends} written`);
    addStat(totalWords.toLocaleString("en-IN"), "words in total");
    if (topPlace) addStat(topPlace, ` is mentioned most (by ${mentions[topPlace]} words)`);
    addStat(longest.name, ` wrote the longest story (${longest.words.toLocaleString("en-IN")} words)`);
}

function addStat(boldPart, rest){
    item.append(boldPart, rest);
    document.querySelector("#friends ul").append(item);
}