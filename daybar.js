function updateBar() {
    const days = document.querySelectorAll("article");
    const middle = window.innerHeight/2;
    let text = "";

    for(const day of days){
        if(day.getBoundingClientRect().top < middle){
            text = day.querySelector("h3").textContent.replace("-", "");
        }
    }
    const lastDay = days[days.length -1];
    if(lastDay && lastDay.getBoundingClientRect().bottom <middle) {
        text = "";
    }
    const bar = document.querySelector("#day-bar");
    bar.textContent = text;
    bar.hidden = text === "";
}

window.addEventListener("scroll", updateBar);