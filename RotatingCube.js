// Jake D'Esposito

/** @type {WebGLRenderingContext} */
var gl;
var myShaderProgram;

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

    setupCube().then(() => render())
}

window.onload = init()

let indicesCount = 0

async function setupCube() {

    // Vertices of Cube
    // TODO: Do new shape.
    /*
    var vertices = [vec4(-.2, .2, -.2, 1), // p0
    vec4(-.2, -.2, -.2, 1), // p1
    vec4(.2, -.2, -.2, 1), // p2
    vec4(.2, .2, -.2, 1), // p3
    vec4(.2, .2, .2, 1), // p4
    vec4(-.2, .2, .2, 1), // p5
    vec4(-.2, -.2, .2, 1), // p6
    vec4(.2, -.2, .2, 1)];  // p7

    // Colors at Vertices of Cube
    var vertexColors = [vec4(0.0, 0.0, 1.0, 1.0), // p0
    vec4(0.0, 1.0, 0.0, 1.0), // p1
    vec4(1.0, 0.0, 0.0, 1.0), // p2
    vec4(1.0, 1.0, 0.0, 1.0), // p3
    vec4(1.0, 0.0, 1.0, 1.0), // p4
    vec4(0.0, 1.0, 1.0, 1.0), // p5
    vec4(1.0, 1.0, 1.0, 1.0), // p6
    vec4(0.3, 0.3, 0.3, 1.0)]; // p7

    // Every face on the cube is divided into two triangles,
    // each triangle is described by three indices into
    // the array "vertices"
    var indexList = [0, 1, 3,
        1, 2, 3,
        6, 5, 7,
        4, 7, 5,
        0, 6, 1,
        5, 6, 0,
        2, 4, 3,
        2, 7, 4,
        0, 4, 5,
        0, 3, 4,
        2, 1, 6,
        2, 6, 7];
    //*/

    const obj = await fetch("./apple.obj").then(res => res.text())

    const buffers = new OBJ.Mesh(obj)
    
    
    console.log(buffers)
    
    /** @type {string[]} */
    // const splitObj = obj.split("\n")
    
    // const vertices = splitObj.filter(str => str.startsWith("v ")).map(str => str.substring(2).split(" ")).map(([a, b, c]) => vec4(parseFloat(a), parseFloat(b), parseFloat(c), 1))
    // const normals = splitObj.filter(str => str.startsWith("vn ")).map(str => str.substring(3).split(" ")).map(([a, b, c]) => vec3(parseFloat(a), parseFloat(b), parseFloat(c)))
    // const indices = splitObj.filter(str => str.startsWith("f ")).map(str => str.substring(2).split(" ")).flat().map(str => str.split("/")).flat()
    
    // indicesCount = indices.length
    
    // console.log(indices)
    
    
    
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

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // will populate to render the cube
    // TODO: Adjust for new shape
    gl.drawElements(gl.TRIANGLES, indicesCount, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(render)
}

let rx = 0
document.getElementById("rotX").addEventListener("click", () => {
    rx++
    gl.uniform1f(gl.getUniformLocation(myShaderProgram, "xRot"), rx)
})

let ry = 0
document.getElementById("rotY").addEventListener("click", () => {
    ry++
    gl.uniform1f(gl.getUniformLocation(myShaderProgram, "yRot"), ry)
})

let rz = 0
document.getElementById("rotZ").addEventListener("click", () => {
    rz++
    gl.uniform1f(gl.getUniformLocation(myShaderProgram, "zRot"), rz)
})

let tx = 0
document.getElementById("transX").addEventListener("click", () => {
    tx += 0.1
    gl.uniform1f(gl.getUniformLocation(myShaderProgram, "xPos"), tx)
})

let ty = 0
document.getElementById("transY").addEventListener("click", () => {
    ty += 0.1
    gl.uniform1f(gl.getUniformLocation(myShaderProgram, "yPos"), ty)
})

let sx = 8
document.getElementById("scaleX").addEventListener("click", () => {
    sx += 1
    gl.uniform1f(gl.getUniformLocation(myShaderProgram, "xScale"), sx)
})

let sy = 8
document.getElementById("scaleY").addEventListener("click", () => {
    sy += 1
    gl.uniform1f(gl.getUniformLocation(myShaderProgram, "yScale"), sy)
})