import React from 'react';
import { useTheme, List } from 'react-native-paper';
import { Card, CardContent, Text, ListItem, Switch, SegmentedButtons, Button, Divider } from '../../atoms';
import type { NotificationTopic } from '../../../types/mobile-article';
import type { AppTheme } from '../../../theme/theme';
import { styles } from './NotificationSettings.styles';

export interface NotificationSettingsProps {
  enabled: boolean;
  topics: NotificationTopic;
  onToggle: () => void;
  onTopicChange: (topic: NotificationTopic) => void;
  onTestSimple: () => void;
  onTestWithArticle: () => void;
  onTestBackgroundFetch: () => void;
}

export function NotificationSettings({
  enabled,
  topics,
  onToggle,
  onTopicChange,
  onTestSimple,
  onTestWithArticle,
  onTestBackgroundFetch,
}: NotificationSettingsProps) {
  const theme = useTheme<AppTheme>();

  return (
    <Card style={styles.card} mode="elevated">
      <CardContent>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Notifications
        </Text>

        <ListItem
          title="Enable Notifications"
          description="Receive alerts for new mobile dev articles"
          left={(props: React.ComponentProps<typeof List.Icon>) => <List.Icon {...props} icon="bell" />}
          right={() => (
            <Switch
              value={enabled}
              onValueChange={onToggle}
              accessibilityLabel="Enable notifications"
              accessibilityRole="switch"
            />
          )}
        />

        {enabled && (
          <>
            <Divider style={styles.divider} />

            <Text variant="bodyMedium" style={styles.sectionLabel}>
              Article Topics
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.custom.colors.textSecondary, marginBottom: 12 }}
            >
              Choose which mobile platform articles you want notifications for
            </Text>

            <SegmentedButtons
              value={topics}
              onValueChange={(value) => onTopicChange(value as NotificationTopic)}
              buttons={[
                {
                  value: 'android',
                  label: 'Android',
                  icon: 'android',
                },
                {
                  value: 'ios',
                  label: 'iOS',
                  icon: 'apple',
                },
                {
                  value: 'both',
                  label: 'Both',
                  icon: 'cellphone',
                },
              ]}
            />

            <Divider style={styles.divider} />

            <Text variant="bodyMedium" style={styles.sectionLabel}>
              Test Notifications
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.custom.colors.textSecondary, marginBottom: 12 }}
            >
              Test your notification setup
            </Text>

            <Button
              mode="outlined"
              onPress={onTestSimple}
              style={styles.testButton}
              icon="bell-ring"
              accessibilityLabel="Send a simple test notification"
            >
              Simple Test
            </Button>

            <Button
              mode="outlined"
              onPress={onTestWithArticle}
              style={styles.testButton}
              icon="newspaper"
              accessibilityLabel="Send a test notification with article link"
            >
              Test with Article Link
            </Button>

            <Button
              mode="contained"
              onPress={onTestBackgroundFetch}
              style={styles.testButton}
              icon="refresh"
              accessibilityLabel="Test background fetch for new articles"
            >
              Test Background Fetch
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
