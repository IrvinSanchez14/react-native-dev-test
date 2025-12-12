import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from '../Text';

describe('Text', () => {
  it('should render text content', () => {
    const { getByText } = render(<Text>Hello World</Text>);
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('should render with different variants', () => {
    const { getByText: getByTextTitle } = render(
      <Text variant="titleLarge">Title</Text>
    );
    expect(getByTextTitle('Title')).toBeTruthy();

    const { getByText: getByTextBody } = render(
      <Text variant="bodyMedium">Body</Text>
    );
    expect(getByTextBody('Body')).toBeTruthy();

    const { getByText: getByTextLabel } = render(
      <Text variant="labelSmall">Label</Text>
    );
    expect(getByTextLabel('Label')).toBeTruthy();
  });

  it('should apply numberOfLines prop', () => {
    const longText = 'This is a very long text that should be truncated';
    const { getByText } = render(
      <Text numberOfLines={2}>{longText}</Text>
    );
    
    expect(getByText(longText)).toBeTruthy();
  });

  it('should pass through additional props', () => {
    const { getByText } = render(
      <Text testID="test-text" accessibilityLabel="Test text">
        Test
      </Text>
    );
    
    expect(getByText('Test')).toBeTruthy();
  });
});
