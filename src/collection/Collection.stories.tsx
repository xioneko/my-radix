import Collection from "."
import { memo, useEffect, useState } from "react"

export default {
  title: "Base/Collection",
}

export const Basic = () => (
  <List>
    <Item>Red</Item>
    <Item disabled>Green</Item>
    <Item>Blue</Item>
    <LogItems />
  </List>
)

export const WithElementInBetween = () => (
  <List>
    <div style={{ fontVariant: "small-caps" }}>Colors</div>
    <Item>Red</Item>
    <Item disabled>Green</Item>
    <Item>Blue</Item>
    <div style={{ fontVariant: "small-caps" }}>Words</div>
    <Item>Hello</Item>
    <Item>World</Item>
    <LogItems />
  </List>
)

const Tomato = () => <Item style={{ color: "tomato" }}>Tomato</Item>

export const WithWrappedItem = () => (
  <List>
    <Item>Red</Item>
    <Item disabled>Green</Item>
    <Item>Blue</Item>
    <Tomato />
    <LogItems />
  </List>
)

export const WithFragment = () => {
  const countries = (
    <>
      <Item>France</Item>
      <Item disabled>UK</Item>
      <Item>Spain</Item>
    </>
  )
  return (
    <List>
      {countries}
      <LogItems />
    </List>
  )
}

export const DynamicInsertion = () => {
  const [hasTomato, setHasTomato] = useState(false)
  const [, forceUpdate] = useState<any>()
  return (
    <>
      <button onClick={() => setHasTomato(!hasTomato)}>
        {hasTomato ? "Remove" : "Add"} Tomato
      </button>
      <button onClick={() => forceUpdate({})} style={{ marginLeft: 10 }}>
        Force Update
      </button>

      <List>
        <MemoItems hasTomato={hasTomato} />
        <LogItems />
      </List>
    </>
  )
}

function WrappedItems({ hasTomato }: any) {
  return (
    <>
      <MemoItem>Red</MemoItem>
      {hasTomato ? <Tomato /> : null}
      <MemoItem disabled>Green</MemoItem>
      <MemoItem>Blue</MemoItem>
    </>
  )
}

export const WithChangingItem = () => {
  const [isDisabled, setIsDisabled] = useState(false)
  return (
    <>
      <button onClick={() => setIsDisabled(!isDisabled)}>
        {isDisabled ? "Enable" : "Disable"} Green
      </button>

      <List>
        <Item>Red</Item>
        <Item disabled={isDisabled}>Green</Item>
        <Item>Blue</Item>
        <LogItems />
      </List>
    </>
  )
}

export const Nested = () => (
  <List>
    <Item>1</Item>
    <Item>
      2
      <List>
        <Item>2.1</Item>
        <Item>2.2</Item>
        <Item>2.3</Item>
        <LogItems name="items inside 2" />
      </List>
    </Item>
    <Item>3</Item>
    <LogItems name="top-level items" />
  </List>
)

const List = (props: { children: React.ReactNode }) => {
  return (
    <Collection.Root>
      <ul {...props} style={{ width: 200 }} />
    </Collection.Root>
  )
}

type ItemProps = React.ComponentPropsWithRef<"li"> & {
  children: React.ReactNode
  disabled?: boolean
}

function Item({ disabled = false, ...props }: ItemProps) {
  return (
    <Collection.Item disabled={disabled}>
      <li {...props} style={{ ...props.style, opacity: disabled ? 0.3 : undefined }} />
    </Collection.Item>
  )
}

const MemoItem = memo(Item)
const MemoItems = memo(WrappedItems)

function LogItems({ name = "items" }: { name?: string }) {
  const getItems = Collection.useCollection()
  useEffect(() => console.log(name, getItems()))
  return null
}
