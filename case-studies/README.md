# Case studies

Every case study uses the same page design (`case-study.html`). You only write the content.

## Add a new case study
1. Duplicate the `_example` folder and rename it, e.g. `plant-app` (lowercase, dashes, no spaces).
2. Drop your images and videos into that folder.
3. Open `plant-app/content.js` and replace the text and image names.
4. Open `case-study.html?p=plant-app` in your browser to view it.
5. Link to it from a card on the home page: `<a class="card" href="case-study.html?p=plant-app">`

## Edit content
- **Sections:** add, remove or reorder items in `sections`. The side list updates on its own.
- **Blocks** go inside a section:
  - Text: `{ title: "Reason 1", text: "…" }` (both parts are optional)
  - Image: `{ image: "flow.png", alt: "What it shows", caption: "…" }`
  - Images side by side: `{ images: [{ src: "a.png", alt: "" }, { src: "b.png", alt: "" }], caption: "…" }`
  - Video: `{ image: "demo.mp4", alt: "…" }`
- **Text formatting:** a blank line starts a new paragraph, `- ` makes a bullet, `1. ` makes a numbered list. You can also use `**bold**`, `*italic*` and `[link](https://…)`.
- **Placeholders:** set an image to `""` to show a grey box while you're drafting.

## Change the design
Change `css/case-study.css` (layout and type) or `js/case-study.js` (structure). Every case study updates at once.
