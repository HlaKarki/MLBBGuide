import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const AbilityBar = ({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color?: string;
}) => {
  if (!color) {
    switch (label) {
      case 'Durability':
        color = 'bg-green-500';
        break;
      case 'Offense':
        color = 'bg-red-500';
        break;
      case 'Ability Effects':
        color = 'bg-purple-500';
        break;
      case 'Difficulty':
        color = 'bg-yellow-500';
        break;
      default:
        color = 'bg-blue-500';
    }
  }
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center gap-2">
            <div className="w-full bg-gray-700 rounded-full h-2.5 relative overflow-hidden">
              <div
                className={`${color} h-2.5 rounded-full transition-all duration-300 ease-in-out`}
                style={{ width: `${value}%` }}
              />
              {value}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {label}: {value}/100
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
