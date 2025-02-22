import { AsChild } from "../shared/polymorphic"
import { createScope, type Scope } from "../shared/scope"
import { createContext, useContext, useLayoutEffect, useRef } from "react"

const CollectionScope = createScope("Collection")

export const Collection = createCollection(CollectionScope)

export function createCollection<ItemElement extends HTMLElement, ItemData = any>(scope: Scope) {
  type ItemsMap = Map<
    React.RefObject<ItemElement>,
    { ref: React.RefObject<ItemElement> } & ItemData
  >

  const CollectionContext = createContext<ItemsMap | null>(null)
  CollectionContext.displayName = `CollectionContext <${scope.description}>`

  /* ----------------------------- Collection Root ---------------------------- */

  const CollectionRoot = ({ children }: { children: React.ReactNode }) => {
    const itemsMapRef = useRef<ItemsMap>(new Map())
    return (
      <CollectionContext.Provider value={itemsMapRef.current}>
        {children}
      </CollectionContext.Provider>
    )
  }

  CollectionRoot.displayName = `Collection.Root <${scope.description}>`

  /* ----------------------------- Collection Item ---------------------------- */

  type CollectionItemProps = ItemData & {
    children: React.ReactNode
  }

  const CollectionItem = ({ children, ...itemData }: CollectionItemProps) => {
    const ref = useRef<ItemElement | null>(null)
    const itemsMap = useContext(CollectionContext)

    useLayoutEffect(() => {
      if (itemsMap) {
        const prevData = itemsMap.get(ref) ?? { ref }
        itemsMap.set(ref, Object.assign(prevData, itemData) as any)
        return () => {
          itemsMap.delete(ref)
        }
      }
    }, Object.values(itemData))

    return <AsChild ref={ref}>{children}</AsChild>
  }

  CollectionItem.displayName = `Collection.Item <${scope.description}>`

  /* ------------------------------ useCollection ----------------------------- */

  const useCollection = () => {
    const itemsMap = useContext(CollectionContext)
    return function getItems({ ordered = false } = {}) {
      if (!itemsMap) return []
      const items = Array.from(itemsMap.values())
      return ordered
        ? items.sort((a, b) =>
            a.ref.current!.compareDocumentPosition(b.ref.current!) & 2 ? 1 : -1,
          )
        : items
    }
  }

  return { Root: CollectionRoot, Item: CollectionItem, useCollection }
}
