import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Chip } from '../Chip';

describe('Chip', () => {
  it('should render with text', () => {
    const { getByText } = render(<Chip>Test Chip</Chip>);
    expect(getByText('Test Chip')).toBeTruthy();
  });

  it('should render with icon', () => {
    const { getByText } = render(
      <Chip icon="star">Starred</Chip>
    );
    expect(getByText('Starred')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Chip onPress={onPress}>Clickable Chip</Chip>
    );
    
    fireEvent.press(getByText('Clickable Chip'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should render with different modes', () => {
    const { getByText: getByTextFlat } = render(
      <Chip mode="flat">Flat Chip</Chip>
    );
    expect(getByTextFlat('Flat Chip')).toBeTruthy();

    const { getByText: getByTextOutlined } = render(
      <Chip mode="outlined">Outlined Chip</Chip>
    );
    expect(getByTextOutlined('Outlined Chip')).toBeTruthy();
  });

  it('should be disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Chip disabled onPress={onPress}>
        Disabled Chip
      </Chip>
    );
    
    const chip = getByText('Disabled Chip');
    fireEvent.press(chip);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should render as compact when compact prop is true', () => {
    const { getByText } = render(
      <Chip compact>Compact Chip</Chip>
    );
    expect(getByText('Compact Chip')).toBeTruthy();
  });
});
