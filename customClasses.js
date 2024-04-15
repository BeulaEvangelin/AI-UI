class TextBox {
    constructor(app, x, y, width, height) {
        this.input = document.createElement("input");
        this.input.type = "text";
        this.input.style.position = "absolute";
        this.input.style.left = x + "px";
        this.input.style.top = y + "px";
        this.input.style.width = width + "px";
        this.input.style.height = height + "px";
        document.getElementById("app").appendChild(this.input);
    }

    getText() {
        return this.input.value;
    }

    setText(text) {
        this.input.value = text;
    }
}

class CopyButton {
    constructor(app, x, y, textBox) {
        this.button = document.createElement("button");
        this.button.innerHTML = "Copy";
        this.button.style.position = "absolute";
        this.button.style.left = x + "px";
        this.button.style.top = y + "px";
        this.button.addEventListener("click", () => this.copyText(textBox));
        document.getElementById("app").appendChild(this.button);
    }

    copyText(textBox) {
        textBox.input.select();
        document.execCommand("copy");
    }
}

class SliderBox {
    constructor(app, x, y, min, max, initialValue, onChange) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.min = min;
        this.max = max;
        this.value = initialValue;
        this.onChange = onChange;


        this.slider = new PIXI.Graphics();
        this.slider.beginFill(0x000000);
        this.slider.drawRect(0, 0, 200, 10);
        this.slider.endFill();
        this.slider.x = this.x;
        this.slider.y = this.y;
        this.slider.interactive = true;
        this.slider.buttonMode = true;
        this.slider.on("pointerdown", this.onSliderDown.bind(this));
        this.app.stage.addChild(this.slider);

        // Draw slider handle
        this.sliderHandle = new PIXI.Graphics();
        this.sliderHandle.beginFill(0xffffff);
        this.sliderHandle.drawRect(0, 0, 20, 20);
        this.sliderHandle.endFill();
        this.sliderHandle.x =
            this.x + ((this.value - this.min) / (this.max - this.min)) * 200;
        this.sliderHandle.y = this.y - 5;
        this.sliderHandle.interactive = true;
        this.sliderHandle.buttonMode = true;
        this.sliderHandle.on("pointerdown", this.onHandleDown.bind(this));
        this.app.stage.addChild(this.sliderHandle);
    }

    onSliderDown(event) {
        this.setValueFromEvent(event);
    }

    onHandleDown(event) {
        this.handleDragging = true;
        this.app.stage.on("pointermove", this.onHandleMove, this);
        this.app.stage.on("pointerup", this.onHandleUp, this);
    }

    onHandleMove(event) {
        if (this.handleDragging) {
            this.setValueFromEvent(event);
        }
    }

    onHandleUp() {
        this.handleDragging = false;
        this.app.stage.off("pointermove", this.onHandleMove, this);
        this.app.stage.off("pointerup", this.onHandleUp, this);
    }

    setValueFromEvent(event) {
        let localPos = this.slider.toLocal(event.data.global);
        let newValue = ((localPos.x - this.x) / 200) * (this.max - this.min) + this.min;
        newValue = Math.max(this.min, Math.min(this.max, newValue));
        this.value = newValue;
        this.sliderHandle.x = this.x + ((this.value - this.min) / (this.max - this.min)) * 200;
    
        let dummyText;
        if (newValue <= 20) {
            dummyText = "cute"; 
        } else if (newValue <= 40) {
            dummyText = "very cute"; 
        } else if (newValue <= 60) {
            dummyText = "most cute"; 
        } else if (newValue <= 80) {
            dummyText = "extremely cute"; 
        } else {
            dummyText = "painfully cute"; 
        }
        this.onChange.setText(dummyText); 
    }
    
}


export { TextBox, CopyButton, SliderBox };
