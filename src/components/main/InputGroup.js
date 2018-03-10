import React from 'react'
import {
  InputGroup,
  InputGroupAddon,
  Input,
  Button
} from 'reactstrap'

export default ({
  color,
  name,
  readOnly,
  state,
  handleState,
  placeholder,
  handleClick,
  btnName
}) => <InputGroup>
  <InputGroupAddon addonType='prepend'>
    <Button color={color}>{name}</Button>
  </InputGroupAddon>
  <Input
    readOnly={readOnly}
    value={state}
    onChange={handleState}
    placeholder={placeholder}
  />
  <InputGroupAddon addonType='append'>
    <Button onClick={handleClick} color='primary'>{btnName}</Button>
  </InputGroupAddon>
</InputGroup>
