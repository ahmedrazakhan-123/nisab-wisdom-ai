
// A simple analytics service for demonstration purposes.
// In a real application, this would integrate with a service like Google Analytics, Plausible, or PostHog.

type AnalyticsEvent = 
  | { name: 'calculate_zakat', props?: Record<string, any> }
  | { name: 'view_plans_cta', props?: { location: string } }
  | { name: 'try_chatbot_cta', props?: { location: string } };

/**
 * Tracks an analytics event.
 * @param event The event to track.
 */
export const trackEvent = (event: AnalyticsEvent) => {
  // In a real app, you would send this event to your analytics provider.
  // For example: window.plausible(event.name, { props: event.props });
  console.log(`[Analytics Event] Name: ${event.name}`, event.props ? `| Props: ${JSON.stringify(event.props)}` : '');
};
