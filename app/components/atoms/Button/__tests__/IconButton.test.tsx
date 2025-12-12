import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { IconButton } from '../IconButton';

describe('IconButton', () => {
  it('should render with icon', () => {
    const { getByTestId } = render(
      <IconButton icon="heart" testID="icon-button" />
    );
    
    expect(getByTestId('icon-button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <IconButton icon="heart" onPress={onPress} testID="icon-button" />
    );
    
    fireEvent.press(getByTestId('icon-button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <IconButton
        icon="heart"
        disabled
        onPress={onPress}
        testID="icon-button"
      />
    );
    
    const button = getByTestId('icon-button');
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should render with different sizes', () => {
    const { getByTestId: getByTestIdSmall } = render(
      <IconButton icon="heart" size={20} testID="icon-button-small" />
    );
    expect(getByTestIdSmall('icon-button-small')).toBeTruthy();

    const { getByTestId: getByTestIdLarge } = render(
      <IconButton icon="heart" size={40} testID="icon-button-large" />
    );
    expect(getByTestIdLarge('icon-button-large')).toBeTruthy();
  });

  it('should apply custom icon color', () => {
    const { getByTestId } = render(
      <IconButton icon="heart" iconColor="#FF0000" testID="icon-button" />
    );
    
    expect(getByTestId('icon-button')).toBeTruthy();
  });

  it('should have accessibility label when provided', () => {
    const { getByLabelText } = render(
      <IconButton
        icon="heart"
        accessibilityLabel="Like article"
        testID="icon-button"
      />
    );
    
    expect(getByLabelText('Like article')).toBeTruthy();
  });
});
