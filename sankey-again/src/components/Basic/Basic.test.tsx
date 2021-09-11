/*
Author: Eli Elad Elrom
Website: https://EliElrom.com
License: MIT License
Component: src/component/Basic/Basic.test.tsx
*/

import React from 'react'
import { shallow } from 'enzyme'
import Basic from './Basic'

describe('<Basic />', () => {
  let component

  beforeEach(() => {
    component = shallow(<Basic />)
  });

  test('It should mount', () => {
    expect(component.length).toBe(1)
  })
})
