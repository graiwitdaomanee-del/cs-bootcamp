import { Link } from 'react-router-dom';
import { Icon } from '../components/common/Icon';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background text-secondary">
      <Icon name="sentiment_dissatisfied" className="text-4xl" />
      <p className="font-sans">ไม่พบหน้านี้</p>
      <Link to="/" className="font-sans text-success-green hover:underline">
        กลับไปแดชบอร์ด
      </Link>
    </div>
  );
}
