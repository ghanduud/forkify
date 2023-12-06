
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './view/recipeView.js';
import * as model from './model.js';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
['hashchange', 'load'].forEach(ev => window.addEventListener(ev, controllRecipe));
// controllRecipe();
async function controllRecipe() {
  try{
    const id = window.location.hash.slice(1);
    if(!id) return
    recipeView.renderSpinner();
    await model.loadRecipe(id);
    const {recipe} = model.state;
    recipeView.render(model.state.recipe);
  }
  catch(err){
    alert(err);
  }
}

