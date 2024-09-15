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

