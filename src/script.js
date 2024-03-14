let carritoVisible = false;//estado visible del carrito

//para esperar que todos los elementos de la pag esten cargados

if(document.readyState == "loading"){
    document.addEventListener('DOMContentLoaded', ready);
}else {
    ready();
}

function ready () {
    //botones eliminar
    let btnEliminarItem = document.getElementsByClassName("btn-eliminar");
    for(let i = 0; i < btnEliminarItem.length; i++){
        let button = btnEliminarItem[i];
        button.addEventListener("click" , eliminarItemCarrito); //cuando se hace click llama a la funcion para eliminar 
    }

    //funcionalidad al boton sumar cantidad 

    let btnSumar = document.getElementsByClassName("sumar-cantidad");
    for (let i = 0 ; i < btnSumar.length ; i++){
        let button = btnSumar[i];
        button.addEventListener("click", sumarCantidad);
    }
    
    //funcionalidad al boton restar cantidad 

    let btnRestar = document.getElementsByClassName("restar-cantidad");
    for (let i = 0; i < btnRestar.length; i++) {
        let button = btnRestar[i];
        button.addEventListener("click", restarCantidad);
    }

    //Funcionalidad Agregar al carrito
    let btnAgregarAlCarrito = document.getElementsByClassName("boton-item");
    for( let i = 0 ; i < btnAgregarAlCarrito.length ; i++){
        let button = btnAgregarAlCarrito[i];
        button.addEventListener("click", AgregarAlCarritoClick);
    }

    //boton pagar
    document.getElementsByClassName("btn-pagar")[0].addEventListener("click",pagarclick);
}

//Elimina item del carrito 
function eliminarItemCarrito (event){
    let buttonClick = event.target;
    buttonClick.parentElement.remove();//saca el item del carrito

    actualizarTotalVenta();//para actualizar el total una vez eliminado

    ocultarCarrito();//para controlar si hay elementos en el carrito  si no hay se oculta el carrito
}

//para actualizar el total una vez eliminado
function actualizarTotalVenta (){
    let contenedorCarrito = document.getElementsByClassName("carrito-compras")[0];
    let carritoItems = contenedorCarrito.getElementsByClassName("carrito-item");
    let total = 0;

    //recorremos el elemento para actualizar el valor del total
    for (let i = 0 ; i < carritoItems.length;i++){
        let item = carritoItems[i];
        let precioElement = item.getElementsByClassName("carrito-item-precio")[0];
        console.log(precioElement);//eL PRECIO DEL ELEMENTO QUE QUEDA EN EL CARRITO
        //sacamos el signo y el punto para poder sumarlo y que no de error
        let precio = parseFloat(precioElement.innerText.replace("€","").replace(".",""));
        let cantidadItem = item.getElementsByClassName("carrito-item-cantidad")[0];
        let cantidad = cantidadItem.value;
        total += (precio*cantidad);
    }
    total = Math.round(total/100);
    document.getElementsByClassName("carrito-precio-total")[0].innerText = total.toLocaleString("es-ES") + ",00" + "€"; //asi modificamosel valor del total en el carrito
}

//para ocultar el carrito cuando no tiene elementos 

function ocultarCarrito(){
    let carritoItems = document.getElementsByClassName("carrito-items")[0];
    if(carritoItems.childElementCount == 0){
        let carrito = document.getElementsByClassName("carrito-compras")[0];
        carrito.style.marginRigth = "-100%";
        carrito.style.opacity ="0";
        carritoVisible = false;
    }
}

//Para aumentar en una la cantidad del elemento
function sumarCantidad(event){
    let buttonClick = event.target;
    let selector = buttonClick.parentElement;
    let cantidadActual = selector.getElementsByClassName("carrito-item-cantidad")[0].value; // me devuelve el valor que tengo actualmente en el carrito
    console.log(cantidadActual);
    cantidadActual++;
    selector.getElementsByClassName("carrito-item-cantidad")[0].value = cantidadActual; // actualiza la cantidad al carrito
    //actializa precio total
    actualizarTotalVenta();
}

