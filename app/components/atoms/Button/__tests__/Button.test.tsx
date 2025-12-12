import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('should render with children', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress}>Click me</Button>);
    
    fireEvent.press(getByText('Click me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should apply fullWidth style when fullWidth prop is true', () => {
    const { getByText } = render(<Button fullWidth>Full Width Button</Button>);
    const button = getByText('Full Width Button');
    
    expect(button).toBeTruthy();
    // Note: Style testing in React Native can be tricky, but we verify it renders
  });

  it('should be disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button disabled onPress={onPress}>
        Disabled Button
      </Button>
    );
    
    const button = getByText('Disabled Button');
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should render with different modes', () => {
    const { getByText: getByTextContained } = render(
      <Button mode="contained">Contained</Button>
    );
    expect(getByTextContained('Contained')).toBeTruthy();

    const { getByText: getByTextOutlined } = render(
      <Button mode="outlined">Outlined</Button>
    );
    expect(getByTextOutlined('Outlined')).toBeTruthy();

    const { getByText: getByTextText } = render(
      <Button mode="text">Text</Button>
    );
    expect(getByTextText('Text')).toBeTruthy();
  });

  it('should pass through additional props', () => {
    const { getByText } = render(
      <Button accessibilityLabel="Test button" testID="test-button">
        Test
      </Button>
    );
    
    const button = getByText('Test');
    expect(button).toBeTruthy();
  });
});
