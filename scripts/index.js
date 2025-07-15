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
			<div class="center">旅游英语100句</div>
			<div class="right">搜索</div>
		</div>
		<div class="scroll maximized"></div>

	</div>
`, phraseScreen => {
    const phraseContainer = phraseScreen.element.querySelector('.scroll');
    const searchButton = phraseScreen.element.querySelector('.right');
    const audio = new Audio();
    const removeHighLightFromAllItems = () => {
        const items = phraseContainer.querySelectorAll('.item.clicked');
        for (const item of items) {
            item.classList.remove('clicked');
        }
    };
    audio.addEventListener('ended', () => removeHighLightFromAllItems());
    const appendPhrase = (phrase) => {
        const item = TravelEnglishUI.createElement(html `
			<div class="item">
				<div class="english">${phrase.english}</div>
				<div class="chinese">${phrase.chinese}</div>
			</div>
		`);
        item.addEventListener('click', () => {
            removeHighLightFromAllItems();
            item.classList.add('clicked');
            audio.src = `${phrase.audio}`;
            audio.play();
        });
        phraseContainer.appendChild(item);
    };
    const loadPhrases = async () => {
        try {
            const lines = (await (await fetch('./phrases/1.txt')).text()).split('\n');
            for (let i = 0; i < lines.length; i += 4) {
                appendPhrase({
                    english: lines[i],
                    chinese: lines[i + 1],
                    audio: lines[i + 2]
                });
            }
        }
        catch (err) {
            appendPhrase({
                english: `Error: ${err}`,
                chinese: '软件错误',
                audio: ''
            });
        }
    };
    // searchButton.addEventListener('click', () => {
    // 	phraseContainer.focus()
    // })
    loadPhrases();
});
appUI.show('phrase');
