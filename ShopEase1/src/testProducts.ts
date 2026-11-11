import { getProducts, getProductById } from "./services/productService";

getProducts().then((list) => console.log("List:", list.length));

getProductById(1).then((p) => console.log("One:", p));

getProductById(9999).catch((e: Error) => console.log("Error:", e.message));
