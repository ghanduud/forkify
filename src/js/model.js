import { async } from 'regenerator-runtime';
import { API_KEY, API_URL, RES_PER_PAGE } from './config';
import { AJAX } from './helper';

export const state = {
	recipe: {},
	search: {
		query: '',
		results: [],
		page: 1,
		resultsPerPage: RES_PER_PAGE,
	},
	bookmarks: [],
};

init();
// console.log(state.bookmarks);

function createRecipeObject(data) {
	const { recipe } = data.data;
	return {
		id: recipe.id,
		title: recipe.title,
		publisher: recipe.publisher,
		sourceUrl: recipe.source_url,
		image: recipe.image_url,
		servings: recipe.servings,
		cookingTime: recipe.cooking_time,
		ingredients: recipe.ingredients,
		bookmarked: false,
		...(recipe.key && { key: recipe.key }),
	};
}

export async function loadRecipe(id) {
	try {
		const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
		state.recipe = createRecipeObject(data);
		if (state.bookmarks.some((bookmark) => bookmark.id === id)) state.recipe.bookmarked = true;
	} catch (err) {
		console.error(`${err}!! try again later`);
		throw err;
	}
}

export async function loadSearchResult(query) {
	try {
		state.search.page = 1;
		state.search.query = query;
		const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
		state.search.results = data.data.recipes.map((rec) => {
			return {
				id: rec.id,
				title: rec.title,
				publisher: rec.publisher,
				image: rec.image_url,
				...(rec.key && { key: rec.key }),
			};
		});
	} catch (err) {
		console.error(`${err}!! try again later`);
		throw err;
	}
}

export function getSearchResultsPage(page = state.search.page) {
	state.search.page = page;
	const start = (page - 1) * state.search.resultsPerPage;
	const end = page * state.search.resultsPerPage;

	return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
	state.recipe.ingredients.forEach(
		(ing) => (ing.quantity = (ing.quantity * newServings) / state.recipe.servings)
	);
	state.recipe.servings = newServings;
}

export function addBookmark(recipe) {
	state.bookmarks.push(recipe);
	if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
	presistBookmarks();
}

export function deleteBookmarks(id) {
	const index = state.bookmarks.findIndex((bookmark) => bookmark.id === id);
	state.bookmarks.splice(index, 1);
	if (id === state.recipe.id) state.recipe.bookmarked = false;
	presistBookmarks();
}

export async function uploadRecipe(newRecipe) {
	try {
		const ingredients = Object.entries(newRecipe)
			.filter((entry) => entry[0].startsWith('ingredient') && entry[1] !== '')
			.map((ing) => {
				const ingArr = ing[1].split(',').map((el) => el.trim());
				if (ingArr.length !== 3)
					throw new Error('Wrong ingrediant format! please enter the correct format :)');
				const [quantity, unit, description] = ingArr;
				return { quantity: quantity ? +quantity : null, unit, description };
			});
		const recipe = {
			title: newRecipe.title,
			source_url: newRecipe.sourceUrl,
			image_url: newRecipe.image,
			publisher: newRecipe.publisher,
			cooking_time: +newRecipe.cookingTime,
			servings: +newRecipe.servings,
			ingredients,
		};
		const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
		state.recipe = createRecipeObject(data);
		addBookmark(state.recipe);
	} catch (err) {
		throw err;
	}
}

function presistBookmarks() {
	localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

function init() {
	const storge = localStorage.getItem('bookmarks');
	if (storge) state.bookmarks = JSON.parse(storge);
}
