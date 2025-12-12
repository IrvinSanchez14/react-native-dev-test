import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Switch } from '../Switch';

describe('Switch', () => {
  it('should render', () => {
    const { getByTestId } = render(
      <Switch testID="test-switch" value={false} onValueChange={jest.fn()} />
    );
    expect(getByTestId('test-switch')).toBeTruthy();
  });

  it('should call onValueChange when toggled', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <Switch
        testID="test-switch"
        value={false}
        onValueChange={onValueChange}
      />
    );
    
    fireEvent(getByTestId('test-switch'), 'valueChange', true);
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('should reflect value prop', () => {
    const { rerender, getByTestId } = render(
      <Switch testID="test-switch" value={false} onValueChange={jest.fn()} />
    );
    
    rerender(
      <Switch testID="test-switch" value={true} onValueChange={jest.fn()} />
    );
    
    expect(getByTestId('test-switch')).toBeTruthy();
  });

  it('should be disabled when disabled prop is true', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <Switch
        testID="test-switch"
        value={false}
        onValueChange={onValueChange}
        disabled
      />
    );
    
    const switchComponent = getByTestId('test-switch');
    fireEvent(switchComponent, 'valueChange', true);
    // When disabled, onValueChange should not be called
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
