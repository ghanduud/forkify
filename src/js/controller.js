import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './view/recipeView.js';
import * as model from './model.js';
import searchView from './view/searchView.js';
import resultView from './view/resultView.js';
import paginationView from './view/paginationView.js';
import bookmarkView from './view/bookmarkView.js';
// https://forkify-api.herokuapp.com/v2

init();
///////////////////////////////////////
// controlRecipe();
async function controlRecipe() {
	try {
		const id = window.location.hash.slice(1);
		if (!id) return;
		recipeView.renderSpinner();
		resultView.update(model.getSearchResultsPage());
		bookmarkView.update(model.state.bookmarks);
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
		resultView.render(model.getSearchResultsPage());
		paginationView.render(model.state.search);
	} catch (err) {
		resultView.renderError();
	}
}

function controlPagenation(goToPage) {
	resultView.render(model.getSearchResultsPage(goToPage));
	paginationView.render(model.state.search);
}

function controlServing(newServing) {
	model.updateServings(newServing);
	recipeView.update(model.state.recipe);
	
}

function controlBookmarks() {
	try{
		if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
		else model.deleteBookmarks(model.state.recipe.id);
		recipeView.update(model.state.recipe);
		bookmarkView.render(model.state.bookmarks);
	}
	catch(err){
		bookmarkView.renderError();
	}

}

function init() {
	recipeView.addHandlerRender(controlRecipe);
	recipeView.addHandlerUpdateServing(controlServing);
	searchView.addHandlerSearch(controlSearchResult);
	recipeView.addHandlerBookmark(controlBookmarks);
	paginationView.addHandlerClick(controlPagenation);
}
