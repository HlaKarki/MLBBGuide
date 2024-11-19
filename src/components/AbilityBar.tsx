import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const AbilityBar = ({
  value,
  label,
}: {
  value: number;
  label: string;
}) => {
  let color;
  let gradientColor;

  switch (label) {
    case 'Durability':
      color = 'bg-emerald-500/80';
      gradientColor = 'from-emerald-500/20 to-emerald-500/60';
      break;
    case 'Offense':
      color = 'bg-rose-500/80';
      gradientColor = 'from-rose-500/20 to-rose-500/60';
      break;
    case 'Ability Effects':
      color = 'bg-violet-500/80';
      gradientColor = 'from-violet-500/20 to-violet-500/60';
      break;
    case 'Difficulty':
      color = 'bg-amber-500/80';
      gradientColor = 'from-amber-500/20 to-amber-500/60';
      break;
    default:
      color = 'bg-blue-500/80';
      gradientColor = 'from-blue-500/20 to-blue-500/60';
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="w-full h-2.5 rounded-full bg-gray-900/60 backdrop-blur-sm relative overflow-hidden border border-violet-500/20">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${gradientColor} opacity-20`}
              />
              <div
                className={`${color} h-full rounded-full transition-all duration-300 ease-in-out backdrop-blur-sm`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-900/95 backdrop-blur-sm border-violet-500/20">
          <p className="text-violet-100">
            <span className="font-medium">{label}:</span> {value}/100
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
