// ************************ TUPLE ***********************************************************
const EPSILON = 0.00001;

function equal(a, b) {
    return Math.abs(a - b) < EPSILON;
}

function tuple(x, y, z, w) {
    return { x, y, z, w };
}

function point(x, y, z) {
    return { x, y, z, w: 1 };
}

function vector(x, y, z) {
    return { x, y, z, w: 0 }
}

function add_tuple(a, b) {
    return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z, w: a.w + b.w };
}

function sub_tuple(a, b) {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z, w: a.w - b.w };
}
function negate(t) {
    return { x: -t.x, y: -t.y, z: -t.z, w: -t.w };
}
function multiply_tuple(t, s) {
    return { x: t.x * s, y: t.y * s, z: t.z * s, w: t.w * s };
}
function divide_tuple(t, s) {
    return { x: t.x / s, y: t.y / s, z: t.z / s, w: t.w / s };
}
function magnitude(t) {
    return Math.sqrt(t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w);
}
function normalize(t) {
    const m = magnitude(t);
    return divide_tuple(t, m);
}
function dot(t, a) {
    return a.x * t.x + a.y * t.y + a.z * t.z + a.w * t.w;
}
function cross(t, b) {
    return vector(t.y * b.z - t.z * b.y,
        t.z * b.x - t.x * b.z,
        t.x * b.y - t.y * b.x);

}
function reflect(t, normal) {
    return sub_tuple(t, multiply_tuple(normal, 2 * dot(t, normal)));

}
function equal_tuple(a, b) {
    return equal(a.x, b.x) && equal(a.y, b.y) && equal(a.z, b.z) && equal(a.w, b.w);
}

/*************** COLOR ************************************************************/

function color(r, g, b) {
    return { red: r, green: g, blue: b };
}

function add_color(a, b) {
    return { red: a.red + b.red, green: a.green + b.green, blue: a.blue + b.blue };
}
function sub_color(a, b) {
    return { red: a.red - b.red, green: a.green - b.green, blue: a.blue - b.blue };
}
function multiply_color(a, k) {
    return { red: a.red * k, green: a.green * k, blue: a.blue * k };
}
function hadamard_product(a, b) {
    return { red: a.red * b.red, green: a.green * b.green, blue: a.blue * b.blue };

}

/************* CANVAS ***********************************************************/

function canvas(width, height) {


    return { width: width, height: height, pixels: new Array(width * height).fill(color(0, 0, 0)) };
}

function init_canvas(sel, width, height) {
    console.log(sel, width, height);
    const c = document.querySelector(sel);
    c.width = width;
    c.height = height;
    const ctx = c.getContext('2d');
    const data = ctx.getImageData(0, 0, width, height);
    for (let i = 0; i < width * height; i++) {
        data.data[i * 4 + 3] = 255;
    }
    return { canvas: c, ctx: ctx, data: data };

}

function write_pixel(canvas, x, y, color) {
    canvas.pixels[canvas.width * y + x] = color;
}
function pixel_at(canvas, x, y) {
    return canvas.pixels[canvas.width * y + x];
}

function draw_pixel(canvas, x, y, color, update = false) {
    const r = Math.floor(color.red * 255.999);
    const g = Math.floor(color.green * 255.999);
    const b = Math.floor(color.blue * 255.999);
    const off = (x + y * canvas.data.width) * 4;
    canvas.data.data[off] = r;
    canvas.data.data[off + 1] = g;
    canvas.data.data[off + 2] = b;
    canvas.data.data[off + 3] = 255;
    // console.log(color);
    if (update) {
        canvas.ctx.putImageData(0, 0, canvas.data);
    }

}
function update_canvas(canvas) {
    canvas.ctx.putImageData(canvas.data, 0, 0);
}
function read_pixel(canvas, x, y) {
    return { red: 0, green: 0, blue: 0 };
}

/***************  MATRIX ****************************/
function matrix() {
    return [
        [0.0, 0.0, 0.0, 0.0],
        [0.0, 0.0, 0.0, 0.0],
        [0.0, 0.0, 0.0, 0.0],
        [0.0, 0.0, 0.0, 0.0]
    ];
}

function identity() {
    return [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [0.0, 0.0, 0.0, 1.0]
    ]
}

function matrix_from_array(a) {
    return [
        [a[0], a[1], a[2], a[3]],
        [a[4], a[5], a[6], a[7]],
        [a[8], a[9], a[10], a[11]],
        [a[12], a[13], a[14], a[15]]
    ];
}

