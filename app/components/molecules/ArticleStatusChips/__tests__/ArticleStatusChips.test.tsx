import React from 'react';
import { render } from '@testing-library/react-native';
import { ArticleStatusChips } from '../ArticleStatusChips';

describe('ArticleStatusChips', () => {
  it('should render read chip when isRead is true', () => {
    const { getByText } = render(
      <ArticleStatusChips isRead={true} />
    );
    expect(getByText('Read')).toBeTruthy();
  });

  it('should render saved chip when isSaved is true', () => {
    const { getByText } = render(
      <ArticleStatusChips isSaved={true} />
    );
    expect(getByText('Saved')).toBeTruthy();
  });

  it('should render favorite chip when isFavorite is true', () => {
    const { getByText } = render(
      <ArticleStatusChips isFavorite={true} />
    );
    expect(getByText('Favorite')).toBeTruthy();
  });

  it('should render multiple chips when multiple statuses are true', () => {
    const { getByText } = render(
      <ArticleStatusChips isRead={true} isSaved={true} isFavorite={true} />
    );
    
    expect(getByText('Read')).toBeTruthy();
    expect(getByText('Saved')).toBeTruthy();
    expect(getByText('Favorite')).toBeTruthy();
  });

  it('should return null when all statuses are false', () => {
    const { container } = render(
      <ArticleStatusChips isRead={false} isSaved={false} isFavorite={false} />
    );
    
    expect(container.children.length).toBe(0);
  });

  it('should return null when all statuses are undefined', () => {
    const { container } = render(
      <ArticleStatusChips />
    );
    
    expect(container.children.length).toBe(0);
  });

  it('should render only read chip when only isRead is true', () => {
    const { getByText, queryByText } = render(
      <ArticleStatusChips isRead={true} isSaved={false} isFavorite={false} />
    );
    
    expect(getByText('Read')).toBeTruthy();
    expect(queryByText('Saved')).toBeNull();
    expect(queryByText('Favorite')).toBeNull();
  });

  it('should render only saved chip when only isSaved is true', () => {
    const { getByText, queryByText } = render(
      <ArticleStatusChips isRead={false} isSaved={true} isFavorite={false} />
    );
    
    expect(getByText('Saved')).toBeTruthy();
    expect(queryByText('Read')).toBeNull();
    expect(queryByText('Favorite')).toBeNull();
  });

  it('should render only favorite chip when only isFavorite is true', () => {
    const { getByText, queryByText } = render(
      <ArticleStatusChips isRead={false} isSaved={false} isFavorite={true} />
    );
    
    expect(getByText('Favorite')).toBeTruthy();
    expect(queryByText('Read')).toBeNull();
    expect(queryByText('Saved')).toBeNull();
  });
});
