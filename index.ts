import { createContext, useContext, type ParentProps, type JSX, type Component } from 'solid-js';
import h from 'solid-js/h';

export const MDXContext = createContext({});

export function useMDXComponents(components: MDXProviderProps['components']) {
  const contextComponents = useContext(MDXContext);

  // Custom merge via a function prop
  if (typeof components === 'function') {
    return components(contextComponents);
  }

  return { ...contextComponents, ...components };
}
export function withMDXComponents(Comp: Component) {
  function boundMDXComponent(props: MDXProviderProps) {
    const allComponents = useMDXComponents(props.components);

    return h(Comp, { ...props, allComponents });
  }
  return boundMDXComponent;
}

interface Components {
  [k: string]: (props: ParentProps) => JSX.Element;
}
interface MDXProviderProps extends Component {
  children: JSX.Element;
  components: Components | ((props: ParentProps) => Components);
  disableParentContext?: boolean;
}
const emptyObject = {};

export function MDXProvider({ components, children, disableParentContext }: MDXProviderProps) {
  let allComponents;

  if (disableParentContext) {
    allComponents = typeof components === 'function' ? components({}) : components || emptyObject;
  } else {
    allComponents = useMDXComponents(components);
  }

  return h(MDXContext.Provider, { value: allComponents, children: children });
}
