export class Plato {
    constructor(storedIngredients, storedPhoto, storedZone, storedInstructions, storedVideo) {
        this._storedIngredients = storedIngredients || [];
        this._storedPhoto = storedPhoto;
        this._storedZone = storedZone;
        this._storedInstructions = storedInstructions;
        this._storedVideo = storedVideo;
    }

    // Getters
    get storedIngredients() {
        return this._storedIngredients;
    }

    get storedPhoto() {
        return this._storedPhoto;
    }

    get storedZone() {
        return this._storedZone;
    }

    get storedInstructions() {
        return this._storedInstructions;
    }

    get storedVideo() {
        return this._storedVideo;
    }

    // Setters
    set storedIngredients(ingredients) {
        if (Array.isArray(ingredients)) {
            this._storedIngredients = ingredients;
        } else {
            throw new Error("storedIngredients tiene que ser un array.");
        }
    }

    set storedPhoto(photo) {
        this._storedPhoto = photo;
    }

    set storedZone(zone) {
        this._storedZone = zone;
    }

    set storedInstructions(instructions) {
        this._storedInstructions = instructions;
    }

    set storedVideo(video) {
        this._storedVideo = video;
    }

    // toString
    toString() {
        return `Datalles del plato:\n` +
               `Ingredients: ${this._storedIngredients.join(", ")}\n` +
               `Photo: ${this._storedPhoto}\n` +
               `Zone: ${this._storedZone}\n` +
               `Instructions: ${this._storedInstructions}\n` +
               `Video: ${this._storedVideo}`;
    }
}