document.addEventListener('DOMContentLoaded', () => {
    const catalog = document.querySelector('.coffee-box');
    const categoryButtons = [...document.querySelectorAll('[data-category]')];
    const showMoreButton = catalog?.querySelector('.refresh');

    if (!catalog || !showMoreButton || categoryButtons.length === 0) {
        return;
    }

    let products = [];
    let activeCategory = 'coffee';

    const createProductCard = (product, index) => {
        const card = document.createElement('article');
        card.className = 'coffe-box-container';
        card.dataset.productId = `${product.category}-${index + 1}`;

        if (index >= 4) {
            card.classList.add('coffe-box-container-off');
        }

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

        return card;
    };

    const updateCategoryButtons = () => {
        categoryButtons.forEach((button) => {
            const isActive = button.dataset.category === activeCategory;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });
    };

    const renderProducts = () => {
        const oldCards = catalog.querySelectorAll('.coffe-box-container');
        oldCards.forEach((card) => card.remove());

        const categoryProducts = products.filter(
            (product) => product.category === activeCategory,
        );
        const cards = categoryProducts.map(createProductCard);
        showMoreButton.before(...cards);
        showMoreButton.setAttribute('aria-label', `Show more ${activeCategory} products`);
        showMoreButton.classList.toggle('refresh-off', categoryProducts.length <= 4);
    };

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
