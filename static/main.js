const canvas = document.getElementById("main-canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerHeight * .9;
canvas.height = window.innerHeight * .9;

var color1 = "#222222";
var color2 = "#FF2222";
var red = "#FF0000"
var black = "000000"


grid = []
for (var i = 0; i < 8; i++){
    temp = [];
    for (var j = 0; j < 8; j++){
        temp.push(0)
    }
    grid.push(temp)
}

reds = []
blacks = []

for (var i = 1; i <= 12; i++){
    reds += i
    blacks += i + 12
}

renderField(grid, context)

function renderField(grid, context){
	context.clearRect(0, 0, canvas.width, canvas.height);
	tileWidth = canvas.width / 8;
	tileHeight = canvas.height / 8;
    const fontSize = tileWidth / 1.5;
    context.font = fontSize + 'px serif';
	var on = true;
	for (var y = 0; y < 8; y++){
		for (var x = 0; x < 8; x++){
			context.beginPath();
			if (on){
				context.fillStyle = color1;
			}
			else {
				context.fillStyle = color2;
			}
			context.fillRect(x*tileWidth, y*tileHeight, tileWidth, tileHeight);
			context.stroke();
			context.beginPath();
			
			on = !on;
		}
        on = !on
	}
}