import React from 'react'
import { Story, ComponentMeta } from '@storybook/react'

import Tabs, { TabProps } from '@/components/Tabs'

export default {
  title: 'Atom/Tabs',
  component: Tabs,
  argTypes: {
    width: {
      control: { type: 'range', min: 420, max: 1600, step: 50 },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Vy0NbZMTj6yq3b7vBWMezV/Wasted-Talent-rebrand?node-id=846%3A64209',
    },
  },
} as ComponentMeta<typeof Tabs>

const Template: Story<TabProps & { width: number }> = (args) => (
  <div className="bg-gray-700 p-5">
    <Tabs {...args} />
  </div>
)

export const Primary = Template.bind({})

Primary.args = {
  currentValue: "SWAP",
  values: ['SWAP', 'LIMIT ORDER', 'STOP LOSS'],
  onChange: (newTab: string) => console.log(newTab)
}
