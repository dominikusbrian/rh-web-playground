import { FC } from 'react';
import { CommentFilter, CommentSort, CommentType } from '@/types/comment';
import { BaseMenu, BaseMenuItem } from '@/components/ui/form/BaseMenu';
import { Button } from '@/components/ui/Button';
import { ChevronDown, Star, Clock, ArrowUp, MessageCircle, Filter } from 'lucide-react';
import { useComments } from '@/contexts/CommentContext';
import { BountyFilterType } from '@/contexts/CommentContext';

type SortOption = {
  label: string;
  value: CommentSort;
  icon: typeof Star | typeof Clock | typeof ArrowUp;
};

const sortOptions: SortOption[] = [
  { label: 'Best', value: 'BEST', icon: Star },
  { label: 'Newest', value: 'CREATED_DATE', icon: Clock },
  { label: 'Top', value: 'TOP', icon: ArrowUp },
];

interface CommentSortAndFiltersProps {
  commentType?: CommentType;
  commentCount: number;
}

export const CommentSortAndFilters: FC<CommentSortAndFiltersProps> = ({
  commentType = 'GENERIC_COMMENT',
  commentCount,
}) => {
  const { sortBy, setSortBy, bountyFilter, setBountyFilter } = useComments();

  const handleSortChange = (newSort: CommentSort) => {
    setSortBy(newSort);
  };

  const handleBountyFilterChange = (newFilter: BountyFilterType) => {
    setBountyFilter(newFilter);
  };

  return (
    <div className="flex items-center">
      <div className="flex items-center gap-2">
        {/* Sort Options */}
        <BaseMenu
          align="start"
          trigger={
            <Button variant="outlined" size="sm" className="flex items-center gap-1">
              {(() => {
                const currentOption = sortOptions.find((option) => option.value === sortBy);
                const Icon = currentOption?.icon || Star;
                return <Icon className="h-4 w-4 mr-1" />;
              })()}
              <span>{sortOptions.find((option) => option.value === sortBy)?.label || 'Sort'}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          }
        >
          {sortOptions.map((option) => {
            const Icon = option.icon;
            return (
              <BaseMenuItem
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={sortBy === option.value ? 'bg-gray-100' : ''}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{option.label}</span>
                </div>
              </BaseMenuItem>
            );
          })}
        </BaseMenu>
      </div>
    </div>
  );
};