function restarCantidad(event){
    let buttonClick = event.target;
    let selector = buttonClick.parentElement;
    let cantidadActual = selector.getElementsByClassName("carrito-item-cantidad")[0].value; // me devuelve el valor que tengo actualmente en el carrito
    console.log(cantidadActual);
    cantidadActual--;

    //controlamos que el minimo sea 1 
    if(cantidadActual>=1){
        selector.getElementsByClassName("carrito-item-cantidad")[0].value = cantidadActual; // actualiza la cantidad al carrito
        //actializa precio total
        actualizarTotalVenta();
    }
}

function AgregarAlCarritoClick(event){
    let button = event.target;
    let item = button.parentElement;
    let titulo = item.getElementsByClassName("titulo")[0].innerText;//me da el titulo del articulo a agregar
    let precio = item.getElementsByClassName("precio")[0].innerText;
    //hacer que aparezca el carro luego de una compra  si no esta 
    if(carritoVisible == false){
        hacerVisible();
    }
    //Agregamos al carrito 
    agregarItemAlCarrito(titulo,precio);

}
//visible carrito
function hacerVisible() {
    carritoVisible = true;
    let carrito = document.getElementsByClassName("carrito-compras")[0];
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1';
    /* var items = document.getElementsByClassName('carrito')[0];
    items.style.width = '60%'; */
}

function agregarItemAlCarrito (titulo,precio){
    let item = document.createElement("div");
    item.classList.add = "item";
    let itemsCarrito = document.getElementsByClassName("carrito-items")[0];
    //controlamos que el item no este ya en el carrito
    let nombresItemsCarrito = itemsCarrito.getElementsByClassName("carrito-item-titulo");
    for ( let i = 0 ; i < nombresItemsCarrito.length;i++){
        if (nombresItemsCarrito[i].innerText == titulo.toUpperCase()){ //lo paso a mayuscula porque sino no entra en el if
            alert('El item ya se encuentra en el carrito');
            return;
        }
    }

    let contenidoCarrito = `
        <div class="carrito-item">
                <img src="..//assets/piezas-de-repuesto.png" alt="" width="80px">
                <div class="carrito-item-detalles">
                    <span class="carrito-item-titulo">${titulo}</span>
                    <div class="selector-cantidad">
                        <i class="fa-solid fa-minus restar-cantidad"></i>
                        <input type="text" value="1" class="carrito-item-cantidad" disabled">
                        <i class="fa-solid fa-plus sumar-cantidad"></i>
                    </div>
                    <span class="carrito-item-precio">${precio}</span>
                </div>
                <span class="btn-eliminar">
                    <i class="fa-solid fa-trash"></i>
                </span>
            </div>
    `

    item.innerHTML =  contenidoCarrito;
    itemsCarrito.append(item);

    //funcionalidad eliminar del nuevo item
    item.getElementsByClassName("btn-eliminar")[0].addEventListener("click",eliminarItemCarrito);
    //restar cantidad
    let botonRestarCantidad = item.getElementsByClassName('restar-cantidad')[0];
    botonRestarCantidad.addEventListener('click', restarCantidad);

    //sumar cantidad 
    let botonSumarCantidad = item.getElementsByClassName('sumar-cantidad')[0];
    botonSumarCantidad.addEventListener('click', sumarCantidad);

    //Actualizamos total
    actualizarTotalCarrito();
}

function pagarclick (event){
    alert("Muchas gracias por su compra!!!");
    //eliminamos los items del carrito
    let carritoItems = document.getElementsByClassName("carrito-items")[0];
    while (carritoItems.hasChildNodes()){
        carritoItems.removeChild(carritoItems.firstChild);
    }
    actualizarTotalVenta();
    //ocultar carrito
    ocultarCarrito();
}
