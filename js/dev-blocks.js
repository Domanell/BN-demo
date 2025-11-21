// Highlight active nav icon on scroll
function updateActiveNavigation() {
	const icons = Array.from(document.querySelectorAll('.c-block-bar__icon'));
	// Dynamically get groupIds from hrefs of nav links
	const groupIds = icons
		.map((icon) => {
			const href = icon.getAttribute('href');
			return href && href.startsWith('#') ? href.slice(1) : null;
		})
		.filter(Boolean);
	function updateActiveIcon() {
		const scroll = window.scrollY;
		let found = false;
		for (let i = groupIds.length - 1; i >= 0; i--) {
			const g = document.getElementById(groupIds[i]);
			if (g && scroll + 60 >= g.offsetTop) {
				icons.forEach((ic) => ic.classList.remove('active'));
				icons[i].classList.add('active');
				found = true;
				break;
			}
		}
		if (!found) icons.forEach((ic) => ic.classList.remove('active'));
	}
	// Update on load and on hashchange (in case of anchor navigation)
	updateActiveIcon();

	return updateActiveIcon;
}

const mediaVideoUrl = 'video/homepage-hero.mp4';
const mediaImageUrl = 'https://s3-us-west-2.amazonaws.com/www.bookingninjas.com/img/features-hero.jpg';

// Configurator functionality
let configuratorEnabled = false;
let previewEnabled = false;
let selectedBlocks = [];

// Update configurator display
function updateConfiguratorList() {
	const list = document.getElementById('configuratorList');
	const buttons = document.querySelectorAll('#copyAllBlocks, #previewBtn, #downloadBlocks');

	const isEmpty = selectedBlocks.length === 0;
	buttons.forEach((btn) => (btn.disabled = isEmpty));

	if (isEmpty) {
		list.innerHTML = '<div class="c-configurator__empty">No blocks added yet.</div>';
	} else {
		list.innerHTML = selectedBlocks
			.map(
				(block, index) =>
					`<div class="c-configurator__item" data-block-title="${block.title}" data-index="${index}" draggable="true" onclick="scrollToBlock('${block.title}')">
									<i class="c-configurator__drag-handle fas fa-grip-vertical" onclick="event.stopPropagation()"></i>
									<p>${block.title}</p>
									<button class="c-configurator__item-copy" onclick="event.stopPropagation(); copyBlockCode(${index})" title="Copy block code"><i class="fas fa-copy"></i></button>
									<button class="c-configurator__item-remove" onclick="event.stopPropagation(); removeBlock(${index})"><i class="fas fa-times"></i></button>
								</div>`
			)
			.join('');
		initializeDragAndDrop();
	}

	if (previewEnabled) updateMainPreview();
}

// Add/Remove blocks
function addBlock(title, content) {
	selectedBlocks.push({ title, content });
	updateConfiguratorList();
}

window.removeBlock = function (index) {
	selectedBlocks.splice(index, 1);
	updateConfiguratorList();
};

window.copyBlockCode = function (index) {
	const block = selectedBlocks[index];
	if (!block) return;

	navigator.clipboard
		.writeText(block.content)
		.then(() => {
			// Find the copy button and show feedback
			const items = document.querySelectorAll('.c-configurator__item');
			const targetItem = items[index];
			const copyBtn = targetItem?.querySelector('.c-configurator__item-copy i');

			if (copyBtn) {
				const originalClass = copyBtn.className;
				copyBtn.className = 'fas fa-check';
				copyBtn.style.color = '#28a745';

				setTimeout(() => {
					copyBtn.className = originalClass;
					copyBtn.style.color = '';
				}, 2000);
			}
		})
		.catch((err) => {
			console.error('Failed to copy block code:', err);
		});
};

// Initialize drag and drop functionality
function initializeDragAndDrop() {
	const items = document.querySelectorAll('.c-configurator__item');

	items.forEach((item) => {
		item.addEventListener('dragstart', handleDragStart);
		item.addEventListener('dragover', handleDragOver);
		item.addEventListener('drop', handleDrop);
		item.addEventListener('dragend', handleDragEnd);
		item.addEventListener('dragenter', handleDragEnter);
		item.addEventListener('dragleave', handleDragLeave);
	});
}

let draggedElement = null;

function handleDragStart(e) {
	draggedElement = this;
	this.classList.add('dragging');
	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/html', this.outerHTML);
}

function handleDragOver(e) {
	if (e.preventDefault) {
		e.preventDefault();
	}
	e.dataTransfer.dropEffect = 'move';
	return false;
}

function handleDragEnter(e) {
	if (this !== draggedElement) {
		this.classList.add('drag-over');
	}
}

function handleDragLeave(e) {
	this.classList.remove('drag-over');
}

