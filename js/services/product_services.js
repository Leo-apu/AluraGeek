const URLAPI = "http://localhost:3001/products";

// Obtener la lista de productos
const productsList = async () => {
    try {
        const response = await fetch(URLAPI);
        if (!response.ok) throw new Error("Error al obtener productos");
        return await response.json();
    } catch (error) {
        console.error("Error en productsList:", error);
        return [];
    }
};

// Crear un nuevo producto
const createProduct = async (name, image, price) => {
    try {
        const newProduct = { name, image, price };
        const response = await fetch(URLAPI, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct),
        });
        if (!response.ok) throw new Error("Error al crear producto");
        return await response.json();
    } catch (error) {
        console.error("Error en createProduct:", error);
    }
};

// Eliminar un producto por ID
const deleteProduct = async (id) => {
    try {
        const response = await fetch(`${URLAPI}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Error al eliminar producto");
        return true;
    } catch (error) {
        console.error("Error en deleteProduct:", error);
    }
};

export const productServices = { productsList, createProduct, deleteProduct };
