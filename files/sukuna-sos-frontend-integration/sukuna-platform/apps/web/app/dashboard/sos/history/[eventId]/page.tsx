import HistoryDetailScreen from '@/components/dashboard/sos/HistoryDetailScreen';

export default function SosHistoryDetailPage({
  params,
}: {
  params: { eventId: string };
}) {
  return <HistoryDetailScreen eventId={params.eventId} />;
}
