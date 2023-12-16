import PreviewView from './previewView';

class BookmarkView extends PreviewView {
	_parentEl = document.querySelector('.bookmarks__list');
	_errorMessage = 'No bookmarked recipes yet :)';
	_message = '';
}
export default new BookmarkView();
