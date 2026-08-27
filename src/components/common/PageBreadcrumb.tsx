import { Link } from 'react-router-dom';
import { Icon } from './Icon';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export function PageBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      className="mb-4 flex flex-wrap items-center gap-1 font-sans text-sm text-secondary"
      aria-label="breadcrumb"
    >
      <Link to="/" className="flex items-center gap-1 hover:text-success-green">
        <Icon name="home" className="text-[16px]" /> หน้าหลัก
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-1">
            <Icon name="chevron_right" className="text-[16px] text-outline-variant" />
            {!isLast && item.to ? (
              <Link to={item.to} className="hover:text-success-green">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-medium text-on-surface' : ''}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
