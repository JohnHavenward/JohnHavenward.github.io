

# CHECKPOINT 08

TODO[¿Qué tipo de bucles hay en JS?](#bucles)</br>
[¿Cuáles son las diferencias entre const, let y var?](#tipos-de-variables)</br>
[¿Qué es una función de flecha?](#función-flecha)</br>
[¿Qué es la deconstrucción de variables?](#deconstrucción-de-variables)</br>
[¿Qué hace el operador de extensión en JS?](#operador-de-extensión)</br>
TODO[¿Qué es la programación orientada a objetos?](#programación-orientada-a-objetos)</br>
TODO[¿Qué es una promesa en JS?](#promesas)</br>
TODO[¿Qué hacen async y await por nosotros?](#async-y-await)</br>

</br></br></br></br>



<p id="bucles"></p>

## BUCLES


### BUCLE FOR


```js
for (expression 1; expression 2; expression 3) {
  // code block to be executed
}
```

```js
for (let i = 0; i < cars.length; i++) { 
  text += cars[i] + "<br>";
}
```


### BUCLE FOR IN


```js
for (key in object) {
  // code block to be executed
}
```

```js
const person = {fname:"John", lname:"Doe", age:25};

let text = "";
for (let x in person) {
  text += person[x];
}
```


```js
for (variable in array) {
  code
}
```

```js
const numbers = [45, 4, 9, 16, 25];

let txt = "";
for (let x in numbers) {
  txt += numbers[x];
}
```



### BUCLE FOR OF

```js
for (variable of iterable) {
  // code block to be executed
}
```

```js
const cars = ["BMW", "Volvo", "Mini"];

let text = "";
for (let x of cars) {
  text += x;
}
```



### BUCLE WHILE

```js
while (condition) {
  // code block to be executed
}
````


```js
while (i < 10) {
  text += "The number is " + i;
  i++;
}
```


### BUCLE DO WHILE

```js
do {
  // code block to be executed
}
while (condition);
```

```js
do {
  text += "The number is " + i;
  i++;
}
while (i < 10);
```



### BREAK Y CONTINUE

```js
for (let i = 0; i < 10; i++) {
  if (i === 3) { break; }
  text += "The number is " + i + "<br>";
}
```


```js
for (let i = 0; i < 10; i++) {
  if (i === 3) { continue; }
  text += "The number is " + i + "<br>";
}
```


### FUNCIÓN MAP

Cuando salió ES6 (EmcaScript 2015), introdujo un nuevo conjunto de métodos para iterar sobre un arreglo. Uno de los más útiles es el método map().

Array.prototype.map() es un método incorporado en los arreglos, para iterar a través de los elementos dentro de una colección de arreglos en JavaScript. Piensa en él, como un bucle para avanzar de un elemento a otro en una lista, manteniendo el orden y la posición de cada elemento.

Este método toma una función callback, que se llama por cada nuevo elemento sobre el que se itera.

La función callback recibe tres parámetros:

- El valor actual.
- Su índice.
- El arreglo de destino

```js
let prefijos = ["super", "spider", "ant", "iron"]
let sufijo = "man";

let nombresCompletos = prefijos.map(prefijo => prefijo + sufijo);

console.log(nombresCompletos);

// ["superman", "spiderman", "antman", "ironman"]
```


Antes dije que en cada iteración, el método map() toma el valor sobre el que se itera y también su posición de indice. Hay otro argumento que añadir a esos dos, los argumentos del arreglo.

```js
const arregloViejo = [33, 20, 10, 5];
const nuevoArreglo = arregloViejo.map((valorActual, indice, arr) => {
    let siguienteItem = indice + 1 < arr.length ? arr[indice + 1] : 0
    return valorActual - siguienteItem;
});


console.log(nuevoArreglo);

// [13, 10, 5, 5]
```



</br></br></br></br>



<p id="tipos-de-variables"></p>

## TIPOS DE VARIABLES

El tipo de datos contenido por una variable en JavaScript depende del valor asignado, no se define de forma explícita. Sin embargo, al declarar la variable sí debemos especificar de qué tipo de variable se trata. Existen tres tipos disponibles en JavaScript y son los siguientes: 

- `var`
- `let`
- `const`

</br>


Estos tres tipos presentan comportamientos parecidos y son algunas de sus propiedades las que los hacen diferenciarse. Conocer y entender estas diferencias es vital para poder seleccionar el tipo de variable adecuado para cada situación concreta.

</br>


### VAR

Antes de la versión ES6 de JavaScript `var` era el único tipo de variable disponible. Se declara con la palabra clave `var` y no es necesario asignar un valor inicial.

```js
var unaVariable = "Llueve";

var otraVariable;
```

<br>


#### REASIGNACIÓN

A una variable de tipo `var` se le pueden reasignar valores tantas veces como se desee.

```js
var miVariable = "Hola mundo";

miVariable = 13;

miVariable = true;
```

</br>


#### REDECLARACIÓN

Una variable de tipo `var` puede declararse múltiples veces en el programa sin causar ningún error.

```js
var miVariable = "Hola mundo";

var miVariable = 13;

var miVariable = true;
```

</br>


> **NOTA:** Esto puede parecer algo ventajoso pero puede generar problemas en el código si sobrescribimos variables de forma no intencionada.

</br>


#### ÁMBITO DE USO

Una variable `var` puede tener dos ámbitos de uso en función de dónde sea declarada: global y local. La variable podrá ser solamente accedida en ese ámbito.

```js
var variableGlobal = "Ámbito global";


function mostrarVariables() {
      var variableLocal = "Ámbito local";
      console.log(variableGlobal + " y "+variableLocal);    
}

mostrarVariables(); //Ámbito global y Ámbito local


console.log(variableGlobal); //Ámbito global
console.log(variableLocal); //error
```

</br>
 

Sin embargo, hay una situación concreta en la que el uso de variables de tipo `var` puede darnos resultados inesperados. Cuando definimos dos variables `var` de idéntico nombre en ámbitos diferentes, una global y la otra local, podemos esperar que ambas se comporten de forma independiente. Sin embargo, cuando cambiamos el valor de la variable local también lo hará la global. Se trata de la misma variable y no puede tener valores diferentes para cada uno de los ámbitos de uso. 

```js
var saludo = "Hola";

if (true) {
      var saludo = "Buenas tardes";
      console.log(saludo); //Buenas tardes
}

console.log(saludo) //Buenas tardes
```

</br>


Es por ello que para evitar este tipo de potenciales problemas se añadieron las variables de tipo `let` y `const`, las cuales se comportan de la manera esperada en estas situaciones.

</br>


#### HOISTING

Una variable `var` se beneficia del *hoisting* llevado a cabo por JavaScript ya que nos permite hacer referencia a una variable incluso antes de haber sido declarada. Sin embargo, hay que tener en cuenta que el valor inicial de la variable siempre será `undefined`.

```js
console.log(miVariable); //undefined

var miVariable = 10;
```

</br>


### LET

Las variables de tipo `let` son consideradas la versión moderna de las de tipo `var` ya que presentan una serie de comportamientos diferentes que las hacen más apropiadas para un desarrollo más seguro y fácil de mantener.

Se declaran con la palabra clave `let` y no es necesario asignar un valor inicial.

```js
let unaVariable = 28;

let otraVariable;
```

</br>


#### REASIGNACIÓN

A una variable de tipo `let` se le puede reasignar un nuevo valor las veces deseadas.

```js
let miVariable = "Hola mundo";

miVariable = 13;

miVariable = true;
```

</br>


#### REDECLARACIÓN

La redeclaración de variables `let` no es posible y hacerlo nos dará error.

```js
let miVariable = [1, 2, 3];

let miVariable; //error
```

</br>


#### ÁMBITO DE USO

El ámbito de uso de las variables `let` es siempre el bloque de código en el que han sido declaradas y no serán accesibles desde fuera de este.

```js
tareas = 5

if (tareas > 0) {
      let mensaje = "Hay tareas pendientes";
}

console.log(mensaje); //error
```

</br>


Cuando definimos dos variables `let` de idéntico nombre en dos bloques de código diferentes, ambas se comportan como variables independientes. Incluso en el caso de que uno de los bloques esté contenido dentro del otro, ambas variables seguirán comportándose de manera independiente la una de la otra.

```js
let saludo = "Hola";

if (true) {
      let saludo = "Buenas tardes";
      console.log(saludo); //Buenas tardes
}

console.log(saludo) //Hola
```

</br>


#### HOISTING

Una variable `let` no se beneficia del *hoisting* de JavaScript y no puede hacerse referencia a ella antes de su declaración. Si lo hacemos JavaScript nos mostrará un error.

```js
console.log(miVariable); //error

let miVariable = 10;
```

</br>


### CONST

La variable `const` debe su nombre al hecho de que su valor es constante y único. Este valor debe ser siempre asignado al ser declarada la variable `const` o de lo contrario JavaScript nos dará un error.

```js
const fuerzaGravedad = 9.80665;

const variableConstante; //error
```

</br>


#### REASIGNACIÓN

Una variable de tipo `const` no admite la reasignación de valores y hacerlo nos dará error.
 
```js
const variableConstante = "Valor inicial";

variableConstante = "Valor nuevo"; //error
```

</br>


#### REDECLARACIÓN

La redeclaración de variables `const` no es posible y hacerlo nos dará error.

```js
const variableConstante  = "Valor inicial";

const variableConstante  = "Valor alternativo"; //error
```

</br>


#### ÁMBITO DE USO

El ámbito de uso de las variables `const` es siempre el bloque de código en el que han sido declaradas y no serán accesibles desde fuera de este.

```js
function calcularPerímetro(radio) {
      const pi = 3.14159265359;
      
      return 2 * pi * radio;
}

console.log(pi); //error
```

</br>


Cuando definimos dos variables `const` de idéntico nombre en dos bloques de código diferentes, ambas se comportan como variables independientes. Incluso en el caso de que uno de los bloques esté contenido dentro del otro, ambas variables seguirán comportándose de manera independiente la una de la otra.

```js
const saludo = "Hola";

if (true) {
      const saludo = "Buenas tardes";
      console.log(saludo); //Buenas tardes
}

console.log(saludo) //Hola
```

</br>


#### HOISTING

En lo que respecta al *hoisting*, las variables `const` no son inicializadas y por eso no pueden usarse antes de haber sido declaradas.

```js
console.log(variableConstante); //error

const variableConstante = "Valor constante";
```

</br>


### TABLA COMPARATIVA

A continuación se muestra una tabla en la que se comparan las diferentes propiedades de cada uno de los tres tipos de variables disponibles en JavaScript.

</br>


| PROPIEDADES                | `var`            | `let`    | `const`   |
| :------------------------- | :--------------: | :------: | :-------: |
| Necesario inizializar      | No               | No       | Sí        |
| Reasignación               | Sí               | Sí       | No        |
| Redeclaración              | Sí               | No       | No        |
| Ámbito de uso              | global / local   | bloque   | bloque    |
| Inicialización *Hoisting*  | `undefined`      | No       | No        |

</br></br></br></br>



<p id="función-flecha"></p>

## FUNCIÓN FLECHA

La función flecha es un tipo especial de expresión de función introducido por primera vez en la versión ES6 de JavaScript.
Al igual que la expresión de función, se trata de una función anónima asociada a una variable. Sin embargo, la función flecha destaca por proporcionar una sintaxis más abreviada y de fácil lectura.

Las funciones flecha prescinden de la palabra clave `function` y usan un símbolo de flecha `=>` para su definición.

```js
sumar = (a, b, c) => {
      let total = 0;
      
      total += a;
      total += b;
      total += c;
      
      return total;
}

console.log(sumar(2, 2, 6)); //10
```

</br>


Además, en el caso de que la función solo tenga una sentencia y esta devuelva un único valor podemos incluso prescindir de la palabra clave `return` y las llaves `{}`.

```js
sumar = (a, b, c) => a + b + c;


console.log(sumar(2, 2, 6)); //10
```

</br>


Por último, en el caso de que la función tenga un solo parámetro podemos prescindir también de los paréntesis `()`.

```js
saludo = nombre => `Hola, mi nombre es ${nombre}`;


console.log(saludo("Romina")); //Hola, mi nombre es Romina
```

</br>


### THIS

La principal característica que diferencia a las funciones flecha es el comportamiento de la palabra clave `this`. En este tipo de función `this` siempre hace referencia al objeto donde ha sido definida la función y no al objeto que la llama.


```js
const mostrarFlecha = () => console.log(this.valor);

function mostrarNormal() {
      console.log(this.valor);      
}
      

const miObjeto = {
      ejecutarMostrarFlecha: mostrarFlecha,
      ejecutarMostrarNormal: mostrarNormal,
      valor: 10
}


miObjeto.ejecutarMostrarFlecha(); //undefined
miObjeto.ejecutarMostrarNormal(); //10
```

</br>


### USOS COMUNES

Debido a la brevedad y facilidad de lectura que proporcionan las funciones flecha, su uso es habitual en una amplia variedad de situaciones.

Un ejemplo claro es la evaluación sencilla de variables.

```js
const par = (n) => (n % 2 == 0 ? "Sí" : "No");

console.log(par(8)); //Sí
console.log(par(9)); //No
console.log(par(3)); //No


const mayor = (a, b, c) => ((a > b ? a : b) > c ? (a > b ? a : b) : c);

console.log(mayor(3, 5, 2)); //5
console.log(mayor(8, 4, 7)); //8
console.log(mayor(6, 1, 9)); //9
```

</br>


Las funciones flecha también son muy útiles para el trabajo con *arrays*.

```js
let arr = [5, 6, 13, 0, 1, 18, 23];


let suma = arr.reduce((a, b) => a + b);
let pares = arr.filter((v) => v % 2 == 0);
let doble = arr.map((v) => v * 2);


console.log(suma); //66
console.log(pares); //[6, 0, 18]
console.log(doble); //[10, 12, 26, 0, 2, 36, 46]
```

</br>


De igual forma, las funciones flecha resultan ser idóneas para escribir cadenas de promesas más concisas.

```js
hacerAlgo()
      .then((resultado) => doSomethingElse(resultado))
      .then((nuevoResultado) => doThirdThing(nuevoResultado))
      .then((resultadoFinal) => {
        console.log(`El resultado final es: ${resultadoFinal}`);
      })
      .catch(failureCallback);
```

</br></br></br></br>



<p id="deconstrucción-de-variables"></p>

## DECONSTRUCCIÓN DE VARIABLES

La deconstrucción de variables es una expresión que nos permite asignar el valor de varias variables a la vez en una sola línea de código. Las variables son agrupadas y asignadas como conjunto a otra agrupación de variables o valores. Las variables son asignadas así al elemento correspondiente en el otro conjunto, situado este en la parte derecha de la expresión.

```js
let valores = [18, "Verde", {x: 2, y: -5}];

let [edad, color, coordenadas] = valores;

console.log(edad); //18
console.log(color); //Verde
console.log(coordenadas); //{x: 2, y: -5}
```

</br>


Un uso práctico de la deconstrucción de variables es para poder declarar múltiples variables y asignarles un valor.

```js
let [a, b, c, d] = [1, 2, 3, 4];

console.log(a); //1
console.log(b); //2
console.log(c); //3
console.log(d); //4
```

</br>


### USO CON ARRAYS

Cuando usamos la deconstrucción de variables con *arrays* es muy importante tener en cuenta el orden en el que se definen las variables contenidas dentro del *array*, ya que se asignan en ese orden a los elementos contenidos en el *array* de la parte derecha.

En el caso de que la variable no tenga un elemento correspondiente en el otro conjunto, se le asigna el valor `undefined`.

```js
let [a, b, c] = [3, 9];

console.log(a); //3
console.log(b); //9
console.log(c); //undefined
```

</br>


Además, es posible asignar un valor por defecto a las variables para el caso en que no se les asigne un valor en la desconstrucción de variables.

```js
let a, b;

[a = 34, b = 71] = [15];

console.log(a); //15
console.log(b); //71
```

</br>


Si lo deseamos podemos dejar posiciones vacías en el *array* ignorando así los elementos correspondientes a esas posiciones.

```js
const datosObjeto = ["37cm", "dato no importante", "500gr"]

const [longitud, , peso] = datosObjeto;

console.log(longitud); //37cm
console.log(peso); //500gr
```

</br>


Un uso muy común de la deconstrucción de variables es para intercambiar el valor de dos valores sin necesidad de recurrir a una tercera variable temporal.

```js
let a = 30;
let b = 80;

[a, b] = [b, a];

console.log(a); //80
console.log(b); //30
```

</br>


Cunado una función retorna un *array* de valores, resulta muy útil usar la deconstrucción de variables para recoger estos valores en variables independientes.

```js
function calcularOperaciones(a, b) {
      let suma = a + b;
      let resta = a - b;
      let multiplicación = a * b;
      let división = a / b;
      
      return [suma, resta, multiplicación, división];
}

let [suma, resta, multiplicación, división] = calcularOperaciones(5, 2);

console.log(suma); //7
console.log(resta); //3
console.log(multiplicación); //10
console.log(división); //2.5
```

</br>


### USO CON OBJETOS

Cuando se usa la deconstrucción de variables con objetos, los valores correspondientes de los dos conjuntos son los que tienen el mismo nombre de propiedad.

```js
let objeto = { a: 10, b: 20, c: 30}

let {c, a, b} = objeto;

console.log(a); //10
console.log(b); //20
console.log(c); //30
```

</br>


También es posible asignar un nombre a la variable que no sea el de la propiedad del objeto. Para ello añadimos el símbolo `:` y el nombre después de la propiedad. 

```js
const información = { dato1: "Andrés" , dato2: 35 };
const { dato1: nombre, dato2: edad } = información;

console.log(nombre); //Andrés
console.log(edad); //35
```

</br>


Es posible asignar un valor por defecto a las variables para el caso en que no se les asigne un valor en la desconstrucción de variables.

```js
const { evento, día, hora = "no definida" } = { evento: "reunión", día: "martes" };

console.log(evento); //reunión
console.log(día); //martes
console.log(hora); //no definida
```

</br>


Cuando pasamos un objeto como argumento a una función, la deconstrucción de variables facilita que la función tome las propiedades necesarias para usarlas directamente y que no haga falta expresar `objeto.propiedad` cada vez que se usa una propiedad del objeto.

```js
const visitante = {
      nombre: "Pablo",
      apellido: "García", 
      altura: 185,
      peso: 78,
      nacionalidad: "colombiana"
}


function mostrarDatos({nombre, apellido, nacionalidad}) {
      console.log(` ${nombre} ${apellido}, nacionalidad ${nacionalidad}`);
}


mostrarDatos(visitante); //Pablo García, nacionalidad colombiana
```

</br>


Incluso podemos especificar propiedades anidadas para que la función las tome como argumentos. Para ello debemos usar nuevamente la deconstrucción de variables con las propiedades anidadas.

```js
const mueble = {
      tipo: "mesa",
      ubicación: "comedor", 
      color: "azul",
      medidas: {
            anchura: 90,
            profundidad: 200,
            altura: 70
      } 
}


function mostrarDatos({tipo, ubicación, medidas: {anchura, profundidad} }) {
      console.log(`El mueble es una ${tipo}, se encuentra en el ${ubicación} y mide ${anchura}x${profundidad}cm`);
}


mostrarDatos(mueble); //El mueble es una mesa, se encuentra en el comedor y mide 90x200cm
```

</br></br></br></br>



<p id="operador-de-extensión"></p>

## OPERADOR DE EXTENSIÓN

El operador de extensión toma un objeto iterable y expande todos sus elementos permitiéndonos operar con ellos individualmente en vez de como una agrupación. Este operador se representa con tres puntos `...` y siempre se escribe inmediatamente antes del objeto iterable a expandir.

```js
const objetoIterable = [1, 2, 3];

const [a, b, c] = [...objetoIterable];

console.log(a); //1
console.log(b); //2
console.log(c); //3
```

</br>


Se trata de un operador de uso muy versátil ya que puede emplearse con varios propósitos en función de con qué tipo de objeto estemos trabajando. 

</br>


### USO CON ARRAYS

El operador de extensión `...` permite concatenar fácilmente dos o más *arrays*.

```js
const primeraParte = [1, 2];
const segundaParte = [3, 4];
const terceraParte = [5, 6];

const variableCompleta = [...primeraParte, ...segundaParte, ...terceraParte];

console.log(variableCompleta); //[1, 2, 3, 4, 5, 6]
```

</br>


También resulta de gran utilidad cuando se necesita integrar un *array* dentro de otro.

```js
const parteCentral = [3, 4, 5];

const variableCompleta = [1, 2, ...parteCentral ,6];

console.log(variableCompleta); //[1, 2, 3, 4, 5, 6]
```

</br>


### USO CON CADENAS

Podemos usar el operador `...` para separar individualmente los diferentes caracteres de un cadena.

```js
let cadena = "Sapo azul";

let caracteres = [...cadena];

console.log(caracteres); //["S", "a", "p", "o", " ", "a", "z", "u", "l"]
```

</br>


### USO CON OBJETOS

También podemos usar el operador `...` con un objeto para separar cada una de sus propiedades de forma individual.

Al crear un objeto a partir de las propiedades individuales de varios objetos hay que tener en cuenta que dado que un objeto no puede tener más de una propiedad iguales, el último objeto con ella será el que determine su valor.

```js
const datos = {
      título: 'Los Juegos del Hambre',
      autor: 'Suzanne Collins',
      edición: 'primera'
}

const otrosDatos = {
      editorial: 'MOLINO',
      páginas: '400',
      edición: 'segunda'
}


const datosCompletos = {...datos, ...otrosDatos}

console.log(datosCompletos);
//{título: "Los Juegos del Hambre", autor: "Suzanne Collins", edición: "segunda", editorial: "MOLINO", páginas: "400"}
```

</br>


### USO CON ARRAYS COMO ARGUMENTOS DE FUNCIÓN

JavaScript no nos permite pasar un *array* como argumento directamente a una función. Sin embargo, el operador `...` separa en elementos el *array* de forma que la función los acepte como argumentos individuales.

```js
let dimensiones = [2, 7, 3];

function calcularVolumen(anchura, profundidad, altura) {
      return anchura * profundidad * altura;
          
}

console.log(calcularVolumen(...dimensiones)); //42

```

</br>


### USO CON DECONSTRUCCIÓN DE VARIABLES

Usado junto a la deconstrucción de variables el operador `...` nos permite asignar a un *array* el resto de variables que han quedado sin asignar en la deconstrucción. 


```js
const [a, b, ...resto] = [1, 2, 3, 4, 5];

console.log(resto); //[3, 4, 5]
```

</br>


### USO CON PARÁMETROS DE FUNCIÓN

Al usar el operador `...` en el último parámetro de una función, el resto de argumentos pasados en la llamada se agrupan en un *array* que puede ser manipulado en el código de la misma. Esto permite que la función admita un número indefinido de argumentos.

```js
function sumar(a, b, ...c) {
      let resultado = a + b;

      c.forEach(n => resultado += n);
      
      return resultado;
}

console.log(sumar(3,5)); //8
console.log(sumar(9,2,6)); //17
console.log(sumar(7,4,1,8)); //20
```

</br></br></br></br>



<p id="programación-orientada-a-objetos"></p>

## PROGRAMACIÓN ORIENTADA A OBJETOS



</br></br></br></br>



<p id="promesas"></p>

## PROMESAS


</br></br></br></br>



<p id="async-y-await"></p>

## ASYNC Y AWAIT