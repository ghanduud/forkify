import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './view/recipeView.js';
import * as model from './model.js';
import searchView from './view/searchView.js';
import resultView from './view/resultView.js';

// https://forkify-api.herokuapp.com/v2

init();
///////////////////////////////////////
// controlRecipe();
async function controlRecipe() {
	try {
		const id = window.location.hash.slice(1);
		if (!id) return;
		recipeView.renderSpinner();
		await model.loadRecipe(id);
		const { recipe } = model.state;
		recipeView.render(model.state.recipe);
	} catch (err) {
		recipeView.renderError();
	}
}

async function controlSearchResult() {
	try {
		resultView.renderSpinner();
		const query = searchView.getQuery();
		if (!query) return;
		await model.loadSearchResult(query);
		resultView.render(model.state.search.results);
	} catch (err) {
		resultView.renderError();
	}
}

function init() {
	recipeView.addHandlerRender(controlRecipe);
	searchView.addHandlerSearch(controlSearchResult);
}
