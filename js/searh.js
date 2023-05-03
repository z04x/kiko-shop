window.onload = function () {
    document.addEventListener("click", documentActions);

    // Actions (делегирование события click)
    function documentActions(e) {
        const targetElement = e.target;

        if (targetElement.classList.contains('buttons-card__add-order')) {
            const productId = targetElement.closest('.product-card__content').dataset.pid;
            addToCart(targetElement, productId);
            e.preventDefault();
        }

        if (targetElement.classList.contains('icons-content__link-shop') || targetElement.closest('.icons-content__link-shop')) {
            if (document.querySelector('.icons-content__shop').children.length > 0) {
                document.querySelector('.icons-content__shop', '').classList.toggle('_active');
                document.querySelector('.cart-list', '').classList.toggle('_active');
                document.querySelector('.shop__container', '').classList.toggle('_active');
            }
            e.preventDefault();
        } else if (!targetElement.closest('.icons-content__shop') && !targetElement.classList.contains('actions-product__button')) {
            document.querySelector('.icons-content__shop').classList.remove('_active');
        }
        if (targetElement.classList.contains('cart-list__delete')) {
            const productId = targetElement.closest('.cart-list__item').dataset.cartPid;
            updateCart(targetElement, productId, false);
            e.preventDefault();
        }
        if (targetElement.classList.contains('shop__close')) {
            const productId = targetElement.closest('.shop').dataset.cartPid;
            updateCart(targetElement, productId, false);
            e.preventDefault();
        }

    }

    // AddToCart
    function addToCart(productButton, productId) {
        if (!productButton.classList.contains('_hold')) {
            productButton.classList.add('_hold');
            productButton.classList.add('_fly');

            const cart = document.querySelector('.icons-content__link-shop');
            const product = document.querySelector(`[data-pid="${productId}"]`);
            const productImage = product.querySelector('.product-card__image-img');

            const productImageFly = productImage.cloneNode(true);

            const productImageFlyWidth = productImage.offsetWidth;
            const productImageFlyHeight = productImage.offsetHeight;
            const productImageFlyTop = productImage.getBoundingClientRect().top;
            const productImageFlyLeft = productImage.getBoundingClientRect().left;

            productImageFly.setAttribute('class', '_flyImage _ibg');
            productImageFly.style.cssText =
                `
            	left: ${productImageFlyLeft}px;
            	top: ${productImageFlyTop}px;
            	width: ${productImageFlyWidth}px;
            	height: ${productImageFlyHeight}px;
            `;

            document.body.append(productImageFly);

            const cartFlyLeft = cart.getBoundingClientRect().left;
            const cartFlyTop = cart.getBoundingClientRect().top;

            productImageFly.style.cssText =
                `
            	left: ${cartFlyLeft}px;
            	top: ${cartFlyTop}px;
            	width: 0px;
            	height: 0px;
            	opacity:0;
            `;

            productImageFly.addEventListener('transitionend', function () {
                if (productButton.classList.contains('_fly')) {
                    productImageFly.remove();
                    updateCart(productButton, productId);
                    productButton.classList.remove('_fly');


                }
            });
        }
    }

    function updateCart(productButton, productId, productAdd = true) {
        const cart = document.querySelector('.icons-content__shop');
        const cartIcon = cart.querySelector('.icons-content__link-shop');
        const cartQuantity = cartIcon.querySelector('span');
        const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
        const cartList = document.querySelector('.cart-list');

        //Добавляем
        if (productAdd) {
            if (cartQuantity) {
                cartQuantity.innerHTML = ++cartQuantity.innerHTML;
            } else {
                cartIcon.insertAdjacentHTML('beforeend', `<span>1</span>`);
            }
            if (!cartProduct) {
                const product = document.querySelector(`[data-pid="${productId}"]`);
                const cartProductImage = product.querySelector('.product-card__image').innerHTML;
                const cartProductTitle = product.querySelector('.items-product-card__name').innerHTML;
                const cartProductContent = `
    		<button href="" class="cart-list__image _ibg">${cartProductImage}</button>
    		<div class="cart-list__body">
            <p href="" class="cart-list__title">Woosin R&B Black Food 3.7</p>
    			<p href="" class="cart-list__text">${cartProductTitle}</p>
    			<div class="cart-list__quantity">Кол-во: <span>1</span></div>
    			<a href="" class="cart-list__delete">✖</a>
    		</div>`;
                cartList.insertAdjacentHTML('beforeend', `<li data-cart-pid="${productId}" class="cart-list__item">${cartProductContent}</li>`);
            } else {
                const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
                cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
            }

            // После всех действий
            productButton.classList.remove('_hold');
        } else {
            const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
            cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
            if (!parseInt(cartProductQuantity.innerHTML)) {
                cartProduct.remove();
            }

            const cartQuantityValue = --cartQuantity.innerHTML;

            if (cartQuantityValue) {
                cartQuantity.innerHTML = cartQuantityValue;
            } else {
                cartQuantity.remove();
                cart.classList.remove('_active');
            }
        }
    }
}


