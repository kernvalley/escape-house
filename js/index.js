import { chapters, site } from './consts.js';
import { createYouTubeEmbed } from '@shgysk8zer0/kazoo/youtube.js';
import { html } from '@aegisjsproject/core/parsers/html.js';
import { css } from '@aegisjsproject/core/parsers/css.js';
import { EVENTS, observeEvents } from '@aegisjsproject/core/events.js';
import { registerCallback } from '@aegisjsproject/core/callbackRegistry.js';
import { properties, propertiesLegacy } from '@aegisjsproject/styles/properties.js';
import { reset } from '@aegisjsproject/styles/reset.js';
import { baseTheme, lightTheme, darkTheme } from '@aegisjsproject/styles/theme.js';
import { positions, displays } from '@aegisjsproject/styles/misc.js';
import { btn, btnPrimary, btnOutlinePrimary, btnSecondary, btnLink } from '@aegisjsproject/styles/button.js';
import { forms } from '@aegisjsproject/styles/forms.js';

const styles = css`dialog, [popover] {
	border: none;
}

dialog::backdrop, :popover-open::backdrop {
	background-color: rgba(0, 0, 0, 0.8);
	backdrop-filter: blur(4px);
}

.no-border {
	border: none;
}

.full-width {
	width: 100%;
}

.yt-player {
	max-width: 100%;
}

.container {
	padding: 1.4rem;
	width: min(800px, 95%);
	margin-inline: auto;
}

.btn.btn-transparent {
	border: none;
	background-color: transparent;
}

#scan-btn {
	right: 1.2em;
	bottom: 1.2em;
	color: inherit;
	text-decoration: none;
}`;

document.adoptedStyleSheets = [
	properties, propertiesLegacy, reset, baseTheme, lightTheme, darkTheme, positions, displays, btn,
	btnPrimary, btnOutlinePrimary, btnSecondary, btnLink, forms, styles,
];

const submitHandler = registerCallback('question:check', async event => {
	event.preventDefault();
	const data = new FormData(event.target);
	const chapter = findChapter(location);
	const isCorrect = chapter !== -1 && chapters[chapter].opts[chapters[chapter].a] === data.get('answer');

	if (! isCorrect) {
		if (confirm('That is not correct. Would you like to re-watch the previous chapter?') && history.state !== null) {
			const dialog = getVideo(chapters[chapter - 1]);
			document.body.append(dialog);
			dialog.showModal();
		}
	} else if (chapter < chapters.length) {
		clearOld();
		const dialog = getVideo(chapters[chapter]);
		document.body.append(dialog);
		dialog.showModal();
	} else {
		triggerEnd();
	}
});

function findChapter(url = location) {
	if (url.hash.length > 2) {
		const id = url.hash.substring(1).toLowerCase();
		const chapter = chapters.findIndex(chap => chap.id === id);
		return Math.max(0, chapter);
	} else {
		return 0;
	}
}

function triggerEnd() {
	alert('All done...The combo to the chest will be "water".');
}

function updatePage(chapterData) {
	if (typeof chapterData !== 'object' || chapterData === null) {
		setChapter(0);
	} else if (typeof chapterData.q === 'string') {
		const question = getQuestion(chapterData);
		document.title = `${site.title} - Chapter ${chapterData.chapter + 1}`;
		clearOld();
		document.getElementById('questions').replaceChildren(question);
	} else {
		const dialog = getVideo(chapterData);
		clearOld();
		document.body.append(dialog);
		dialog.showModal();
		document.title = `${site.title} - Chapter ${chapterData.chapter + 1}`;
	}
}

function setChapter(chapter) {
	if (chapter >= chapters.length) {
		triggerEnd();
	} else if (Number.isSafeInteger(chapter) && chapter > -1) {
		const newChap = chapters[chapter];
		newChap.chapter = chapter;
		const url = new URL(location.href);
		url.hash = newChap.id;
		history.pushState(newChap, document.title, url.href);
		document.getElementById('instructions').open = chapter === 0;
		updatePage(newChap);
	} else {
		alert(`Invalid chapter: ${chapter}`);
	}
}

function clearOld() {
	const open = document.querySelector('dialog[open]');
	const q = document.querySelector('form.chapter-question');

	if (open instanceof HTMLDialogElement) {
		open.close();
	}

	if (q instanceof HTMLFormElement) {
		q.remove();
	}
}

function getVideo({ vid, width, height }) {
	const yt = createYouTubeEmbed(vid, { width, height });
	const tmp = document.getElementById('player-template').content.cloneNode(true);
	const dialog = tmp.querySelector('dialog');
	yt.classList.add('yt-player');
	dialog.append(yt);

	dialog.animate([
		{ transform: 'scale(0)', opacity: 0 },
		{ transform: 'none', opacity: 1 },
	], {
		duration: 500,
		easing: 'ease-out',
		fill: 'forwards',
		delay: 100,
	});

	return dialog;
}

function getQuestion({ id, q, opts, chapter }) {
	const form = html`<form ${EVENTS.onSubmit}="${submitHandler}" class="chapter-question">
		<fieldset class="no-border">
			<legend><b>Chapter ${chapter + 1}</b></legend>
			<div class="form-group">
				<label for="${id}-opts" class="input-label">${q}</label>
				<select name="answer" id="${id}-opts" class="input" required="">
					<option value="" label="Please select the answer given in the previous video"></option>
					${opts.map(opt => `<option>${opt}</option>`).join('')}
				</select>
			</div>
			<input type="hidden" name="id" value="${id}" readonly="" />
			<button type="submit" class="btn btn-primary">
				<svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
					<path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"/>
				</svg>
			</button>
		</fieldset>
	</form>`;

	return form;
}

globalThis.addEventListener('popstate', event => {
	if (event.state !== null) {
		updatePage(event.state);
	} else {
		const chapter = findChapter(location);
		setChapter(chapter);
	}
});

observeEvents();

if (location.hash.length > 2) {
	const chapter = findChapter(location);
	setChapter(chapter);
} else if (typeof history.state === 'object' && history.state !== null) {
	updatePage(history.state);
} else {
	setChapter(0);
}
