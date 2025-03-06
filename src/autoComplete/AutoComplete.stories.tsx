import AutoComplete from "."
import * as styles from "./AutoComplete.stories.css"

export default {
  title: "Base/AutoComplete",
}

export const Styled = () => {
  return (
    <AutoComplete.Root>
      <AutoComplete.Input className={styles.input} placeholder="Enter some text..." />
      <AutoComplete.Content className={styles.content}>
        {Items.map(item => (
          <AutoComplete.Item className={styles.item} key={item} value={item}>
            {item}
          </AutoComplete.Item>
        ))}
      </AutoComplete.Content>
    </AutoComplete.Root>
  )
}

export const WithGroup = () => {
  return (
    <AutoComplete.Root>
      <AutoComplete.Input className={styles.input} placeholder="Enter some text..." />
      <AutoComplete.Content className={styles.content}>
        {Array.from(
          Map.groupBy(Items, item => item[0].toUpperCase())
            .entries()
            .map(([letter, items]) => (
              <AutoComplete.Group className={styles.group} key={letter}>
                <AutoComplete.Label className={styles.label}>{letter}</AutoComplete.Label>
                {items.map(item => (
                  <AutoComplete.Item className={styles.item} key={item} value={item}>
                    {item}
                  </AutoComplete.Item>
                ))}
              </AutoComplete.Group>
            )),
        )}
      </AutoComplete.Content>
    </AutoComplete.Root>
  )
}

const Items = [
  "Alabama",
  "Alaska",
  "American Samoa",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Florida",
  "Georgia",
  "Guam",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Northern Marianas Islands",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Puerto Rico",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Virgin Islands",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
]
