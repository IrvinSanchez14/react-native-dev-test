import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DomainChip } from '../DomainChip';

// Mock Linking
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Linking: {
      openURL: jest.fn(() => Promise.resolve()),
    },
  };
});

describe('DomainChip', () => {
  it('should render domain from URL', () => {
    const { getByText } = render(
      <DomainChip url="https://example.com/article" />
    );
    expect(getByText('example.com')).toBeTruthy();
  });

  it('should remove www from domain', () => {
    const { getByText } = render(
      <DomainChip url="https://www.example.com/article" />
    );
    expect(getByText('example.com')).toBeTruthy();
  });

  it('should return null for invalid URL', () => {
    const { container } = render(<DomainChip url="not-a-url" />);
    expect(container.children.length).toBe(0);
  });

  it('should return null for empty URL', () => {
    const { container } = render(<DomainChip url="" />);
    expect(container.children.length).toBe(0);
  });

  it('should call onPress when provided and chip is pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <DomainChip url="https://example.com" onPress={onPress} />
    );
    
    fireEvent.press(getByText('example.com'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should open URL with Linking when onPress is not provided', () => {
    const Linking = require('react-native').Linking;
    const { getByText } = render(
      <DomainChip url="https://example.com/article" />
    );
    
    fireEvent.press(getByText('example.com'));
    expect(Linking.openURL).toHaveBeenCalledWith('https://example.com/article');
  });

  it('should handle different URL formats', () => {
    const { getByText: getByTextHttp } = render(
      <DomainChip url="http://example.com" />
    );
    expect(getByTextHttp('example.com')).toBeTruthy();

    const { getByText: getByTextHttps } = render(
      <DomainChip url="https://subdomain.example.com" />
    );
    expect(getByTextHttps('subdomain.example.com')).toBeTruthy();
  });

  it('should extract domain correctly from complex URLs', () => {
    const { getByText } = render(
      <DomainChip url="https://www.github.com/user/repo/issues/123" />
    );
    expect(getByText('github.com')).toBeTruthy();
  });
});
