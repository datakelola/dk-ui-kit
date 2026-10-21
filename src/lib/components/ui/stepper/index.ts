import Description from "./stepper-description.svelte";
import Indicator from "./stepper-indicator.svelte";
import Item from "./stepper-item.svelte";
import Separator from "./stepper-separator.svelte";
import Title from "./stepper-title.svelte";
import Root from "./stepper.svelte";

export {
	Root,
	Item,
	Indicator,
	Title,
	Description,
	Separator,
	//
	Root as Stepper,
	Item as StepperItem,
	Indicator as StepperIndicator,
	Title as StepperTitle,
	Description as StepperDescription,
	Separator as StepperSeparator,
};

export { stepperVariants, type StepperVariant } from "./stepper.svelte";
