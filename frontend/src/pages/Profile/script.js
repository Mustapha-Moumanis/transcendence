import { drawtheLevel } from "../Home/script.js";

export function profileActions() {
    const spinner = document.querySelector("#spiner");
    console.log(spinner);
    drawtheLevel(50, spinner);
}