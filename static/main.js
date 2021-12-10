const canvas = document.getElementById("main-canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerHeight * .9;
canvas.height = window.innerHeight * .9;

var black = "#000000";
var red = "#FF0000";
var white = "#999999";
var isRed = null;
var isTurn = null;
var selected = false;
var fetched = false;
var socket = io({"forceNew": true});
var taken = -1;
var pieces = [];

reds = [];
blacks = [];

for (var i = 1; i <= 12; i++){
    reds.push(i);
    blacks.push(i + 12);
}

grid = [
	[1,0,2,0,3,0,4,0],
	[0,5,0,6,0,7,0,8],
	[9,0,10,0,11,0,12,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,16,0],
	[0,13,0,14,0,15,0,0],
	[17,0,18,0,19,0,20,0],
	[0,21,0,22,0,23,0,24]
]

function renderField(grid, context){
	context.clearRect(0, 0, canvas.width, canvas.height);
	document.getElementById("turn").innerHTML = "Is Turn: " + isTurn;
	document.getElementById("color").innerHTML = "Is Red: " + isRed;
	tileWidth = canvas.width / 8;
	tileHeight = canvas.height / 8;
    const fontSize = tileWidth / 1.5;
    context.font = fontSize + 'px serif';
	var on = false;
	for (var y = 0; y < 8; y++){
		for (var x = 0; x < 8; x++){
			context.beginPath();
			if (on){
				context.fillStyle = red;
			}
			else {
				context.fillStyle = black;
			}
			context.fillRect(x*tileWidth, y*tileHeight, tileWidth, tileHeight);
			context.stroke();
			on = !on;
		}
        on = !on
	}
	for (var y = 0; y < 8; y++){
		for (var x = 0; x < 8; x++){
			if (blacks.indexOf(grid[y][x]) != -1){
				context.fillStyle = "#cccccc";
				context.lineWidth = 5;
				if (selected[0] == x && selected[1] == y){
					context.strokeStyle = white;
				}
				else{
					context.strokeStyle = "#aaaaaa";
				}
				context.beginPath();
				context.ellipse((x*tileWidth)+(tileWidth/2), (y*tileHeight)+(tileHeight/2), tileWidth/2-5, tileHeight/2-5, 0, 0, 2*Math.PI);
				context.fill();
				context.stroke();
			}
			else if (reds.indexOf(grid[y][x]) != -1){
				context.fillStyle = red;
				context.lineWidth = 5;
				if (selected[0] == x && selected[1] == y){
					context.strokeStyle = white;
				}
				else{
					context.strokeStyle = "#CC0000";
				}
				context.beginPath();
				context.ellipse((x*tileWidth)+(tileWidth/2), (y*tileHeight)+(tileHeight/2), tileWidth/2-5, tileHeight/2-5, 0, 0, 2*Math.PI);
				context.fill();
				context.stroke();
			}
		}
	}
}

document.onmousedown = click;

function click(e) {
    if (e.which === 1 && isTurn){
		var bounding = canvas.getBoundingClientRect();
		mousePos = {
			x: e.clientX - bounding.left,
			y: e.clientY - bounding.top
		}
        if (mousePos.x >= 0 && mousePos.x <= canvas.width && mousePos.y >= 0 && mousePos.y  <= canvas.height) {
			clickPos = [
				Math.floor(mousePos.x * (8 / canvas.width)),
				Math.floor(mousePos.y * (8 / canvas.height))
			];
			clicked = grid[clickPos[1]][clickPos[0]]
			if (!selected || pieces.indexOf(clicked) != -1){
				if (pieces.indexOf(clicked) != -1){
					selected = [clickPos[0], clickPos[1]];
					renderField(grid, context);
				}
        	}
			else if (isRed){
				if([selected[0] - 1, selected[0] + 1].indexOf(clickPos[0]) != -1 && clickPos[1] == selected[1] + 1){
					if (clicked == 0){
						grid[clickPos[1]][clickPos[0]] = grid[selected[1]][selected[0]];
						grid[selected[1]][selected[0]] = 0;
						selected = false;
						endTurn();
					}
				}
				else if ([selected[0] - 2, selected[0] + 2, selected[0]].indexOf(clickPos[0]) != -1 && clickPos[1] == selected[1] + 2){
					if (grid[selected[1]+1][selected[0]+1] != 0 && pieces.indexOf(grid[selected[1]+1][selected[0]+1]) == -1){
						if (clickPos[0] == selected[0] + 2){
							taken = grid[selected[1]+1][selected[0]+1]
							grid[clickPos[1]][clickPos[0]] = grid[selected[1]][selected[0]];
							grid[selected[1]][selected[0]] = 0;
							grid[selected[1]+1][selected[0]+1] = 0;
							selected = false;
							endTurn();
						}
					}
					else if (grid[selected[1]+1][selected[0]-1] != 0 && pieces.indexOf(grid[selected[1]+1][selected[0]-1]) == -1){
						if (clickPos[0] == selected[0] + 2){
							taken = grid[selected[1]+1][selected[0]-1]
							grid[clickPos[1]][clickPos[0]] = grid[selected[1]][selected[0]];
							grid[selected[1]][selected[0]] = 0;
							grid[selected[1]+1][selected[0]-1] = 0;
							selected = false;
							endTurn();
						}
					}
				}
			}
			else{
				if([selected[0] - 1, selected[0] + 1].indexOf(clickPos[0]) != -1 && clickPos[1] == selected[1] - 1){
					if (clicked == 0){
						grid[clickPos[1]][clickPos[0]] = grid[selected[1]][selected[0]];
						grid[selected[1]][selected[0]] = 0;
						selected = false;
						endTurn();
					}
				}
				else if ([selected[0] - 2, selected[0] + 2, selected[0]].indexOf(clickPos[0]) != -1 && clickPos[1] == selected[1] - 2){
					if (grid[selected[1]-1][selected[0]+1] != 0 && pieces.indexOf(grid[selected[1]-1][selected[0]+1]) == -1){
						if (clickPos[0] == selected[0] + 2){
							taken = grid[selected[1]-1][selected[0]+1]
							grid[clickPos[1]][clickPos[0]] = grid[selected[1]][selected[0]];
							grid[selected[1]][selected[0]] = 0;
							grid[selected[1]-1][selected[0]+1] = 0;
							selected = false;
							endTurn();
						}
					}
					else if (grid[selected[1]-1][selected[0]-1] != 0 && pieces.indexOf(grid[selected[1]-1][selected[0]-1]) == -1){
						if (clickPos[0] == selected[0] - 2){
							taken = grid[selected[1]-1][selected[0]-1]
							grid[clickPos[1]][clickPos[0]] = grid[selected[1]][selected[0]];
							grid[selected[1]][selected[0]] = 0;
							grid[selected[1]-1][selected[0]-1] = 0;
							selected = false;
							endTurn();
						}
					}
				}
			}
		}
	}
}

socket.on("turn", function (data){
	console.log("a turn has occured")
    const event = JSON.parse(data);
	grid = event.grid;
	ind = pieces.indexOf(event.taken);
	ind!=-1?pieces.splice(ind,1):"";
	if (event.isRed != isRed){
		isTurn = true;
	}
	renderField(grid, context)
})

function endTurn(){
	console.log("sending");
	var event = {grid: grid, taken: taken, isRed:isRed};
	event = JSON.stringify(event);
    socket.emit("turn", event);
	isTurn = false;
	renderField(grid, context)
}

socket.on("fetch", function (){
	console.log("someone wants to fetch " + fetched)
	if (fetched){
		console.log("sending data")
		var event = {grid: grid, isRed: false};
		event = JSON.stringify(event);
    	socket.emit("init", event);
		isTurn = true;
		renderField(grid, context)
	}
})

socket.on("init", function (data){
	console.log("someone inited")
	if (!fetched){
		console.log("inited")
		data = JSON.parse(data);
		console.log(data)
		grid = data.grid;
		isRed = data.isRed;
		isTurn = false;
		if (isRed){
			pieces = reds;
		}
		else{
			pieces = blacks;
			renderField(grid, context);
		}
	}
	renderField(grid, context);
	fetched = true;
})

window.onbeforeunload = function () {
	socket.disconnect();
}

window.addEventListener("DOMContentLoaded", ()=>{
	renderField(grid, context);
})