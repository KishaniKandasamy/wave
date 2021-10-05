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
import { wave } from './ui'
import React from 'react'
import { View } from './tall_info'
import { box, Model } from 'h2o-wave'

const
  name = 'tall_info',
  pushMock = jest.fn()
let tallInfoProps: Model<any>

describe('TallInfo.tsx', () => {
  beforeAll(() => wave.push = pushMock)
  beforeEach(() => {
    pushMock.mockReset()
    tallInfoProps = {
      name,
      state: { title: name },
      changed: box(false)
    }
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...tallInfoProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not submit data to server if name specified but starts with #', () => {
    tallInfoProps.state.name = `#${name}`
    const { getByTestId } = render(<View {...tallInfoProps} />)
    fireEvent.click(getByTestId(name))
    expect(pushMock).not.toHaveBeenCalled()
    expect(wave.args[name]).toBeUndefined()
  })

  it('Submits data to server if name specified without #', () => {
    tallInfoProps.state.name = name
    const { getByTestId } = render(<View {...tallInfoProps} />)
    fireEvent.click(getByTestId(name))
    expect(pushMock).toHaveBeenCalled()
    expect(wave.args[name]).toBe(name)
  })
})