function translation(x, y, z) {
    return [
        [1.0, 0.0, 0.0, x],
        [0.0, 1.0, 0.0, y],
        [0.0, 0.0, 1.0, z],
        [0.0, 0.0, 0.0, 1.0]
    ];
}

function scaling(x, y, z) {
    return [
        [x, 0.0, 0.0, 0.0],
        [0.0, y, 0.0, 0.0],
        [0.0, 0.0, z, 0.0],
        [0.0, 0.0, 0.0, 1.0]
    ];
}
function rotation_x(r) {
    const c = Math.cos(r);
    const s = Math.sin(r);
    return [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, c, -s, 0.0],
        [0.0, s, c, 0.0],
        [0.0, 0.0, 0.0, 1.0]
    ];
}
function rotation_y(r) {
    const c = Math.cos(r);
    const s = Math.sin(r);
    return [
        [c, 0.0, s, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [-s, 0.0, c, 0.0],
        [0.0, 0.0, 0.0, 1.0]
    ];
}
function rotation_z(r) {
    const c = Math.cos(r);
    const s = Math.sin(r);
    return [
        [c, -s, 0.0, 0.0],
        [s, c, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [0.0, 0.0, 0.0, 1.0]
    ];
}
function shearing(xy, xz, yx, yz, zx, zy) {
    return [
        [1.0, xy, xz, 0.0],
        [yx, 1.0, yz, 0.0],
        [zx, zy, 1.0, 0.0],
        [0.0, 0.0, 0.0, 1.0]
    ];
}

function matrix_multiply(a, b) {
    const m = matrix();
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            m[j][i] = a[j][0] * b[0][i]
                + a[j][1] * b[1][i]
                + a[j][2] * b[2][i]
                + a[j][3] * b[3][i];
        }
    }

    return m;

}

function compose_matrix(...matrici) {
    return matrici.reduce((a, b) => matrix_multiply(a, b));
}

function matrix_mul_tuple(a, b) {
    const x = a[0][0] * b.x + a[0][1] * b.y + a[0][2] * b.z + a[0][3] * b.w;
    const y = a[1][0] * b.x + a[1][1] * b.y + a[1][2] * b.z + a[1][3] * b.w;
    const z = a[2][0] * b.x + a[2][1] * b.y + a[2][2] * b.z + a[2][3] * b.w;
    const w = a[3][0] * b.x + a[3][1] * b.y + a[3][2] * b.z + a[3][3] * b.w;
    return { x, y, z, w };
}

function transpose(a) {
    const v = Array(16);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {

            v[j * 4 + i] = a[i][j];
        }
    }
    return matrix_from_array(v);

}

function submatrix(a, row, col) {
    // console.log(a, row, col);

    const v = Array(9);
    let n = 0;
    for (let i = 0; i < 4; i++) {
        if (i === row) {
            continue;
        }
        for (let j = 0; j < 4; j++) {
            if (j === col) {
                continue;
            }
            v[n] = a[i][j];
            n++;
        }
    }
    return matrix3_from_array(v);
}

function minor(a, row, col) {
    const m = submatrix(a, row, col);
    return matrix3_determinant(m);
}

function cofactor(a, row, col) {
    if ((row + col) % 2 === 0) {
        return minor(a, row, col);
    } else {
        return -minor(a, row, col);
    }
}

function determinant(a) {
    let det = 0;
    for (let i = 0; i < 4; i++) {
        det += a[0][i] * cofactor(a, 0, i);
    }
    return det;
}

function inverse(a) {
    // ottimizziamo calcolando una sola volta in determinante
    //if !self.is_invertible() {
    //    return None;
    // }
    const det = determinant(a);
    if (det === 0) {
        return null;
    }
    const m = matrix();
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            let c = cofactor(a, row, col);
            //console.log("c=",c);
            m[col][row] = c / det;
        }
    }
    return m;
}


function matrix3() {
    return [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]];
}

function matrix3_from_array(a) {
    return [[a[0], a[1], a[2]], [a[3], a[4], a[5]], [a[6], a[7], a[8]]];

}

function matrix3_submatrix(a, row, col) {
    const v = Array(4);
    let n = 0;
    for (let i = 0; i < 3; i++) {
        if (i === row) {
            continue;
        }
        for (let j = 0; j < 3; j++) {
            if (j === col) {
                continue;
            }
            v[n] = a[i][j];
            n += 1;
        }
    }
    return matrix2_from_array(v);
}



