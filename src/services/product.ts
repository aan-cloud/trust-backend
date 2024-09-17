import dataDummy from "../data";

export default class ProductServices {
    getAllProduct() {
        return dataDummy
    };

    getProductById(id: string) {
        return dataDummy.filter(f => f.id === id)
    };
};