export type Scope = symbol

export function createScope(name: string = "Anonymous"): Scope {
  return Symbol(`${name} Scope`)
}