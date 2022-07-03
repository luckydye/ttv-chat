// all components
const components = import.meta.globEager("./components/*");

// import all icons
import { SVGIcon } from "./components/Icon";

const icons = import.meta.globEager("../icons/*.svg", { as: "raw" });
for (let icon in icons) {
	const name = icon.split("/").reverse()[0].split(".")[0];
	SVGIcon.icons[name] = icons[icon];
}
