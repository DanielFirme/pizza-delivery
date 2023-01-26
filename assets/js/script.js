const c = e => document.querySelector(e);
const cs = e => document.querySelectorAll(e);
let modalQt = 1, pizzaPrice, cart = [], modalKey = 0;


//LISTAGEM DAS PIZZAS
pizzaJson.forEach((e, i) => {
    const pizzaItem = c('.models .pizza-item').cloneNode(true);
    pizzaPrice = e.price[2];
    pizzaItem.setAttribute('data-key', i);
    pizzaItem.querySelector('.pizza-item--name').innerHTML = e.name;
    pizzaItem.querySelector('.pizza-item--img img').src = e.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${pizzaPrice.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = e.description;
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        console.log(e);
        e.preventDefault(); //Cancela o evento se for cancelável, sem parar a propagação do mesmo.
        let key = e.currentTarget.parentNode.getAttribute('data-key'); // O método Element.closest() retorna o ancestral mais próximo, em relação ao elemento atual, que possui o seletor fornecido como parâmetro. No caso de o elemento atual possuir o seletor, o mesmo é retornado. Caso não exista um ancestral o método retorna null.
        modalQt = 1;
        modalKey = key;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
        
        cs('.pizzaInfo--size').forEach((el, i) => {
            if(i == 2){
                el.classList.add('selected');
            }

            el.querySelector('span').innerHTML = pizzaJson[key].sizes[i];

        });
        c('.pizzaInfo--qt').innerHTML = modalQt;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo .pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price[2].toFixed(2)}`;

    })

    c('.pizza-area').append(pizzaItem);

});

//EVENTOS DO MODAL
function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

cs('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach(e => {
    e.addEventListener('click', closeModal);
});

window.addEventListener('keyup', (event) => {
    if(event.code === 'Escape'){
        closeModal();
    }
});

window.addEventListener('click', (event) => {
    if(event.target.getAttribute('class') == "pizzaWindowArea"){
        closeModal();
    }
});

c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

cs('.pizzaInfo--size').forEach((size) => {
    const sizeKey = size.getAttribute('data-key');
    size.addEventListener('click', ()=>{
        pizzaPrice = pizzaJson[modalKey].price[sizeKey];  
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaPrice.toFixed(2)}`;
    });
});

c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    const size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    
    const identify = `${pizzaJson[modalKey].id}@${size}`;

    const key = cart.findIndex((item)=> item.identify == identify);
    
    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identify,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
    updateCart();
    closeModal();
});

function updateCart(){
    
    c('.menu-openner span').innerHTML = cart.length;
    
    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = "";
        let subtotal = 0, desconto = 0, total = 0;
        cart.forEach((pizzaC, index)=>{
            const cartItem = c('.models .cart--item').cloneNode(true);
            const pizzaItem = pizzaJson.find((pizzaJ)=>pizzaJ.id == pizzaC.id);
            cartItem.querySelector("img").src = pizzaItem.img;
            cartItem.querySelector('.cart--item-name').innerHTML = `${pizzaItem.name} (${pizzaItem.sizes[pizzaC.size]})`;
            cartItem.querySelector('.cart--item--qt').innerHTML = pizzaC.qt;
            cartItem.querySelector('.cart--item-price').innerHTML = ` ➡ R$ ${(pizzaItem.price[pizzaC.size] * pizzaC.qt).toFixed(2)}`;
            subtotal += pizzaItem.price[pizzaC.size] * pizzaC.qt; 
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                    pizzaC.qt--;
                    if(pizzaC.qt == 0){
                        cart.splice(index, 1);
                    }
                    updateCart();
            });
            
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                    pizzaC.qt++;
                    updateCart();
            });
            c('.cart').append(cartItem);
        });

        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = "100vw";
    }
}

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = "0vw";
    }
});

c('.menu-closer').addEventListener('click', ()=>{
        c('aside').style.left = "100vw";
});

