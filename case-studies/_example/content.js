/* =========================================================
   CASE STUDY CONTENT
   Duplicate this whole folder, rename it (e.g. "plant-app"), put your
   images inside it, and edit the text below.
   It then opens at:  case-study.html?p=plant-app

   Text tips:
   - Blank line = new paragraph
   - Lines starting with "- " become a bulleted list ("1. " for numbered)
   - **bold**, *italic*, [link text](https://…)
   - Image paths are relative to this folder: "hero.png"
   - Leave an image as "" to show a grey placeholder while drafting
   - Add, remove or reorder sections freely — the side list updates itself
   ========================================================= */

caseStudy({
  title: "Project 1",
  description: "Description of the project.",

  // Big image at the top (main_solution_display). "" = green placeholder.
  hero: { image: "", alt: "" },

  // Timeline / Status / Team row — add or remove items as you like
  meta: [
    { label: "Timeline", value: "Description of the project." },
    { label: "Status",   value: "Description of the project." },
    { label: "Team",     value: "Description of the project." }
  ],

  // Image under the overview (img_intro). Delete this line to hide it.
  intro: { image: "", alt: "" },

  sections: [
    {
      nav: "The problem",            // label in the side list
      heading: "The problem",        // heading on the page (defaults to nav)
      blocks: [
        { title: "What is the issue?", text: "Description of why this is the issue." }
      ]
    },
    {
      nav: "Why does it matter",
      heading: "Why does it matter?",
      blocks: [
        { title: "Reason 1", text: "Description of reason 1" },
        { title: "Reason 2", text: "Description of reason 2" },
        { title: "Reason 3", text: "Description of reason 3" }
      ]
    },
    {
      nav: "Solution",
      accent: "bright",              // brighter green divider, as in Figma
      blocks: [
        { image: "", alt: "", caption: "Description of the image" }
        // Side-by-side images:
        // { images: [{ src: "a.png", alt: "" }, { src: "b.png", alt: "" }], caption: "…" }
        // Videos work too: { image: "demo.mp4", alt: "Demo of the flow" }
      ]
    },
    {
      nav: "Research",
      heading: "The research",
      blocks: [
        { title: "What we did", text: "Description of reason 1" },
        { title: "Synthesis", text: "Description of reason 2" },
        { title: "Design Requirements", text: "Description of reason 3" }
      ]
    },
    {
      nav: "Conclusion",
      heading: "Conclusion and Next Steps",
      blocks: [
        { title: "Conclusion", text: "Description of conclusion" },
        { title: "Next Steps", text: "Description of next steps" }
      ]
    }
  ]
});
