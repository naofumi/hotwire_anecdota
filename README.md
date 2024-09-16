# TAILWIND RAILS

The objective of this project is to learn and document how to use Tailwind.
A large part of this is learning to use Stimulus effectively to control Tailwind classes.

1. Go through the components in Tailwind UI and implement them with HTML/ERB
2. For JavaScript, create Stimulus controllers that can be used with the Tailwind UI components.
3. Explore how we can use Turbo/Hotwire to further augment these components
4. Copy interactive websites and study further.

# Thoughts on Stimulus

## Stimulus generally controls presentation through CSS classes

Although Stimulus does not restrict how you should use JavaScript, 
you should generally refrain from modifying the DOM directly,
and you should try to control the display via CSS classes.

There are several things to consider.

1. With the traditional CSS approach, you might aim to flip a class on a parent element and control how the ancestor elements are displayed using the cascade.
2. Since Aria attributes will often also be flipped, you might want to use these to control this display. Indeed, you can use this approach to display loading state because Turbo will add `aria="busy"` to the `body` and `turbo-frame` elements automatically.
3. With a utility CSS approach like Tailwind, you are encouraged to directly add CSS classes to the elements whose display you want to control, without relying on the CSS cascade. Tailwind also allows you to use the traditional approach, but is generally discouraged.

### Recommendation

* When using the traditional CSS approach, flipping classes on the parent element is a good way to go. However, if you need to change the display of multiple elements within a parent, consider splitting up your controller. It may be doing too many things.
* With Tailwind, try to work with the utility classes directly – specify the utility classes with Stimulus `class` attributes and apply them to the `targets`. Tailwind provides `group` and `has` which help style elements that are not the `targets` themselves.

Note that Stimulus will require more thought for complex changes compared to React.
React allows you to do anything with both the DOM and CSS in response to state changes,
whereas Stimulus recommends leaning towards a CSS only approach.
Although the traditional CSS approach utlimately gives you more flexibility,
I find that Tailwind utility classes are generally sufficient,
as long as you ensure that your Stimulus controllers are only doing one thing (as in SRP). 

## Using small Stimulus controllers

We will use Stimulus controllers to flip CSS classes.
In general, your Stimulus controllers should be small and adhere to the Single-Responsibility Principle.
Therefore, if your Stimulus controller is managing the display state of multiple HTML elements,
they may be doing too much.

If this is the case,
using Stimulus controllers
to flip the state on parent elements to change the display of ancestors may be an SRP violation.
It may be a better idea to have separate Stimulus controllers and actions to handle each change individually,
so that each only changes the display of a single HTML element.

This approach will shift the onus of composing various behaviors onto the HTML elements themselves,
instead of composing inside the controller.
However, this is actually similar to how Tailwind works,
and may be preferred if used in combination with HTML components. 

## Hierarchy Patterns

Stimulus controllers can manage actions and targets that belong to the element on which the controller was defined.
Hence, the DOM hierarchy directly impacts the scope of Stimulus controllers.

This is similar to React – React components communicate between each other through props.
Therefore, to control two elements, you need to put state management and controls into a common ancestor.
In some cases, this can mean that you have to go pretty high-up in the tree.
If this is challenging to manage, then you can use global contexts like `useContext` or `useReducer`.

Likewise, when the actions and targets of Stimulus controllers are spread widely in the document,
then the most straightforward approach is to define the controller in a common ancestor.
Unlike React, you don't need prop-drilling to access elements deep in the hierarchy,
and so this solution is typically simpler.

On the other hand, Stimulus offers a few alternatives.

1. You can communicate between controllers either using custom events or by using Outlets.
2. You can directly change the `values` on a controller, which will automatically trigger a callback inside it.
3. If you do not need to go through a controller, you can directly change an element outside the hierarchy.

The abundance of options makes it hard to decide.

In the case of 1 and 2, you need to create a separate controller.
Typically, you will have a controller to trigger an event and a controller to respond to it.
You also have to define an agreement between these two controllers regarding how they identify themselves – i.e.,
how will the trigger controller identify the responder.
This means more moving parts and additional complexity.

The third option means that you are no longer using Stimulus.
For example, if you are using Stimulus to open a popup which is outside the triggering controller,
and that popup also needs a close button, then you can't put an action onto it.
You will need an additional controller for this.

Given the above limitations,
the recommendation is
to put the Stimulus controller in a common ancestor which encompasses the actions and the targets.
Note that a single DOM element can have an action or be a target of multiple Stimulus controllers,
and so Stimulus controllers can overlap each other comfortably.

Limiting the scope of a Stimulus controller certainly makes the code easier to read,
but when you need to expand the scope,
then it is often a better option than the alternatives (inter-controller communication).

If the controller has too many responsibilities, however, then inter-controller communication will be an option.
Don't use inter-controller communication just to avoid expanding the DOM scope,
but use it if it helps break up the responsibilities.

# ARIA and Accessibility

https://www.w3.org/WAI/ARIA/apg/patterns/
