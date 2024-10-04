import '@shgysk8zer0/components/youtube/player.js';
import { chapters } from './consts.js';
import { createYouTubeEmbed } from '@shgysk8zer0/kazoo/youtube.js';
import { html } from '@aegisjsproject/core/parsers/html.js';
import { css } from '@aegisjsproject/core/parsers/css.js';
import { EVENTS, observeEvents } from '@aegisjsproject/core/events.js';
import { registerCallback } from '@aegisjsproject/core/callbackRegistry.js';
import { properties } from '@aegisjsproject/styles/properties.js';
import { reset } from '@aegisjsproject/styles/reset.js';
import { baseTheme, lightTheme, darkTheme } from '@aegisjsproject/styles/theme.js';
import { positions } from '@aegisjsproject/styles/misc.js';
import { btn, btnPrimary } from '@aegisjsproject/styles/button.js';
import { forms } from '@aegisjsproject/styles/forms.js';

const styles = css`dialog {
	border: none;
}

dialog::backdrop {
	background-color: rgba(0, 0, 0, 0.8);
	backdrop-filter: blur(4px);
}

.no-border {
	border: none;
}

.btn.btn-transparent {
	border: none;
	background-color: transparent;
}`;

document.adoptedStyleSheets = [properties, reset, baseTheme, lightTheme, darkTheme, positions, btn, btnPrimary, forms, styles];

const submitHandler = registerCallback('question:check', event => {
	event.preventDefault();
	const data = new FormData(event.target);
	const chapter = chapters.findIndex(chap => chap.id === data.get('id'));

	if (chapter !== -1 && data.get('answer') === chapters[chapter].a) {
		showVideo(chapter + 1);
	} else if (chapter !== 0 && confirm('That is not correct. Would you like to re-watch the previous chapter?')) {
		showVideo(chapter);
	}
});

async function showVideo(chapter) {
	const { vid, width, height } = chapters[chapter];
	const { resolve, promise } = Promise.withResolvers();
	const yt = createYouTubeEmbed(vid, { width, height });
	const tmp = document.getElementById('player-template').content.cloneNode(true);
	const dialog = tmp.querySelector('dialog');
	dialog.append(yt);
	dialog.addEventListener('close', resolve, { once: true });
	document.body.append(dialog);
	dialog.showModal();

	await promise;
}

function setQuestion(chapter) {
	const { id, q, opts } = chapters[chapter];
	const form = html`<form ${EVENTS.onSubmit}="${submitHandler}">
		<fieldset class="no-border">
			<legend><b>Chapter ${chapter + 1}</b></legend>
			<div class="form-group">
				<label for="${id}-opts" class="input-label">${q}</label>
				<select name="answer" id="${id}-opts" class="input" required="">
					${opts.map(opt => `<option>${opt}</option>`)}
				</select>
			</div>
			<input type="hidden" name="id" value="${id}" readonly />
			<button type="submit" class="btn btn-primary">
				<svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
					<path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"/>
				</svg>
			</button>
		</fieldset>
	</form>`;

	document.getElementById('main').replaceChildren(form);
}

if (location.hash.length < 2) {
	showVideo(0);
} else {
	const id = location.hash.substring(1).toLowerCase();
	const chapter = chapters.findIndex(chap => chap.id === id);

	if (chapter === -1) {
		showVideo(0);
	} else {
		setQuestion(chapter);
	}
}

globalThis.addEventListener('hashchange', () => {
	const id = location.hash.substring(1).toLowerCase();
	const chapter = chapters.findIndex(chap => chap.id === id);

	if (chapter === -1) {
		showVideo(0);
	} else {
		setQuestion(chapter);
	}
});

observeEvents();
