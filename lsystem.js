window.onload = startDemo;

function startDemo() {
    canvas = document.getElementById("thecanvas");
    if (canvas && canvas.getContext) {
        var ctx = canvas.getContext("2d");
        drawTree(ctx, 400, 400);
    }
}

var x_stack = [];
var y_stack = [];
var alpha_stack = [];
var step_stack = [];

var step = 70;
const stepDelta = 0.8;

var x, y, alpha;
const angleDelta = Math.PI/6;

function pushState() {
    x_stack.push(x);
    y_stack.push(y);
    alpha_stack.push(alpha);
    step_stack.push(step);
}

function popState() {
    x = x_stack.pop();
    y = y_stack.pop();
    alpha = alpha_stack.pop();
    step = step_stack.pop();
}

function logoHome(xpos, ypos) {
    x = xpos;
    y = ypos;
    alpha = 0.0;
}

function logoForward(ctx) {
    ctx.beginPath()
    ctx.moveTo(x, y);
    x += step * Math.cos(alpha);
    y += step * Math.sin(alpha);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.stroke();
}

function logoLeft() {
    alpha -= angleDelta;
}

function logoRight() {
    alpha += angleDelta;
}

function logoSmallerStep() {
    step *= stepDelta;
}

function applyRule(axiom, rule, maxiter) {
    var src = "";
    var dst = "";
    console.log("rule:  " + rule);
    console.log("axiom: " + axiom);
    src += axiom;
    var rightSide = rule.substring(2);
    console.log("right: " + rightSide);

    for (var iter=0; iter<maxiter; iter++) {
        console.log("iteration: " + iter);
        for (var i=0; i<src.length; i++) {
            if (src[i] == rule[0]) {
                dst += rightSide;
            }
            else {
                dst += src[i];
            }
        }
        console.log("result:    " + dst);
        src = dst;
        dst = "";
    }
    return src;
}

function drawTree(ctx, width, height) {
    var xpos = width >> 1;
    var ypos = height >> 1;

    var axiom = "FX";
    var rule = "X=[-<FX]+<FX";

    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgb(255,255,255)";
    ctx.lineCap = "square";


    logoHome(width >> 1, height-10);
    logoLeft();
    logoLeft();
    logoLeft();

    var lsystem = applyRule(axiom, rule, 5);
    console.log("lsystem: " + lsystem);

    for (var i = 0; i < lsystem.length; i++) {
        var command = lsystem[i];
        switch (command) {
            case "F":
                logoForward(ctx);
                break;
            case "B":
                logoForward(ctx);
                break;
            case "+":
                logoLeft(ctx);
                break;
            case "-":
                logoRight(ctx);
                break;
            case "[":
                pushState();
                break;
            case "]":
                popState();
                break;
            case "<":
                logoSmallerStep();
                break;
            default:
                break;
        }
    }
}