function handleDrop(e) {
	if (e.stopPropagation) {
		e.stopPropagation();
	}

	if (draggedElement !== this) {
		const draggedIndex = parseInt(draggedElement.dataset.index);
		const targetIndex = parseInt(this.dataset.index);

		// Reorder the selectedBlocks array
		const [draggedBlock] = selectedBlocks.splice(draggedIndex, 1);
		selectedBlocks.splice(targetIndex, 0, draggedBlock);

		updateConfiguratorList();
	}

	return false;
}

function handleDragEnd(e) {
	const items = document.querySelectorAll('.c-configurator__item');
	items.forEach((item) => {
		item.classList.remove('dragging', 'drag-over');
	});
	draggedElement = null;
}

window.scrollToBlock = function (blockTitle) {
	const trimmedTitle = blockTitle.trim();
	let target;

	if (previewEnabled) {
		const previewContent = document.getElementById('cPreviewContent');
		if (!previewContent) return;

		const blockIndex = selectedBlocks.findIndex((block) => block.title.trim() === trimmedTitle);

		target = blockIndex !== -1 ? previewContent.children[blockIndex] : null;
	} else {
		target = Array.from(document.querySelectorAll('.c-block-section')).find(
			(section) => section.querySelector('.c-category-header h2')?.textContent.trim() === trimmedTitle
		);
	}

	if (target) {
		target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		target.style.backgroundColor = 'rgba(62, 99, 245, 0.1)';
		setTimeout(() => (target.style.backgroundColor = ''), 2000);
	}
};

// Toggle preview mode
function togglePreview() {
	previewEnabled = !previewEnabled;
	const cList = document.querySelector('.c-list');
	const cPreview = document.getElementById('cPreview');
	const previewBtn = document.getElementById('previewBtn');
	cList.style.display = previewEnabled ? 'none' : 'block';
	cPreview.style.display = previewEnabled ? 'block' : 'none';
	previewBtn.textContent = previewEnabled ? 'Back to Blocks' : 'Preview';

	if (previewEnabled) {
		updateMainPreview();
	}
}

// Update preview content
function updateMainPreview() {
	if (!previewEnabled) return;
	const previewContent = document.getElementById('cPreviewContent');
	if (selectedBlocks.length === 0) {
		previewContent.innerHTML = '<div class="c-preview__empty">No blocks selected for preview</div>';
	} else {
		previewContent.innerHTML = selectedBlocks
			.map((block, index) => `<div id="preview-block-${block.id}" class="c-preview-block">${block.content}</div>`)
			.join('');
	}
}

// Toggle configurator
function toggleConfigurator(event) {
	const toggle = document.getElementById('configuratorToggle');
	const configurator = document.getElementById('configurator');
	const copyButtons = document.querySelectorAll('.copy-button');

	configuratorEnabled = !configuratorEnabled;
	configuratorToggle.checked = configuratorEnabled;
	configurator.classList.toggle('active', configuratorEnabled);

	// Change copy buttons text and functionality
	copyButtons.forEach((btn) => {
		if (configuratorEnabled) {
			btn.textContent = 'Add';
		} else {
			btn.textContent = 'Copy';
		}
	});
}

function copyAllBlocks() {
	if (selectedBlocks.length === 0) return;
	const allContent = selectedBlocks.map((block) => block.content).join('\n\n');
	navigator.clipboard.writeText(allContent).then(() => {
		const btn = document.getElementById('copyAllBlocks');
		const originalText = btn.textContent;
		btn.textContent = 'Copied!';
		setTimeout(() => (btn.textContent = originalText), 2000);
	});
}

