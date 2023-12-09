import { async } from "regenerator-runtime";
import { API_URL } from "./config";
import { getJSON } from "./helper";

export const state = {
    recipe: {},
};



export async function loadRecipe(id) {
    try{
        const data = await getJSON(`${API_URL}/${id}`);

        let {recipe} = data.data;
        state.recipe = {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        };
    }
    catch(err){
        console.error(`${err}!! try again later`);
        throw err;
    }
}