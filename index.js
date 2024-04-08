let Video = null
let canvas = null
let ctx = null

let scaler = 0.8 //scaler for video
let size = { x: 0, y: 0, width: 0, height: 0 }

let rows = 3
let cols = 3
let pieces = []

function main() {
    canvas = document.getElementById("mycanvas")
    ctx = canvas.getContext("2d")




    // Request access to user's camera
    let promise = navigator.mediaDevices.getUserMedia({ video: true });

    promise.then(function (signal) {
        Video = document.createElement("video")
        Video.srcObject = signal;
        Video.play();
        Video.onloadeddata = function () {

            handleResize();
            //enable below for responsive
            // window.addEventListener('resize', handleResize)

            initialisePieces(rows,cols)
            updateCanvas();
        }
    }).catch(function (err) {
        alert("Camera error : " + err);
    });
    console.log("main")
}

//resize happen when tab ratio changes
function handleResize(){
    //so this will also resize not just camera screen when chaniging ratio of yab
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

     //to get min ratio screen size and video size
     let resizer = scaler *
     Math.min(
         window.innerWidth / Video.videoWidth,
         window.innerHeight / Video.videoHeight
     );

 size.width = resizer * Video.videoWidth,
     size.height = resizer * Video.videoHeight

 //starting point of video(setting video to he center)
 size.x = window.innerWidth / 2 - size.width / 2
 size.y = window.innerHeight / 2 - size.height / 2
 
}

//drwa the video upto the canvas
function updateCanvas() {
    //drawing video is now shifted t pieces !!
    // ctx.drawImage(Video,
    //     size.x, size.y,
    //     size.width, size.height);

    //drwaing pieces(cells)
    for(let i=0;i<pieces.length;i++){
        pieces[i].draw(ctx)
    }

    //now to update frame , we will this function recursively
    window.requestAnimationFrame(updateCanvas)
}


function initialisePieces(row, col){
    
    rows = row;
    cols = col;
    pieces=[]
    for(let i=0; i<rows;i++){
        for(let j=0; j<cols; j++){
            pieces.push(new Piece(i,j))
        }
    }
}
class Piece{
    constructor(rowIndex,colIndex){
        this.rowIndex=rowIndex
        this.colIndex=colIndex

        //calculating starting point of cell()
        this.x=size.x+size.width*this.colIndex/cols;
        this.y=size.y+size.height*this.rowIndex/rows;

        this.width=size.width/cols;
        this.height=size.height/rows;
    }

    draw(ctx){
        ctx.beginPath();
        ctx.drawImage(Video,
            this.colIndex * Video.videoWidth/cols,
            this.rowIndex * Video.videoHeight/rows,
            Video.videoWidth/cols,
            Video.videoHeight/rows,
            this.x,
            this.y,
            this.width,
            this.height
        )
        ctx.rect(this.x,this.y,this.width,this.height)
        ctx.stroke()
    }
}