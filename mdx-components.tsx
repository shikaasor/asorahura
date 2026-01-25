// MDX Components configuration
// This file will be used once @mdx-js packages are installed
// For now, keeping a placeholder to prevent type errors

type MDXComponents = Record<string, React.ComponentType<any>>

export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    ...components,
  }
}
