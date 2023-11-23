class SketchPad {
  constructor(container, size = 400) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = size;
    this.canvas.height = size;
    this.canvas.style = `
      background-color: white;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    `;

    container.appendChild(this.canvas);

    // add line break
    const br = document.createElement("br");
    container.appendChild(br);

    // add undo button
    this.undo = document.createElement("button");
    this.undo.innerHTML = "Undo";
    container.appendChild(this.undo);

    this.ctx = this.canvas.getContext("2d");

    this.reset();

    this.#addEventListeners();
  }

  reset () {
    this.paths = [];
    this.isDrawing = false;
    this.#redraw();
  }

  #addEventListeners() {
    this.canvas.onmousedown = (e) => {
      const mouse = this.#getMouse(e);
      this.paths.push([mouse]);
      this.isDrawing = true;
    };

    this.canvas.onmousemove = (e) => {
      if (this.isDrawing) {
        const mouse = this.#getMouse(e);
        const lastPath = this.paths[this.paths.length - 1];

        lastPath.push(mouse);

        this.#redraw();
      }
    };

    document.onmouseup = () => {
      this.isDrawing = false;
    };

    this.canvas.ontouchstart = (e) => {
      const loc=e.touches[0];
      this.canvas.onmousedown(loc);
    }

    this.canvas.ontouchmove = (e) => {
      const loc=e.touches[0];
      this.canvas.onmousemove(loc);
    }

    document.ontouchend = (e) => {
      const loc=e.touches[0];
      document.onmouseup(loc);
    }

    this.undo.onclick = () => {
      this.paths.pop();
      this.#redraw();
    }
  }

  #redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    draw.paths(this.ctx, this.paths)

    if (this.paths.length > 0) {
      this.undo.disabled = false;
    } else {
      this.undo.disabled = true;
    }
  }

  #getMouse=(e) => {
    const rect = this.canvas.getBoundingClientRect();
    return [
      Math.round(e.clientX - rect.left),
      Math.round(e.clientY - rect.top),
    ];
  }
}
