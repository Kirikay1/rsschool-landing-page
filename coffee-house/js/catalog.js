document.addEventListener('DOMContentLoaded', () => {
    const catalog = document.querySelector('.coffee-box');
    const categoryButtons = [...document.querySelectorAll('[data-category]')];
    const showMoreButton = catalog?.querySelector('.refresh');

    if (!catalog || !showMoreButton || categoryButtons.length === 0) {
        return;
    }

    let products = [];
    let activeCategory = 'coffee';
    let isExpanded = false;
    let activeModal = null;
    let modalTrigger = null;
    const compactCatalog = window.matchMedia('(max-width: 768px)');

    const createOptionButton = (marker, label, isActive = false) => {
        const button = document.createElement('button');
        button.className = 'product-modal-option';
        button.type = 'button';
        button.setAttribute('aria-pressed', String(isActive));
        button.classList.toggle('is-active', isActive);

        const markerElement = document.createElement('span');
        markerElement.className = 'product-modal-option-marker';
        markerElement.textContent = marker;

        const labelElement = document.createElement('span');
        labelElement.textContent = label;

        button.append(markerElement, labelElement);

        return button;
    };

    const closeProductModal = () => {
        if (!activeModal) {
            return;
        }

        activeModal.remove();
        activeModal = null;
        document.body.classList.remove('modal-open');
        modalTrigger?.focus();
        modalTrigger = null;
    };

    const openProductModal = (product, productIndex, trigger) => {
        const selectedAdditives = new Set();
        let selectedSize = Object.keys(product.sizes)[0];

        const overlay = document.createElement('div');
        overlay.className = 'product-modal-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'product-modal';
        dialog.tabIndex = -1;
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');

        const titleId = `product-modal-title-${product.category}-${productIndex + 1}`;
        const descriptionId = `product-modal-description-${product.category}-${productIndex + 1}`;
        dialog.setAttribute('aria-labelledby', titleId);
        dialog.setAttribute('aria-describedby', descriptionId);

        const imageContainer = document.createElement('div');
        imageContainer.className = 'product-modal-image-container';

        const image = document.createElement('img');
        image.className = 'product-modal-image';
        image.src = `img/${product.category}-${productIndex + 1}.png`;
        image.alt = product.name;
        imageContainer.append(image);

        const content = document.createElement('div');
        content.className = 'product-modal-content';

        const heading = document.createElement('div');
        heading.className = 'product-modal-heading';

        const title = document.createElement('h2');
        title.className = 'product-modal-title';
        title.id = titleId;
        title.textContent = product.name;

        const description = document.createElement('p');
        description.className = 'product-modal-description';
        description.id = descriptionId;
        description.textContent = product.description;
        heading.append(title, description);

        const sizeGroup = document.createElement('fieldset');
        sizeGroup.className = 'product-modal-group';

        const sizeLegend = document.createElement('legend');
        sizeLegend.className = 'product-modal-label';
        sizeLegend.textContent = 'Size';

        const sizeOptions = document.createElement('div');
        sizeOptions.className = 'product-modal-options';

        const totalPrice = document.createElement('span');
        totalPrice.className = 'product-modal-total-price';

        const updateTotalPrice = () => {
            const sizePrice = Number(product.sizes[selectedSize]['add-price']);
            const additivesPrice = [...selectedAdditives].reduce(
                (total, index) => total + Number(product.additives[index]['add-price']),
                0,
            );
            totalPrice.textContent = `$${(Number(product.price) + sizePrice + additivesPrice).toFixed(2)}`;
        };

        Object.entries(product.sizes).forEach(([key, size], index) => {
            const button = createOptionButton(key.toUpperCase(), size.size, index === 0);

            button.addEventListener('click', () => {
                selectedSize = key;
                sizeOptions.querySelectorAll('.product-modal-option').forEach((option) => {
                    const isSelected = option === button;
                    option.classList.toggle('is-active', isSelected);
                    option.setAttribute('aria-pressed', String(isSelected));
                });
                updateTotalPrice();
            });

            sizeOptions.append(button);
        });
        sizeGroup.append(sizeLegend, sizeOptions);

        const additivesGroup = document.createElement('fieldset');
        additivesGroup.className = 'product-modal-group';

        const additivesLegend = document.createElement('legend');
        additivesLegend.className = 'product-modal-label';
        additivesLegend.textContent = 'Additives';

        const additivesOptions = document.createElement('div');
        additivesOptions.className = 'product-modal-options';

        product.additives.forEach((additive, index) => {
            const button = createOptionButton(String(index + 1), additive.name);

            button.addEventListener('click', () => {
                if (selectedAdditives.has(index)) {
                    selectedAdditives.delete(index);
                } else {
                    selectedAdditives.add(index);
                }

                const isSelected = selectedAdditives.has(index);
                button.classList.toggle('is-active', isSelected);
                button.setAttribute('aria-pressed', String(isSelected));
                updateTotalPrice();
            });

            additivesOptions.append(button);
        });
        additivesGroup.append(additivesLegend, additivesOptions);

        const total = document.createElement('div');
        total.className = 'product-modal-total';

        const totalLabel = document.createElement('span');
        totalLabel.textContent = 'Total:';
        total.append(totalLabel, totalPrice);

        const note = document.createElement('div');
        note.className = 'product-modal-note';

        const noteIcon = document.createElement('span');
        noteIcon.className = 'product-modal-note-icon';
        noteIcon.setAttribute('aria-hidden', 'true');
        noteIcon.textContent = 'i';

        const noteText = document.createElement('p');
        noteText.textContent =
            'The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.';
        note.append(noteIcon, noteText);

        const closeButton = document.createElement('button');
        closeButton.className = 'product-modal-close';
        closeButton.type = 'button';
        closeButton.textContent = 'Close';
        closeButton.addEventListener('click', closeProductModal);

        content.append(
            heading,
            sizeGroup,
            additivesGroup,
            total,
            note,
            closeButton,
        );
        dialog.append(imageContainer, content);
        overlay.append(dialog);

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                closeProductModal();
            }
        });

        modalTrigger = trigger;
        activeModal = overlay;
        document.body.append(overlay);
        document.body.classList.add('modal-open');
        updateTotalPrice();
        dialog.focus();
    };

    const createProductCard = (product, index) => {
        const card = document.createElement('article');
        card.className = 'coffe-box-container';
        card.dataset.productId = `${product.category}-${index + 1}`;
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-haspopup', 'dialog');
        card.setAttribute('aria-label', `Open details for ${product.name}`);

        const imageContainer = document.createElement('div');
        imageContainer.className = 'coffe-box-img-content';

        const image = document.createElement('img');
        image.className = 'coffe-box-img';
        image.src = `img/${product.category}-${index + 1}.png`;
        image.alt = product.name;

        const content = document.createElement('div');
        content.className = 'coffe-box-content';

        const textContainer = document.createElement('div');
        textContainer.className = 'coffe-box-content-text';

        const title = document.createElement('h2');
        title.className = 'coffe-box-title';
        title.textContent = product.name;

        const description = document.createElement('p');
        description.className = 'coffe-box-text';
        description.textContent = product.description;

        const price = document.createElement('p');
        price.className = 'coffe-box-price';
        price.textContent = `$${product.price}`;

        imageContainer.append(image);
        textContainer.append(title, description);
        content.append(textContainer, price);
        card.append(imageContainer, content);

        card.addEventListener('click', () => openProductModal(product, index, card));
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openProductModal(product, index, card);
            }
        });

        return card;
    };

    const updateCategoryButtons = () => {
        categoryButtons.forEach((button) => {
            const isActive = button.dataset.category === activeCategory;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });
    };

    const updateProductVisibility = () => {
        const cards = [...catalog.querySelectorAll('.coffe-box-container')];
        const shouldCollapse = compactCatalog.matches && !isExpanded && cards.length > 4;

        cards.forEach((card, index) => {
            card.classList.toggle('coffe-box-container-off', shouldCollapse && index >= 4);
        });

        showMoreButton.classList.toggle('refresh-off', !shouldCollapse);
    };

    const renderProducts = () => {
        isExpanded = false;

        const oldCards = catalog.querySelectorAll('.coffe-box-container');
        oldCards.forEach((card) => card.remove());

        const categoryProducts = products.filter(
            (product) => product.category === activeCategory,
        );
        const cards = categoryProducts.map(createProductCard);
        showMoreButton.before(...cards);
        showMoreButton.setAttribute('aria-label', `Show more ${activeCategory} products`);
        updateProductVisibility();
    };

    showMoreButton.addEventListener('click', () => {
        isExpanded = true;
        updateProductVisibility();
    });

    compactCatalog.addEventListener('change', () => {
        isExpanded = false;
        updateProductVisibility();
    });

    document.addEventListener('keydown', (event) => {
        if (!activeModal) {
            return;
        }

        if (event.key === 'Escape') {
            closeProductModal();
            return;
        }

        if (event.key === 'Tab') {
            const focusableElements = [...activeModal.querySelectorAll('button')];
            const firstElement = focusableElements[0];
            const lastElement = focusableElements.at(-1);
            const dialog = activeModal.querySelector('.product-modal');

            if (event.shiftKey && [firstElement, dialog].includes(document.activeElement)) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    });

    categoryButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (button.dataset.category === activeCategory || products.length === 0) {
                return;
            }

            activeCategory = button.dataset.category;
            updateCategoryButtons();
            renderProducts();
        });
    });

    fetch('data/products.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load products: ${response.status}`);
            }

            return response.json();
        })
        .then((data) => {
            products = data;
            updateCategoryButtons();
            renderProducts();
        })
        .catch((error) => {
            console.error(error);

            const message = document.createElement('p');
            message.className = 'catalog-error';
            message.textContent = 'Products could not be loaded. Please refresh the page.';
            showMoreButton.before(message);
            showMoreButton.classList.add('refresh-off');
        });
});
