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

if ('BarcodeDetector' in globalThis) {
	const showPicker = registerCallback('show-picker', () => document.getElementById('scanned-img').showPicker());

	const scanQR = registerCallback('scan-qr', async ({ target }) => {
		if (target.files.length === 1) {
			const img = document.createElement('img');

			try {
				const scanner = new globalThis.BarcodeDetector({ formats: ['qr_code'] });
				img.src = URL.createObjectURL(target.files[0]);
				await img.decode();
				const decoded = await scanner.detect(img);

				if (decoded.length !== 0) {
					const url = URL.parse(decoded[0].rawValue);
					const chapter = findChapter(url);
					setChapter(chapter);

				}
			} catch(err) {
				console.error(err);
			} finally {
				URL.revokeObjectURL(img.src);
			}
		}
	});

	document.getElementById('footer').append(html`
		<button type="button" id="scan-btn" class="btn btn-link fixed" ${EVENTS.onClick}="${showPicker}" accesskey="q">
		<svg width="32" height="32" version="1.1" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
			<g transform="translate(.2)">
				<path d="m2.05 2.2802e-4s-0.51416-0.01772-1.0679 0.25926c-0.54932 0.27687-1.1821 1.0547-1.1821 1.9907v3.3749h2.25v-3.3749h3.375v-2.2499zm10.125 0v2.2499h3.375v3.3749h2.25v-3.3749c0-0.93601-0.63282-1.7138-1.1821-1.9907-0.55372-0.27681-1.0679-0.25926-1.0679-0.25926zm-9 3.3749v2.2499h2.25v-2.2499zm2.25 2.2499v2.2499h2.25v-2.2499zm3.375-2.2499v5.6249h5.625v-5.6249zm0 5.6249h-5.625v5.6249h5.625zm1.125-4.4999h3.375v3.3749h-3.375zm1.125 1.125v1.125h1.125v-1.125zm-6.75 4.4999h3.375v3.3749h-3.375zm5.625 0v3.3749h1.125v-1.125h1.125v-1.125h1.125v-1.125zm3.375 1.125v1.125h1.125v-1.125zm0 1.125h-1.125v1.125h1.125zm0 1.125v1.125h1.125v-1.125zm-1.125 0h-1.125v1.125h1.125zm-6.75-2.2499v1.125h1.125v-1.125zm-5.625 1.125v3.3749c0 0.93601 0.63282 1.7138 1.1821 1.9907 0.5537 0.27687 1.0679 0.25926 1.0679 0.25926h3.375v-2.25h-3.375v-3.3749zm15.75 0v3.3749h-3.375v2.25h3.375s0.51416 0.01772 1.0679-0.25926c0.54932-0.27687 1.1821-1.0547 1.1821-1.9907v-3.3749z" stroke-width="1.125"/>
			</g>
		</svg>
		<br />
		<span>Scan QR Code</span>
		</button>
		<input type="file" accept="image/*" capture="environmant" id="scanned-img" ${EVENTS.onChange}="${scanQR}" hidden="" />
	`);
}

observeEvents();

if (location.hash.length > 2) {
	const chapter = findChapter(location);
	setChapter(chapter);
} else if (typeof history.state === 'object' && history.state !== null) {
	updatePage(history.state);
} else {
	setChapter(0);
}

if ('popover' in HTMLElement.prototype) {
	const btn = document.getElementById('help-btn');
	btn.disabled = false;
	btn.hidden = false;
}