function downloadBlocks() {
	if (selectedBlocks.length === 0) return;

	const allContent = selectedBlocks.map((block) => block.content).join('\n\n');
	const fileName = 'blocks-' + new Date().toISOString().slice(0, 19).replace(/:/g, '-') + '.txt';

	const blob = new Blob([allContent], { type: 'text/plain' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);

	const btn = document.getElementById('downloadBlocks');
	const originalText = btn.textContent;
	btn.textContent = 'Downloaded!';
	setTimeout(() => (btn.textContent = originalText), 2000);
}

// Initialize configurator
document.addEventListener('DOMContentLoaded', function () {
	// Configurator close button
	document.querySelector('.c-configurator__close').addEventListener('click', toggleConfigurator);
	// Copy all blocks button
	document.getElementById('copyAllBlocks').addEventListener('click', copyAllBlocks);
	// Download blocks button
	document.getElementById('downloadBlocks').addEventListener('click', downloadBlocks);
	// Preview button
	document.getElementById('previewBtn').addEventListener('click', togglePreview);

	// Controls
	document.querySelectorAll('.copy-button').forEach((button) => {
		button.addEventListener('click', () => {
			const blockSection = button.closest('.c-block-section');
			const blockContent = blockSection.querySelector('.c-block-content').innerHTML;

			if (configuratorEnabled) {
				// Add to configurator
				const blockTitle = blockSection.querySelector('.c-category-header h2').textContent;
				addBlock(blockTitle, blockContent);
				button.textContent = 'Added!';
				setTimeout(() => {
					button.textContent = 'Add';
				}, 1000);
			} else {
				// Copy to clipboard
				navigator.clipboard.writeText(blockContent).then(() => {
					button.textContent = 'Copied!';
					setTimeout(() => {
						button.textContent = 'Copy';
					}, 1000);
				});
			}
		});
	});

	document.querySelectorAll('.tabs__item button').forEach((tab) => {
		tab.addEventListener('click', () => {
			const block = tab.closest('.c-block-section').querySelector('.c-block-content');
			handleControls(block, tab.dataset);
		});
	});

	// Nav
	const navigationHandler = updateActiveNavigation();
	window.addEventListener('scroll', navigationHandler);
	window.addEventListener('hashchange', navigationHandler);
});

function blockMode(block, selector, modClass) {
	const additionalClass = block.closest('.c-block-section').querySelector('.c-controls')?.dataset.additionalClass;
	const className = `${modClass}${additionalClass ? ` ${additionalClass}` : ''}`;
	let elements = [];
	if (typeof selector === 'string') {
		elements = block.querySelectorAll(`${selector}`);
	} else if (selector instanceof Element) {
		elements = [selector];
	} else if (selector instanceof NodeList || selector instanceof HTMLCollection) {
		elements = Array.from(selector);
	} else if (Array.isArray(selector)) {
		elements = selector;
	}

	elements.forEach((target) => {
		target.className = className;
	});
}

function changeMedia(block, selector, mediaClass, mediaType) {
	const target = block.querySelector(`${selector}`);
	if (mediaType === 'video') {
		target.innerHTML = `<video src="${mediaVideoUrl}" ${mediaClass ? `class="${mediaClass}"` : ''} autoplay loop muted playsinline></video>`;
	} else if (mediaType === 'image') {
		target.innerHTML = `<img src="${mediaImageUrl}" alt="" ${mediaClass ? `class="${mediaClass}"` : ''}/>`;
	}
}

function addMedia(block, selector, mediaWrapClass, mediaClass, mediaType) {
	// Remove existing media wrapper if present
	const mediaWrapperClass = `.${mediaWrapClass}`;
	block.querySelector(mediaWrapperClass)?.remove();
	const mediaWrapper = document.createElement('div');
	mediaWrapper.className = mediaWrapClass;
	block.querySelector(`${selector}`).insertBefore(mediaWrapper, block.querySelector(`${selector}`).firstChild);
	changeMedia(block, mediaWrapperClass, null, mediaType);
}

function removeMedia(block, mediaWrapClass) {
	if (!mediaWrapClass) return;
	const mediaWrapperClass = `.${mediaWrapClass}`;
	block.querySelector(mediaWrapperClass)?.remove();
}

function replicateChildElement(block, parentSelector, copies = 1) {
	const parent = block.querySelector(parentSelector);
	const children = parent.children;

	while (children.length != copies) {
		if (children.length < copies) {
			parent.appendChild(children[0].cloneNode(true));
		} else {
			parent.removeChild(children[children.length - 1]);
		}
	}
}

function replaceClass(block, oldClass, newClass) {
	const elements = block.querySelectorAll(`.${oldClass}`);
	elements.forEach((el) => {
		el.classList.remove(oldClass);
		el.classList.add(newClass);
	});
}

function handleControls(block, data) {
	const { action, selector, mediaClass, modClass, mediaWrapClass, col } = data;
	const controls = block.closest('.c-block-section').querySelector('.c-controls');

	switch (action) {
		case 'media-video':
			changeMedia(block, selector, mediaClass, 'video');
			break;
		case 'media-image':
			changeMedia(block, selector, mediaClass, 'image');
			break;
		case 'block-mod':
			blockMode(block, selector, modClass);
			break;
		case 'block-mod-media':
			blockMode(block, selector, modClass);
			removeMedia(block, mediaWrapClass);
			break;
		case 'block-mod-media-video':
			blockMode(block, selector, modClass);
			addMedia(block, selector, mediaWrapClass, mediaClass, 'video');
			break;
		case 'block-mod-media-image':
			blockMode(block, selector, modClass);
			addMedia(block, selector, mediaWrapClass, mediaClass, 'image');
			break;
		case 'columns':
			replicateChildElement(block, selector, col);
			const columns = block.querySelector(selector).children;
			blockMode(block, columns, modClass);
			break;
		case 'block-mod-additional':
			const oldClass = controls.dataset.additionalClass;
			if (oldClass) replaceClass(block, oldClass, modClass);
			controls.setAttribute('data-additional-class', modClass);
			break;
		default:
			alert('Unknown action');
			break;
	}
}
