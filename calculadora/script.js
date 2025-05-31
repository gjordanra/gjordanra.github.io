console.log ("Inicio");
const display = document.querySelector("#display");
const buttons = document.querySelectorAll("button");
buttons.forEach( (item) => {
    item.onclick = () => {
        if (item.id == "=" && display.innerText == ""){
            display.innerText = "Digita un numero";
            setTimeout( () =>(display.innerText = ""), 1500);
        }
        if (item.id == "clear"){
            display.innerText = "";
        } else if(item.id == "backspace"){
            let string = display.innerText.toString();
            display.innerText = string.substr(0, string.length-1);
        } else if (item.id != "" && item.id == "=") {
            display.innerText = eval (display.innerText);
        } else {
            display.innerText += item.id; 
        }
    };

} );
const themeTogglerBtn = document.querySelector(".theme-toggler");
const calculator = document.querySelector(".calculator");
let isDark = true;
themeTogglerBtn.onclick=()=>{
    console.log("clic");
    calculator.classList.toggle("dark");
    themeTogglerBtn.classList.toggle("active");
    isDark = !isDark;
};
