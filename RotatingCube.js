// Jake D'Esposito

/** @type {WebGLRenderingContext} */
var gl;
var myShaderProgram;

/**
 * Handles key press events.
 * @author Jake D'Esposito
 */
class KeyHandler {
    /** @type {boolean | undefined} */
    #keysPressed = []

    constructor() {
        document.addEventListener("keydown", this.#handleKeys)
        document.addEventListener("keyup", this.#handleKeys)
    }

    /**
     * Handles the keydown and keyup events.
     * @param {KeyboardEvent} event Passthrough variables from event.
     */
    #handleKeys = ({ key, type }) => this.#keysPressed[key] = type === "keydown"

    /**
     * Is the given key pressed.
     * @param {KeyboardEvent["key"]} key The key that you want to see is pressed. Refer to KeyboardEvent key.
     * @returns {boolean} Is the key pressed.
     */
    isKeyPressed = (key) => !!this.#keysPressed[key]
}

const keyHandler = new KeyHandler()

function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);

    if (!gl) { alert("WebGL is not available"); }

    gl.viewport(0, 0, 512, 512);

    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    gl.enable(gl.DEPTH_TEST)

    myShaderProgram =
        initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(myShaderProgram);

    // will include depth test to render faces correctly!
    gl.enable(gl.DEPTH_TEST);

    setupObject().then(() => render())
}

window.onload = init()

let indicesCount = 0

async function setupObject() {
    const obj = await fetch("./apple.obj").then(res => res.text())

    const buffers = new OBJ.Mesh(obj)

    var myPosition = gl.getAttribLocation(myShaderProgram, "myPosition");
    gl.enableVertexAttribArray(myPosition);

    var myNormals = gl.getAttribLocation(myShaderProgram, "myNormal");
    gl.enableVertexAttribArray(myNormals);

    OBJ.initMeshBuffers(gl, buffers)
    const { vertexBuffer, normalBuffer, indexBuffer } = buffers

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(myPosition, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(myNormals, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    indicesCount = indexBuffer.numItems

    gl.uniform1f(gl.getUniformLocation(myShaderProgram, "xScale"), 8)
    gl.uniform1f(gl.getUniformLocation(myShaderProgram, "yScale"), 8)
}

let rx = 0, ry = 0, rz = 0, tx = 0, ty = 0, sx = 8, sy = 8
const speed = 0.01

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Translation Key Presses
    if (keyHandler.isKeyPressed("w")) {
        ty += speed
        gl.uniform1f(gl.getUniformLocation(myShaderProgram, "yPos"), ty)
    }
    if (keyHandler.isKeyPressed("s")) {
        ty -= speed
        gl.uniform1f(gl.getUniformLocation(myShaderProgram, "yPos"), ty)
    }
    if (keyHandler.isKeyPressed("a")) {
        tx -= speed
        gl.uniform1f(gl.getUniformLocation(myShaderProgram, "xPos"), tx)
    }
    if (keyHandler.isKeyPressed("d")) {
        tx += speed
        gl.uniform1f(gl.getUniformLocation(myShaderProgram, "xPos"), tx)
    }

    // Rotation Key Presses
    if (keyHandler.isKeyPressed("q")) {
        ry += speed
        gl.uniform1f(gl.getUniformLocation(myShaderProgram, "yRot"), ry)
    }
    if (keyHandler.isKeyPressed("e")) {
        ry -= speed
        gl.uniform1f(gl.getUniformLocation(myShaderProgram, "yRot"), ry)
    }
    if (keyHandler.isKeyPressed("r")) {
        rx -= speed
        gl.uniform1f(gl.getUniformLocation(myShaderProgram, "xRot"), rx)
    }
    if (keyHandler.isKeyPressed("f")) {
        rx += speed
        gl.uniform1f(gl.getUniformLocation(myShaderProgram, "xRot"), rx)
    }
    if (keyHandler.isKeyPressed("z")) {
        rz -= speed
        gl.uniform1f(gl.getUniformLocation(myShaderProgram, "zRot"), rz)
    }
    if (keyHandler.isKeyPressed("x")) {
        rz += speed
        gl.uniform1f(gl.getUniformLocation(myShaderProgram, "zRot"), rz)
    }

    // Scale Key Presses
    if (keyHandler.isKeyPressed("Shift")) {
        sy += speed
        gl.uniform1f(gl.getUniformLocation(myShaderProgram, "yScale"), sy)
    }
    if (keyHandler.isKeyPressed("Control")) {
        sy -= speed
        gl.uniform1f(gl.getUniformLocation(myShaderProgram, "yScale"), sy)
    }
    if (keyHandler.isKeyPressed("1")) {
        sx += speed
        gl.uniform1f(gl.getUniformLocation(myShaderProgram, "xScale"), sx)
    }
    if (keyHandler.isKeyPressed("2")) {
        sx -= speed
        gl.uniform1f(gl.getUniformLocation(myShaderProgram, "xScale"), sx)
    }

    gl.drawElements(gl.TRIANGLES, indicesCount, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(render)
}