function matrix3_minor(a, row, col) {
    const m = matrix3_submatrix(a, row, col);
    return matrix2_determinant(m);
}
function matrix3_cofactor(a, row, col) {
    if ((row + col) % 2 == 0) {
        return matrix3_minor(a, row, col);
    } else {
        return -matrix3_minor(a, row, col);
    }
}
function matrix3_determinant(a) {
    let det = 0;
    for (let i = 0; i < 3; i++) {
        det += a[0][i] * matrix3_cofactor(a, 0, i);
    }
    return det;
}

function matrix2() {
    return [[0.0, 0.0], [0.0, 0.0]];
}
function matrix2_from_array(a) {
    return [[a[0], a[1]], [a[2], a[3]]];
}

function matrix2_determinant(a) {
    return a[0][0] * a[1][1] - a[0][1] * a[1][0];
}

/************************** MATERIAL & LIGHTS ****************************/

function point_light(pos, col) {
    return { position: pos, intensity: col };
}

function material() {

    return {
        color: color(1, 1, 1),
        ambient: 0.1,
        diffuse: 0.9,
        specular: 0.9,
        shininess: 200.0,
        pattern: null

    }
}

class pattern {
    transform;
    a;
    b;
    constructor(a, b) {
        this.transform = identity();
        this.a = a;
        this.b = b;
    }
}

class stripe_pattern extends pattern {
    pattern_at(point){
        let x = Math.floor(point.x);
        if (x%2==0){
            return this.a;
        }
        return this.b;
    }
}

class checker_pattern extends pattern {
    pattern_at(point){
        let x = Math.floor(point.x)+Math.floor(point.y)+Math.floor(point.z);
        if (x%2==0){
            return this.a;
        }
        return this.b;
    }
}

function pattern_at_object(pattern, obj, world_point) {
    
    let object_point = matrix_mul_tuple(inverse(obj.transform), world_point);
    let pattern_point = matrix_mul_tuple(inverse(pattern.transform), object_point);
    return pattern.pattern_at(pattern_point);
}


function lighting(material, obj, light, point, eyev, normalv, in_shadow) {
    let col = material.pattern ? pattern_at_object(material.pattern, obj, point) : material.color;
    let effective_color = hadamard_product(col, light.intensity);
    let lightv = normalize(sub_tuple(light.position, point));
    // compute the ambient contribution
    let ambient = multiply_color(effective_color, material.ambient);

    // light_dot_normal represents the cosine of the angle between the
    // light vector and the normal vector. A negative number means the
    // light is on the other side of the surface.
    let light_dot_normal = dot(lightv, normalv);
    let diffuse;
    let specular;
    if (light_dot_normal < 0.0 || in_shadow) {
        diffuse = color(0.0, 0.0, 0.0);
        specular = color(0.0, 0.0, 0.0);
    } else {
        // compute the diffuse contribution
        diffuse = multiply_color(effective_color, material.diffuse * light_dot_normal);
        // reflect_dot_eye represents the cosine of the angle between the
        // reflection vector and the eye vector. A negative number means the
        // light reflects away from the eye.
        let reflectv = reflect(negate(lightv), normalv);
        let reflect_dot_eye = dot(reflectv, eyev);
        if (reflect_dot_eye <= 0.0) {
            specular = color(0.0, 0.0, 0.0);
        } else {
            // compute the specular contribution
            let factor = Math.pow(reflect_dot_eye, material.shininess);
          
            specular = multiply_color(light.intensity, material.specular * factor);
        }
    }
    //console.log(ambient, diffuse, specular);
    // Add the three contributions together to get the final shading
    return add_color(add_color(ambient, diffuse), specular);


}

/************************* RAY ***********************************/



function ray(origin, direction) {
    return { origin, direction };
}

function position(ray, t) {
    return add_tuple(ray.origin, multiply_tuple(ray.direction, t));
}



function transform(r, m) {
    //console.log("trasformo",r,"con",m);
    //console.log("ottenendo ",matrix_mul_tuple(m, r.origin), matrix_mul_tuple(m, r.direction));
    return ray(matrix_mul_tuple(m, r.origin), matrix_mul_tuple(m, r.direction));

}

function intersection(t, obj) {
    //console.log(t);
    return { t: t, obj: obj };
}

function intersect(shape, r) {

    let local_ray = transform(r, inverse(shape.transform));
    //console.log(shape,r,local_ray);
    return shape.local_intersect(local_ray);
}

