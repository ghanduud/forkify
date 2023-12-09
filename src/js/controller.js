
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './view/recipeView.js';
import * as model from './model.js';

// https://forkify-api.herokuapp.com/v2

init();
///////////////////////////////////////
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
    recipeView.renderError();
  }
}

function init() {
  recipeView.addHandlerRender(controllRecipe);
}