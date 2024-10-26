import { drawtheLevel } from "../Home/script.js";

export function profileActions(id) {
    console.log("id => ", id);
    const spinner = document.querySelector(".image-content #spinner");
    console.log(spinner);
    drawtheLevel(50, spinner);
}