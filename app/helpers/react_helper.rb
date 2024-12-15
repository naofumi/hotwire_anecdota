module ReactHelper
  # Create a React component that has been previously registered
  # in `application_react.js`.
  def react_component(name, props = {}, id: "root")
    tag.div id:, data: { react_component: name, props: }
  end
end