function normal_at(shape, point) {
    let local_point = matrix_mul_tuple(inverse(shape.transform), point);
    let local_normal = shape.local_normal_at(local_point);
    let world_normal = matrix_mul_tuple(transpose(inverse(shape.transform)), local_normal);
    world_normal.w = 0;
    return normalize(world_normal);
}
function reflect(inc, normal) {
    return sub_tuple(inc, multiply_tuple(normal, 2 * dot(inc, normal)));
}
function hit(xs) {
    // console.log(xs);
    xs.sort((a, b) => a.t - b.t);
    // console.log(xs);
    // console.log(xs.find(a => a.t >= 0))
    // debugger;
    return xs.find(a => a.t >= 0);
}


/*********************** OBJECT & SHAPES *****************************/
class object {
    transform;
    material;
    constructor() {
        this.transform = identity();
        this.material = material();
    }
}
function set_transform(s, t) {
    s.transform = t;
}
class sphere extends object {
    local_intersect(ray) {
        //debugger;
        //console.log("sphere local intersect");
        let v = [];
        let sphere_to_ray = sub_tuple(ray.origin, point(0.0, 0.0, 0.0));

        let a = dot(ray.direction, ray.direction);
        let b = 2.0 * dot(ray.direction, sphere_to_ray);
        let c = dot(sphere_to_ray, sphere_to_ray) - 1.0;
        let discriminant = b * b - 4.0 * a * c;
        if (!(discriminant < 0.0)) {
            let rad = Math.sqrt(discriminant);
            v.push(intersection((-b - rad) / (2.0 * a), this));
            v.push(intersection((-b + rad) / (2.0 * a), this));
        }
        return v;
    }
    local_normal_at(p) {
        return sub_tuple(p, point(0.0, 0.0, 0.0));
    }

}
class plane extends object {
    local_intersect(ray) {
        let v = [];
        if (Math.abs(ray.direction.y) < EPSILON) {
            return v;
        }
        let t = -ray.origin.y / ray.direction.y;
        v.push(intersection(t, this));
        return v;

    }
    local_normal_at(p) {
        return vector(0, 1, 0);
    }

}
/******** WORLD AND CAMERA ***************************************/
function world() {
    return { objects: [], light: null };
}
function default_world() {
    let w = {
        light: point_light(point(-10, 10, -10), color(1, 1, 1)),
        objects: [
            new sphere(),
            new sphere()
        ]
    }
    w.objects[0].material.color = color(0.8, 1.0, 0.6);
    w.objects[0].material.diffuse = 0.7;
    w.objects[0].material.specular = 0.2;

    w.objects[1].transform = scaling(0.5, 0.5, 0.5);

    return w;
}


function intersect_world(w, r) {

    let v = [];
    for (let obj of w.objects) {
        let int = intersect(obj, r);
        //console.log(int);
        v = v.concat(int);
    }
    v.sort((a, b) => { return a.t - b.t });
    return v;
}
function shade_hit(w, comps, remaining) {
    let shadowed = is_shadowed(w, comps.over_point);
    let surface = lighting(comps.object.material,
        comps.object,
        w.light,
        comps.over_point,
        comps.eyev,
        comps.normalv,
        shadowed,
    );
    //let reflected = self.reflected_color(comps, remaining);
    //let refracted = self.refracted_color(comps, remaining);
    //surface.add(&reflected).add(&refracted)
    return surface;
}
function color_at(w, r, remaining) {

    // console.log("color @",w,r,remaining);
    let xs = intersect_world(w, r);
    let h = hit(xs);
    //console.log(h); 
    if (!h) {
        return color(0.0, 0.0, 0.0);
    }

    let comps = prepare_computations(h, r, xs);
    //console.log(comps);
    return shade_hit(w, comps, remaining)
}
function prepare_computations(intersection, r, xs) {
    let comps = {};
    comps.t = intersection.t;
    comps.object = intersection.obj;
    comps.point = position(r, comps.t)
    comps.eyev = negate(r.direction);
    comps.normalv = normal_at(comps.object, comps.point);
    if (dot(comps.normalv, comps.eyev) < 0.0) {
        comps.inside = true;
        comps.normalv = negate(comps.normalv);
    } else {
        comps.inside = false;
    }
    comps.over_point = add_tuple(comps.point, multiply_tuple(comps.normalv, EPSILON));
    comps.under_point = sub_tuple(comps.point, multiply_tuple(comps.normalv, EPSILON));
    return comps;

}
function is_shadowed(w, p) {
    let v = sub_tuple(w.light.position, p);
    let distance = magnitude(v);
    let direction = normalize(v);
    let r = ray(p, direction);
    let intersections = intersect_world(w, r);
    let h = hit(intersections);
    if (!h) {
        //    println!("nessuna");
        return false;
    }
    //println!("controllo distanza {} {}",h.unwrap().t,distance);
    if (h.t >= distance) {
        return false;
    }
    return true;
}

