"use strict";
function html(strings, ...values) {
    let result = '';
    for (let i = 0; i < strings.length; i++) {
        result += strings[i];
        if (i < values.length) {
            result += values[i];
        }
    }
    return result;
}
class TravelEnglishUI {
    constructor(parent) {
        this.parent = parent;
        this.screens = {};
        this.stack = [];
    }
    static createElement(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.firstElementChild;
    }
    create(name, html, f) {
        const element = TravelEnglishUI.createElement(html);
        const screen = {
            name,
            element,
            onShow: null
        };
        f?.call(null, screen);
        this.screens[name] = screen;
    }
    show(name) {
        if (this.stack.length > 0) {
            this.stack[this.stack.length - 1].element.remove();
        }
        this.stack.push(this.screens[name]);
        this.parent.appendChild(this.screens[name].element);
        this.screens[name].onShow?.call(null);
    }
    goBack() {
        if (this.stack.length > 0) {
            this.stack.pop().element.remove();
        }
        if (this.stack.length > 0) {
            this.parent.appendChild(this.stack[this.stack.length - 1].element);
            this.stack[this.stack.length - 1].onShow?.call(null);
        }
    }
}
const appUI = new TravelEnglishUI(document.body);
appUI.create('phrase', html `
	<div class="travel-english">
		<div class="top">
			<div class="left"></div>
			<div class="center">
				<div class="title">旅游英语100句</div>
				<input class="search-bar hide">
			</div>
			<div class="right">搜索</div>
		</div>
		<div class="scroll maximized"></div>
	</div>
`, phraseScreen => {
    const phraseContainer = phraseScreen.element.querySelector('.scroll');
    const searchButton = phraseScreen.element.querySelector('.right');
    const searchBar = phraseScreen.element.querySelector('.search-bar');
    const centerArea = phraseScreen.element.querySelector('.center');
    const appTitle = phraseScreen.element.querySelector('.title');
    const input = phraseScreen.element.querySelector('input');
    const audio = new Audio();
    let highlightedElement = null;
    let items = null;
    audio.addEventListener('ended', () => {
        if (highlightedElement) {
            highlightedElement.classList.remove('clicked');
            highlightedElement = null;
        }
    });
    const appendPhrase = (english, chinese, audioBase64) => {
        const item = TravelEnglishUI.createElement(html `
			<div class="item">
				<div class="english">${english}</div>
				<div class="chinese">${chinese}</div>
				<div class="audio" style="display: none;">${audioBase64}</div>
			</div>
		`);
        item.addEventListener('click', () => {
            if (highlightedElement) {
                highlightedElement.classList.remove('clicked');
            }
            highlightedElement = item;
            item.classList.add('clicked');
            audio.src = item.querySelector('.audio').innerText;
            audio.play();
        });
        phraseContainer.appendChild(item);
    };
    const loadPhrases = async () => {
        try {
            const lines = (await (await fetch('./phrases/1.txt')).text()).split('\n');
            for (let i = 0; i < lines.length; i += 4) {
                appendPhrase(lines[i], lines[i + 1], lines[i + 2]);
            }
        }
        catch (err) {
            appendPhrase(`${err}`, '软件错误', '');
        }
    };
    searchButton.addEventListener('click', () => {
        searchBar.classList.toggle('hide');
        appTitle.classList.toggle('hide');
        centerArea.classList.toggle('fill');
        if (searchButton.innerText === '搜索') {
            searchButton.innerText = '关闭';
            input.focus();
        }
        else {
            searchButton.innerText = '搜索';
            input.value = '';
            if (items) {
                for (const item of items) {
                    item.classList.remove('hide');
                }
            }
        }
    });
    input.addEventListener('input', () => {
        if (!items) {
            items = [...phraseContainer.querySelectorAll('.item')];
        }
        const value = input.value.trim();
        for (const item of items) {
            const english = item.querySelector('.english');
            const chinese = item.querySelector('.chinese');
            if (english.innerText.toLowerCase().includes(value.toLowerCase()) || chinese.innerText.includes(value)) {
                item.classList.remove('hide');
            }
            else {
                item.classList.add('hide');
            }
        }
    });
    loadPhrases();
});
appUI.show('phrase');
