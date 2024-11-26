import { productServices } from "../services/product_services.js";

const productContainer = document.querySelector("#data-products");

export async function renderProducts() {
    productContainer.innerHTML = ""; 
    const products = await productServices.productsList();
    products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("geek__card");
        productCard.innerHTML = `
        <figure class="card__figure">
          <img src="${product.image}" alt="${product.name}" class="card__figure--img" />
          <figcaption>${product.name}</figcaption>
        </figure>
        <div class="container__delete">
          <strong>$ ${product.price}</strong>
          <button class="bottom--deleted" data-id="${product.id}">
            <img src="./assets/trash_.svg" alt="Eliminar">
          </button>
        </div>
        `;
        productContainer.appendChild(productCard);
    });

    document.querySelectorAll(".bottom--deleted").forEach((button) => {
        button.addEventListener("click", async (event) => {
            const productId = event.currentTarget.getAttribute("data-id");
            await deleteProductHandler(productId);
        });
    });
}

async function deleteProductHandler(productId) {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este producto?");
    if (confirmDelete) {
        try {
            await productServices.deleteProduct(productId);
            alert("Producto eliminado correctamente");
            renderProducts();
        } catch (error) {
            console.error("Error eliminando producto:", error);
            alert("Hubo un error al eliminar el producto");
        }
    }
}

renderProducts();
