class ProgressBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.barBody = null;
        this.line = null;
        this.number = null;
        this.defineAttributes();

        this.shadowRoot.innerHTML = `
            <style>
                #bar {
                    width: 20px;
                    height: 600px;
                    background-color: #222;
                    display: flex;
                    align-items: flex-end;
                    padding: 5px;
                }

                #bar-body {
                    height: 0;
                    width: 20px;
                    background-color: #888;
                }

                #line {
                    width: 80px;
                    height: 1px;
                    background-color: white;
                    position: absolute;
                    z-index: 100;
                }

                #number {
                    width: 80px;
                    position: absolute;
                    z-index: 100;
                    color: white;
                    margin-left: 40px;
                    font-size: 24px;
                }
            </style>
            <div id="bar">
                <div id="bar-body"></div>
                <div id="line"></div>
                <div id="number">0%</div>
            </div>
        `;
    }

    defineAttributes() {
        this.PERCENT_ATTRIBUTE = 'percent';
        this.BG_COLOR_ATTRIBUTE = 'bg-color';
        this.BAR_COLOR_ATTRIBUTE = 'bar-color';
        this.TEXT_COLOR_ATTRIBUTE = 'text-color';
    }

    connectedCallback() {
        this.barBody = this.shadowRoot.querySelector('#bar-body');
        this.line = this.shadowRoot.querySelector('#line');
        this.number = this.shadowRoot.querySelector('#number');
        this.setupEventListeners();
    }

    render(i) {
        const max = this.clientHeight - 10;
        const step = (max / 100) * 0.5;
        const per = (max / 100) * i;

        if (i >= 0) {
            let currentHeight = 0;
            const intervalDuration = 10;

            const interval = setInterval(() => {
                if (currentHeight >= per && currentHeight !== 0) {
                    clearInterval(interval);
                    return;
                }

                currentHeight += step;
                this.barBody.style.height = currentHeight + 'px';
                this.line.style.marginBottom = currentHeight - 1 + 'px';
                this.number.style.marginBottom = currentHeight - 4 + 'px';
                this.number.innerText = i > 0 ? Math.round((currentHeight / max) * 100) + '%' : '0%';
            }, intervalDuration);
        }
    }

    setupEventListeners() {
        const mutationObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === this.PERCENT_ATTRIBUTE) {
                    const newValue = parseInt(mutation.target.getAttribute(this.PERCENT_ATTRIBUTE)) || 0;
                    this.render(newValue);
                }
            }
        });
        mutationObserver.observe(this, { attributes: true, attributeFilter: [this.PERCENT_ATTRIBUTE] });
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === this.PERCENT_ATTRIBUTE && oldValue !== newValue) {
            const newPercent = parseInt(newValue) || 0;
            this.render(newPercent);
        }
        if (name === this.BAR_COLOR_ATTRIBUTE && oldValue !== newValue) {
            this.shadowRoot.querySelector('#bar-body').style.backgroundColor = newValue;
        }
        if (name === this.BG_COLOR_ATTRIBUTE && oldValue !== newValue) {
            this.shadowRoot.querySelector('#bar').style.backgroundColor = newValue;
        }
        if (name === this.TEXT_COLOR_ATTRIBUTE && oldValue !== newValue) {
            this.shadowRoot.querySelector('#number').style.color = newValue;
            this.shadowRoot.querySelector('#line').style.backgroundColor = newValue;
        }
    }

    static get observedAttributes() {
        return ['percent', 'bg-color', 'bar-color', 'text-color'];
    }
}

customElements.define('progress-bar', ProgressBar);
