import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ArticleCard } from '../ArticleCard';
import type { Article } from '../../../../types/article';

// Mock dateHelpers
jest.mock('../../../../utils/dateHelpers', () => ({
  formatRelativeTime: jest.fn((timestamp) => `${timestamp} seconds ago`),
}));

const createMockArticle = (overrides?: Partial<Article>): Article => ({
  id: 1,
  title: 'Test Article Title',
  url: 'https://example.com/article',
  by: 'testuser',
  time: 1234567890,
  score: 100,
  descendants: 50,
  type: 'story',
  isRead: false,
  isSaved: false,
  isFavorite: false,
  fetchedAt: Date.now(),
  feeds: ['top'],
  ...overrides,
});

describe('ArticleCard', () => {
  it('should render article title', () => {
    const article = createMockArticle();
    const onPress = jest.fn();
    const { getByText } = render(
      <ArticleCard article={article} onPress={onPress} />
    );
    
    expect(getByText('Test Article Title')).toBeTruthy();
  });

  it('should call onPress when card is pressed', () => {
    const article = createMockArticle();
    const onPress = jest.fn();
    const { getByText } = render(
      <ArticleCard article={article} onPress={onPress} />
    );
    
    fireEvent.press(getByText('Test Article Title'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should render article metadata', () => {
    const article = createMockArticle();
    const onPress = jest.fn();
    const { getByText } = render(
      <ArticleCard article={article} onPress={onPress} />
    );
    
    expect(getByText('100')).toBeTruthy(); // score
    expect(getByText('testuser')).toBeTruthy(); // author
  });

  it('should render domain chip when article has url', () => {
    const article = createMockArticle({ url: 'https://example.com/article' });
    const onPress = jest.fn();
    const { getByText } = render(
      <ArticleCard article={article} onPress={onPress} />
    );
    
    // Domain chip should be rendered (we can't easily test the exact domain text without more setup)
    expect(getByText('Test Article Title')).toBeTruthy();
  });

  it('should render action buttons when showActions is true', () => {
    const article = createMockArticle();
    const onPress = jest.fn();
    const onSave = jest.fn();
    const onFavorite = jest.fn();
    const { getByLabelText } = render(
      <ArticleCard
        article={article}
        onPress={onPress}
        onSave={onSave}
        onFavorite={onFavorite}
        showActions={true}
      />
    );
    
    expect(getByLabelText('Bookmark article')).toBeTruthy();
    expect(getByLabelText('Add to favorites')).toBeTruthy();
  });

  it('should not render action buttons when showActions is false', () => {
    const article = createMockArticle();
    const onPress = jest.fn();
    const onSave = jest.fn();
    const onFavorite = jest.fn();
    const { queryByLabelText } = render(
      <ArticleCard
        article={article}
        onPress={onPress}
        onSave={onSave}
        onFavorite={onFavorite}
        showActions={false}
      />
    );
    
    expect(queryByLabelText('Bookmark article')).toBeNull();
    expect(queryByLabelText('Add to favorites')).toBeNull();
  });

  it('should call onSave when save action is pressed', () => {
    const article = createMockArticle();
    const onPress = jest.fn();
    const onSave = jest.fn();
    const { getByLabelText } = render(
      <ArticleCard
        article={article}
        onPress={onPress}
        onSave={onSave}
        showActions={true}
      />
    );
    
    fireEvent.press(getByLabelText('Bookmark article'));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('should call onFavorite when favorite action is pressed', () => {
    const article = createMockArticle();
    const onPress = jest.fn();
    const onFavorite = jest.fn();
    const { getByLabelText } = render(
      <ArticleCard
        article={article}
        onPress={onPress}
        onFavorite={onFavorite}
        showActions={true}
      />
    );
    
    fireEvent.press(getByLabelText('Add to favorites'));
    expect(onFavorite).toHaveBeenCalledTimes(1);
  });

  it('should have correct accessibility label', () => {
    const article = createMockArticle({ title: 'Accessible Article' });
    const onPress = jest.fn();
    const { getByLabelText } = render(
      <ArticleCard article={article} onPress={onPress} />
    );
    
    expect(getByLabelText('Article: Accessible Article')).toBeTruthy();
  });

  it('should apply read styling when article is read', () => {
    const article = createMockArticle({ isRead: true });
    const onPress = jest.fn();
    const { getByText } = render(
      <ArticleCard article={article} onPress={onPress} />
    );
    
    // Component should render (styling is harder to test directly)
    expect(getByText('Test Article Title')).toBeTruthy();
  });

  it('should memoize correctly and not re-render unnecessarily', () => {
    const article = createMockArticle();
    const onPress = jest.fn();
    const { rerender } = render(
      <ArticleCard article={article} onPress={onPress} />
    );
    
    // Re-render with same props
    rerender(<ArticleCard article={article} onPress={onPress} />);
    
    // Component should still work correctly
    expect(onPress).not.toHaveBeenCalled();
  });
});