/******************* CAMERA ******************************************/

function view_transform(from, to, up) {
    let forward = normalize(sub_tuple(to, from));
    let upn = normalize(up);
    let left = cross(forward, upn);
    let true_up = cross(left, forward);
    let orientation = [
        [left.x, left.y, left.z, 0.0],
        [true_up.x, true_up.y, true_up.z, 0.0],
        [-forward.x, -forward.y, -forward.z, 0.0],
        [0.0, 0.0, 0.0, 1.0]
    ];
    return matrix_multiply(orientation, translation(-from.x, -from.y, -from.z));

}
function camera(hsize, vsize, field_of_view) {

    let camera = { hsize: hsize, vsize: vsize };
    let half_view = Math.tan(field_of_view / 2.0);
    let aspect = hsize / vsize;
    if (aspect >= 1) {
        camera.half_width = half_view;
        camera.half_height = half_view / aspect;
    } else {
        camera.half_width = half_view * aspect;
        camera.half_height = half_view;
    }
    camera.pixel_size = (camera.half_width * 2) / hsize;
    camera.transform = identity();
    return camera;
}

function ray_for_pixel(c, px, py) {

    //console.log(c,px,py);
    let xoffset = (px + 0.5) * c.pixel_size;
    let yoffset = (py + 0.5) * c.pixel_size;
    // the untransformed coordinates of the pixel in world space.
    // (remember that the camera looks toward -z, so +x is to the *left*.)
    let world_x = c.half_width - xoffset;
    let world_y = c.half_height - yoffset;
    // using the camera matrix, transform the canvas point and the origin,
    // and then compute the ray's direction vector.
    // (remember that the canvas is at z=-1)
    //console.log(c.transform);
    //console.log(inverse(c.transform));
    //console.log(multiply_tuple(inverse(c.transform),point(world_x, world_y, -1.0)));

    let pixel = matrix_mul_tuple(inverse(c.transform), point(world_x, world_y, -1.0));
    let origin = matrix_mul_tuple(inverse(c.transform), point(0, 0, 0));
    let direction = normalize(sub_tuple(pixel, origin));
    return ray(origin, direction);
}

function render(c, world) {
    // console.log(c.hsize,Math.floor(c.hsize));
    let hsize = Math.floor(c.hsize);
    let vsize = Math.floor(c.vsize);
    // console.log(hsize,vsize);
    //let image = init_canvas("#canvas", hsize, vsize);
    for (let y = 0; y < vsize; y++) {
        let scanline = [];
        for (let x = 0; x < hsize; x++) {
            let r = ray_for_pixel(c, x, y);
            // console.log(r);
            let col = color_at(world, r, 6);
            //draw_pixel(image, x, y, col, false);
            scanline.push(col);
        }
        postMessage(scanline);
    }
    //update_canvas(image);
}



onmessage = function (e) {
    console.log('Message received from main script');
    let w = world();

    let floor = new plane();
    floor.material = material();
    floor.material.color = color(1, 0.9, 0.9);
    floor.material.specular = 0;
    floor.material.ambient = 0.1;
    let p = new checker_pattern(color(0,0,0),color(1,1,1));
    p.transform = scaling(0.3,0.3,0.3);
    floor.material.pattern = p;

    let middle = new sphere();
    middle.transform = translation(-0.5, 0.0, 0.5);
    middle.material = material();
    middle.material.color = color(0.1, 1, 0.5);
    middle.material.diffuse = 0.7;
    middle.material.specular = 0.3;

    let right = new sphere();
    right.transform = matrix_multiply(translation(1.5, 0.5, -0.5), scaling(0.5, 0.5, 0.5));
    right.material = material();
    right.material.color = color(0.5, 1, 0.1);
    right.material.diffuse = 0.7;
    right.material.specular = 0.3;

    let left = new sphere();
    left.transform = matrix_multiply(translation(-1.5, 0.33, -0.75), scaling(0.33, 0.33, 0.33));
    left.material = material();
    left.material.color = color(1, 0.8, 0.1);
    left.material.diffuse = 0.7;
    left.material.specular = 0.3;

    w.objects.push(floor);
    w.objects.push(middle);
    w.objects.push(right);
    w.objects.push(left);


    w.light = point_light(point(-10, 10, -10), color(1, 1, 1))

    cam = camera(400, 200, Math.PI / 3)
    cam.transform = view_transform(point(0, 1.5, -5), point(0, 1, 0), vector(0, 1, 0));
    //render the result to a canvas.
    render(cam, w);

}
