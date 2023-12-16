import PreviewView from './previewView';

class ResultsView extends PreviewView {
	_parentEl = document.querySelector('.results');
	_errorMessage = 'No recipe found for your query! Please try again :)';
	_message = '';
}
export default new ResultsView();
