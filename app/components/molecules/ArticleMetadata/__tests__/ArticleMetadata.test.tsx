import React from 'react';
import { render } from '@testing-library/react-native';
import { ArticleMetadata } from '../ArticleMetadata';
import type { Article } from '../../../../types/article';

// Mock dateHelpers
jest.mock('../../../../utils/dateHelpers', () => ({
  formatRelativeTime: jest.fn((timestamp) => `${timestamp} seconds ago`),
}));

const createMockArticle = (overrides?: Partial<Article>): Article => ({
  id: 1,
  title: 'Test Article',
  url: 'https://example.com',
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

describe('ArticleMetadata', () => {
  it('should render article metadata', () => {
    const article = createMockArticle();
    const { getByText } = render(<ArticleMetadata article={article} />);
    
    expect(getByText('100')).toBeTruthy(); // score
    expect(getByText('testuser')).toBeTruthy(); // author
    expect(getByText('50')).toBeTruthy(); // comments
  });

  it('should display comments when showComments is true and descendants > 0', () => {
    const article = createMockArticle({ descendants: 25 });
    const { getByText } = render(
      <ArticleMetadata article={article} showComments={true} />
    );
    
    expect(getByText('25')).toBeTruthy();
  });

  it('should not display comments when showComments is false', () => {
    const article = createMockArticle({ descendants: 25 });
    const { queryByText } = render(
      <ArticleMetadata article={article} showComments={false} />
    );
    
    // Comments count should not be visible
    expect(queryByText('25')).toBeNull();
  });

  it('should not display comments when descendants is 0', () => {
    const article = createMockArticle({ descendants: 0 });
    const { queryByText } = render(
      <ArticleMetadata article={article} showComments={true} />
    );
    
    expect(queryByText('0')).toBeNull();
  });

  it('should not display comments when descendants is undefined', () => {
    const article = createMockArticle({ descendants: undefined });
    const { queryByText } = render(
      <ArticleMetadata article={article} showComments={true} />
    );
    
    // Should not render comments section
    expect(queryByText('0')).toBeNull();
  });

  it('should render with different article scores', () => {
    const article = createMockArticle({ score: 500 });
    const { getByText } = render(<ArticleMetadata article={article} />);
    
    expect(getByText('500')).toBeTruthy();
  });

  it('should render with different authors', () => {
    const article = createMockArticle({ by: 'anotheruser' });
    const { getByText } = render(<ArticleMetadata article={article} />);
    
    expect(getByText('anotheruser')).toBeTruthy();
  });
});
