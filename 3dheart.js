const screen = document.getElementById("screen");

const width = 80;
const height = 50;

let angle = 0.0;

let z_buffer = new Array(width * height).fill(0);

const shades = " .,-~:;=!*#$@@";
const colorMap = {
    ' ': '#000000',
    '.': '#540518ff',
    ',': '#6c051fff',
    '-': '#7a1232ff',
    '~': '#8d173eff',
    ':': '#9e1f4bff',
    ';': '#c33260ff',
    '=': '#de496cff',
    '!': '#f26c87ff',
    '*': '#f08592ff',
    '#': '#f1a2a2ff',
    '$': '#facabaff',
    '@': '#ffeecfff'
};

function render(){
    let maxz = 0.0;
    const cosa = Math.cos(angle);
    const sina = Math.sin(angle);
    z_buffer.fill(0);

    const centerX = width / 2;
    const centerY = height / 2;

    for(let y = -0.8; y <= 0.8; y+= 0.02){
        for(let x = -0.8; x <= 0.8; x+= 0.02){
            let z_value = -x*x - Math.pow(1.2*y - Math.abs(x) * 2/3, 2) + 0.5*0.5;
            if(z_value >= 0){
                z_value = Math.sqrt(z_value) / (2 - y*0.5);
                for(let z = -z_value; z <= z_value; z += z_value/5 ){
                    const rotate_x = x * cosa - z * sina;
                    const rotate_z = x * sina + z * cosa;

                    const p = 1 + rotate_z / 2;
                    const posx = Math.round(centerX + rotate_x * p * 60);
                    const posy = Math.round(centerY - y * p * 32);
                    const indx = posx + posy * width;

                    if(indx >= 0 && indx < width * height){
                        if(z_buffer[indx] <= rotate_z){
                            z_buffer[indx] = rotate_z;
                            if(rotate_z > maxz) maxz = rotate_z;
                        }
                    }
                }
            }

        }
    }


    let outputHTML = "";

    for(let i = 0; i < width * height; i++){
        if(i%width){
            if(maxz > 0){
                let level = Math.round(z_buffer[i] / maxz * (shades.length - 1));
                level = Math.max(0, Math.min(level,shades.length - 1));
                const shade = shades[level];
                const color = colorMap[shade];
                outputHTML += `<span style="color:${color}">${shade}</span>`;
            } else{
                outputHTML += " ";
            }
        } else{
            outputHTML += "<br>";
        }
    }

screen.innerHTML = outputHTML;
angle += 0.02;
requestAnimationFrame(render);
}


render();
