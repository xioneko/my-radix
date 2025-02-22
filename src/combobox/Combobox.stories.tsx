import Combobox from "."
import * as styles from "./Combobox.stories.css"

export default {
  title: "Base/Combobox",
}

export const Styled = () => {
  return (
    <Combobox.Root>
      <Combobox.Input className={styles.input} placeholder="Enter some text..." />
      <Combobox.Content className={styles.content}>
        {Items.map(item => (
          <Combobox.Item className={styles.item} key={item} value={item}>
            {item}
          </Combobox.Item>
        ))}
      </Combobox.Content>
    </Combobox.Root>
  )
}

export const WithGroup = () => {
  return (
    <Combobox.Root>
      <Combobox.Input className={styles.input} placeholder="Enter some text..." />
      <Combobox.Content className={styles.content}>
        {Array.from(
          Map.groupBy(Items, item => item[0].toUpperCase())
            .entries()
            .map(([letter, items]) => (
              <Combobox.Group className={styles.group} key={letter}>
                <Combobox.Label className={styles.label}>{letter}</Combobox.Label>
                {items.map(item => (
                  <Combobox.Item className={styles.item} key={item} value={item}>
                    {item}
                  </Combobox.Item>
                ))}
              </Combobox.Group>
            )),
        )}
      </Combobox.Content>
    </Combobox.Root>
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
