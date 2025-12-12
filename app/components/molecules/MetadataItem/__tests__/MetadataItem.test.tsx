import React from 'react';
import { render } from '@testing-library/react-native';
import { MetadataItem } from '../MetadataItem';

describe('MetadataItem', () => {
  it('should render icon and text', () => {
    const { getByText } = render(
      <MetadataItem icon="arrow-up" text="100" />
    );
    expect(getByText('100')).toBeTruthy();
  });

  it('should render with number text', () => {
    const { getByText } = render(
      <MetadataItem icon="account" text={42} />
    );
    expect(getByText('42')).toBeTruthy();
  });

  it('should render with string text', () => {
    const { getByText } = render(
      <MetadataItem icon="clock-outline" text="2 hours ago" />
    );
    expect(getByText('2 hours ago')).toBeTruthy();
  });

  it('should apply custom color when provided', () => {
    const { getByText } = render(
      <MetadataItem icon="arrow-up" text="100" color="#FF0000" />
    );
    expect(getByText('100')).toBeTruthy();
  });

  it('should render with different icons', () => {
    const { getByText: getByTextUp } = render(
      <MetadataItem icon="arrow-up" text="Score" />
    );
    expect(getByTextUp('Score')).toBeTruthy();

    const { getByText: getByTextComment } = render(
      <MetadataItem icon="comment-outline" text="Comments" />
    );
    expect(getByTextComment('Comments')).toBeTruthy();
  });
});
