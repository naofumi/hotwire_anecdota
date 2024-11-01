# TAILWIND RAILS

The goal of this project is to study and document how to effectively use Hotwire in combination with Tailwind. I hope it will become a catalog of well-thought-out patterns.

## React

As a reference, we also provide some examples written in React. This allows us to more clearly analyzed the cases where React may seem simpler than Hotwire. React is set up using the following command and is embedded into regular MPA pages.

```shell
yarn add react react-dom react-router-dom
```

We also configured tailwind to read `jsx` files.

## Thoughts on Stimulus

It is tempting to come up with best practices for Stimulus controllers and, in particular, consider how we can maximize reusability.
However, my experience is that reusing Stimulus controllers is actually quite challenging. 
You tend to create controllers that have far too many parameters, either in the form of targets, values, and classes, and this does not justify the relatively scare opportunities to reuse them inside your application. Using generic controllers is also mind-twisting and requires a good understanding of what you need to achieve. Another point is that Stimulus controllers typically don't do much. I find that it is often easier to just write custom controllers.

At this point, my preference is to just write application-specific controllers without thinking much about reuse.
These are easier to understand. 

Having said that, I think there are significant patterns in how we write Stimulus controllers.

The basic role of a Stimulus controller is straightforward and expressed very clearly by the name "controller."

A Stimulus controller's role is to accept events
(either life-cycle events, user events, or changes to the `value` attributes),
process these, possibly with the help of other objects or server endpoints, and write out the results to the screen. The nomenclature around various inputs and outputs should reflect this.

1. `Values` are state. They can be set on the server through `data-*-value` attributes and managed from inside the controller. Changes to `values` can trigger `*Changed` methods, to initiate synchronization of state with the DOM.
2. `Actions` are where events come into the system. `Params` can be used to provide additional context about these events.
3. `Targets` are how the results of these events are transmitted to the DOM.
4. `Outlets` are used to send messages to other controllers. Like `Targets`, their purpose is to send the results of events outwards to the DOM.

`Values`, `Actions` ---> Internal processing ---> `Targets`, `Outlets`

Occasionally, a controller the `values` and `actions` may not provide sufficient context for processing.
In these cases, `targets` may be used for context.

If your controller is complex, then you might want to use the `values` as a hub.

`Values`, `Actions` ---> update `Values` ---> sync `Targets`, `Outlets`

As a convention, it may be a good idea to name each method that syncs a `target` as `#render*Target()` so that there is a clear relationship with the target and the method used to sync it.
You may want to bundle the syncing of multiple `targets` and `outlets` in a `#render()` method that is called whenever a `value` changes. This may cause unnecessary syncing, but it will simplify the code.  




Note that unlike React, Stimulus does not have bindings that automatically synchronize `value` state with the DOM.
Therefore, if the state can be managed in the DOM (as form inputs, etc.), then this is preferred. This eliminates the requirement to synchronize state in the controller since form inputs automatically do this.

### Outlet use-cases

Stimulus controllers only control elements which are contained within the element that the controller itself was defined in. That is to say, Stimulus controllers only manage their children elements.
However, sometimes we may want to trigger a Stimulus controller from an element that is far away. Instead of expanding the scope of the controller (shift up), you can create a new Stimulus controller only concerned with remote-calling the original via an outlet.

## ARIA and Accessibility

https://www.w3.org/WAI/ARIA/apg/patterns/
https://www.accessibility-developer-guide.com/examples/widgets/
