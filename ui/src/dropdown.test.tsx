// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { fireEvent, render } from '@testing-library/react'
import * as T from 'h2o-wave'
import React from 'react'
import { Dropdown, XDropdown } from './dropdown'

const name = 'dropdown-test'
const defaultProps: Dropdown = {
  name,
  label: name,
  choices: [
    { name: 'A', label: 'Choice A' },
    { name: 'B', label: 'Choice B' },
    { name: 'C', label: 'Choice C' },
    { name: 'D', label: 'Choice D' },
  ]
}
describe('Dropdown.tsx', () => {

  describe('Base dropdown', () => {
    it('Renders data-test attr', () => {
      const { queryByTestId } = render(<XDropdown model={defaultProps} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })

    it('Does not display dropdown when visible is false', () => {
      const { queryByTestId } = render(<XDropdown model={{ ...defaultProps, visible: false }} />)
      expect(queryByTestId(name)).toBeInTheDocument()
      expect(queryByTestId(name)).not.toBeVisible()
    })

    it('Calls qd.sync() when trigger is on', () => {
      const { getByTestId, getByText } = render(<XDropdown model={{ ...defaultProps, trigger: true }} />)
      const syncMock = jest.fn()
      T.wave.sync = syncMock

      fireEvent.click(getByTestId(name))
      fireEvent.click(getByText('Choice A'))

      expect(syncMock).toHaveBeenCalled()
    })

    it('Does not call qd.sync() when trigger is off', () => {
      const { getByTestId, getByText } = render(<XDropdown model={defaultProps} />)
      const syncMock = jest.fn()
      T.wave.sync = syncMock

      fireEvent.click(getByTestId(name))
      fireEvent.click(getByText('Choice A'))

      expect(syncMock).not.toHaveBeenCalled()
    })

    it('Returns a single item when selected', () => {
      const { getByTestId, getByText } = render(<XDropdown model={defaultProps} />)

      fireEvent.click(getByTestId(name))
      fireEvent.click(getByText('Choice A'))

      expect(T.wave.args[name]).toBe('A')
    })

    it('Returns a single item on init', () => {
      render(<XDropdown model={{ ...defaultProps, value: 'A' }} />)
      expect(T.wave.args[name]).toBe('A')
    })

    it('Returns multiple items on init', () => {
      render(<XDropdown model={{ ...defaultProps, values: ['A', 'B'] }} />)
      expect(T.wave.args[name]).toMatchObject(['A', 'B'])
    })

    it('Returns null when value not specified - init', () => {
      render(<XDropdown model={defaultProps} />)
      expect(T.wave.args[name]).toBeNull()
    })

    it('Returns multiple items on select', () => {
      const { getByTestId, getByText } = render(<XDropdown model={{ ...defaultProps, values: [] }} />)
      fireEvent.click(getByTestId(name))
      fireEvent.click(getByText('Choice A').parentElement!)
      fireEvent.click(getByText('Choice B').parentElement!)

      expect(T.wave.args[name]).toMatchObject(['A', 'B'])
    })

    it('Returns multiple items on init', () => {
      render(<XDropdown model={{ ...defaultProps, values: ['A', 'B'] }} />)
      expect(T.wave.args[name]).toMatchObject(['A', 'B'])
    })

    it('Returns null when value not specified - init', () => {
      render(<XDropdown model={defaultProps} />)
      expect(T.wave.args[name]).toBeNull()
    })

    it('Shows correct selection in UI on select', () => {
      const { getByTestId, getByText, getAllByText } = render(<XDropdown model={{ ...defaultProps, values: ['A'] }} />)

      fireEvent.click(getByTestId(name))
      fireEvent.click(getAllByText('Choice B')[0].parentElement!)

      expect(getByText('Choice A, Choice B')).toBeInTheDocument()
    })

    it('Selects all options on Select all', () => {
      const { getByText } = render(<XDropdown model={{ ...defaultProps, values: ['A'] }} />)

      fireEvent.click(getByText('Select All'))

      expect(T.wave.args[name]).toMatchObject(['A', 'B', 'C', 'D'])
    })

    it('Selects all options on Select all - except disabled', () => {
      const choices = [
        { name: 'A', label: 'Choice A' },
        { name: 'B', label: 'Choice B' },
        { name: 'C', label: 'Choice C', disabled: true },
        { name: 'D', label: 'Choice D' },
      ]
      const { getByText } = render(<XDropdown model={{ ...defaultProps, choices, values: ['A'] }} />)

      fireEvent.click(getByText('Select All'))

      expect(T.wave.args[name]).toMatchObject(['A', 'B', 'D'])
    })

    it('Calls sync on Select all - trigger enabled', () => {
      const { getByText } = render(<XDropdown model={{ ...defaultProps, values: ['A'], trigger: true }} />)
      const syncMock = jest.fn()
      T.wave.sync = syncMock

      fireEvent.click(getByText('Select All'))

      expect(syncMock).toHaveBeenCalled()
      expect(T.wave.args[name]).toMatchObject(['A', 'B', 'C', 'D'])
    })

    it('Deselects all options on Deselect all', () => {
      const { getByText } = render(<XDropdown model={{ ...defaultProps, values: ['A', 'B', 'C', 'D'] }} />)

      fireEvent.click(getByText('Deselect All'))

      expect(T.wave.args[name]).toMatchObject([])
    })

    it('Calls sync on Deselect all - trigger enabled', () => {
      const { getByText } = render(<XDropdown model={{ ...defaultProps, values: ['A'], trigger: true }} />)
      const syncMock = jest.fn()
      T.wave.sync = syncMock

      fireEvent.click(getByText('Deselect All'))

      expect(syncMock).toHaveBeenCalled()
    })
  })


  describe('Dialog dropdown', () => {
    const dialogProps: Dropdown = {
      ...defaultProps,
      choices: Array.from(Array(101).keys()).map(key => ({ name: String(key), label: `Choice ${key}` }))
    }

    it('Renders data-test attr', () => {
      const { queryByTestId } = render(<XDropdown model={dialogProps} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })

    it('Does not display dropdown when visible is false', () => {
      const { queryByTestId } = render(<XDropdown model={{ ...dialogProps, visible: false }} />)
      expect(queryByTestId(name)).toBeInTheDocument()
      expect(queryByTestId(name)).not.toBeVisible()
    })

    it('Calls sync on Deselect all - trigger enabled', () => {
      const { getByText } = render(<XDropdown model={{ ...defaultProps, values: ['A'], trigger: true }} />)
      const syncMock = jest.fn()
      T.wave.sync = syncMock

      fireEvent.click(getByText('Deselect All'))
      expect(T.wave.args[name]).toMatchObject([])
    })

    it('Returns null when value not specified - init', () => {
      render(<XDropdown model={dialogProps} />)
      expect(T.wave.args[name]).toBeNull()
    })

    it('Returns multiple items on select', () => {
      const { getByText, getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      fireEvent.click(getAllByRole('checkbox')[1])
      fireEvent.click(getAllByRole('checkbox')[2])
      fireEvent.click(getByText('Select'))

      expect(T.wave.args[name]).toMatchObject(['1', '2'])
    })

    it('Shows correct selection in UI - init single value', () => {
      const { getByDisplayValue } = render(<XDropdown model={{ ...dialogProps, value: '1' }} />)
      expect(getByDisplayValue('Choice 1')).toBeInTheDocument()
    })

    it('Shows correct selection in UI - init multi values', () => {
      const { getByDisplayValue } = render(<XDropdown model={{ ...dialogProps, values: ['1', '2'] }} />)
      expect(getByDisplayValue('Choice 1, Choice 2')).toBeInTheDocument()
    })

    it('Shows none selection in UI - deselect', () => {
      const { getByText, getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: ['1', '2'] }} />)
      expect(getByTestId(name)).toHaveValue('Choice 1, Choice 2')

      fireEvent.click(getByTestId(name))
      fireEvent.click(getAllByRole('checkbox')[1])
      fireEvent.click(getAllByRole('checkbox')[2])
      fireEvent.click(getByText('Select'))

      expect(getByTestId(name)).toHaveTextContent('')
    })

    it('Shows correct selection in UI - submit', () => {
      const { getByTestId, getByText, queryByDisplayValue, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      fireEvent.click(getAllByRole('checkbox')[1])
      fireEvent.click(getAllByRole('checkbox')[2])
      fireEvent.click(getByText('Select'))

      expect(queryByDisplayValue('Choice 1, Choice 2')).toBeInTheDocument()
    })

    it('Does not submit values on cancel', () => {
      const { getByText, getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: ['1'] }} />)

      fireEvent.click(getByTestId(name))
      fireEvent.click(getAllByRole('checkbox')[1])
      fireEvent.click(getByText('Cancel'))

      expect(getByTestId(name)).toHaveValue('Choice 1')
    })

    it('Has correct number of initially checked checkboxes', () => {
      const { getByText, getAllByRole, getByTestId } = render(<XDropdown model={{ ...dialogProps, values: ['1'] }} />)

      fireEvent.click(getByTestId(name))
      fireEvent.click(getByText('Choice 1'))

      expect(getAllByRole('checkbox').filter(c => c.getAttribute('aria-checked') === 'true')).toHaveLength(1)
    })

    it('Has correct number of checked checkboxes - check and cancel', () => {
      const { getByText, getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      fireEvent.click(getAllByRole('checkbox')[2])
      fireEvent.click(getAllByRole('checkbox')[3])
      fireEvent.click(getAllByRole('checkbox')[4])
      fireEvent.click(getByText('Cancel'))
      fireEvent.click(getByTestId(name))

      expect(getAllByRole('checkbox').filter(i => i.getAttribute('aria-checked') === 'true')).toHaveLength(0)
    })

    it('Has correct number of checked checkboxes - check and submit', () => {
      const { getByText, getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      fireEvent.click(getAllByRole('checkbox')[2])
      fireEvent.click(getAllByRole('checkbox')[3])
      fireEvent.click(getAllByRole('checkbox')[4])
      fireEvent.click(getByText('Select'))
      fireEvent.click(getByTestId(name))

      expect(getAllByRole('checkbox').filter(c => c.getAttribute('aria-checked') === 'true')).toHaveLength(3)
    })

    it('Filters correctly', () => {
      const { getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      expect(getAllByRole('row')).toHaveLength(10) // Fluent Detaillist uses virtualization, so only first 10 rows are rendered.
      fireEvent.change(getByTestId(`${name}-search`), { target: { value: '22' } })
      expect(getAllByRole('row')).toHaveLength(1)
    })

    it('Filters correctly - reset filter', () => {
      const { getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      fireEvent.change(getByTestId(`${name}-search`), { target: { value: '22' } })
      expect(getAllByRole('row')).toHaveLength(1)

      fireEvent.change(getByTestId(`${name}-search`), { target: { value: '' } })
      expect(getAllByRole('row')).toHaveLength(10) // Fluent Detaillist uses virtualization, so only first 10 rows are rendered.
    })
  })

})