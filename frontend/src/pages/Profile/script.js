import { drawtheLevel } from "../Home/script.js";




export function profileActions() {
    const spinner = document.querySelector(".image-content #spinner");
    console.log(spinner);
    drawtheLevel(50, spinner);
}