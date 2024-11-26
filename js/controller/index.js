import { productServices } from "../services/product_services.js";

const productContainer = document.querySelector("#data-products");
const form = document.querySelector("#form-product");
const clearButton = document.querySelector("#clear-button");
const nameInput = document.querySelector("#form-name");
const costInput = document.querySelector("#form-cost");
const imageInput = document.querySelector("#form-image");
const submitButton = form.querySelector("button[type='submit']");

const errorMessages = {
  name: document.querySelector("#name-error"),
  cost: document.querySelector("#cost-error"),
  image: document.querySelector("#image-error"),
};

// Validaciones de campos con mensajes de error
const validations = {
  isNameValid: () => {
    const valid = nameInput.value.trim().length > 3;
    errorMessages.name.textContent = valid
      ? ""
      : "El nombre debe tener más de 3 caracteres";
    return valid;
  },
  isCostValid: () => {
    const valid = /^[0-9]+$/.test(costInput.value);
    errorMessages.cost.textContent = valid
      ? ""
      : "El precio debe contener solo números";
    return valid;
  },
  isImageValid: () => {
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|bmp))$/i;
    const valid = urlPattern.test(imageInput.value);
    errorMessages.image.textContent = valid
      ? ""
      : "La URL debe ser válida y terminar en .png, .jpg";
    return valid;
  },
};

// Validar formulario en tiempo real
function validateForm() {
  const isFormValid =
    validations.isNameValid() &&
    validations.isCostValid() &&
    validations.isImageValid();
  submitButton.disabled = !isFormValid;
}

[nameInput, costInput, imageInput].forEach((input) =>
  input.addEventListener("input", validateForm)
);

// Renderizar productos
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

// Crear producto
async function createProduct() {
  try {
    await productServices.createProduct(
      nameInput.value.trim(),
      imageInput.value.trim(),
      costInput.value.trim()
    );
    await Swal.fire({
      icon: "success",
      title: "Producto creado correctamente",
      showConfirmButton: true,
      timer : 10000 ,
    });
    clearForm();
    renderProducts();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error al crear producto",
      text: error.message || "Inténtalo nuevamente",
    });
  }
}

// Eliminar producto
async function deleteProductHandler(productId) {
  const confirmDelete = await Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás revertir esta acción",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (confirmDelete.isConfirmed) {
    try {
      await productServices.deleteProduct(productId);
      await Swal.fire({
        icon: "success",
        title: "Producto eliminado correctamente",
        showConfirmButton: true,
        timer : 10000,
      });
      renderProducts();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar producto",
        text: error.message || "Inténtalo nuevamente",
      });
    }
  }
}

function clearForm() {
  [nameInput, costInput, imageInput].forEach((input) => (input.value = ""));
  Object.values(errorMessages).forEach((msg) => (msg.textContent = ""));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  createProduct();
});

clearButton.addEventListener("click", clearForm);

submitButton.disabled = true;

renderProducts();
