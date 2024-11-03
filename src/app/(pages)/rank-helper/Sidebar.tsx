import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';

export function RankedSidebar({onChange}: {onChange: (obj: { lane: string; }) => void}) {
  return (
    <div className={"w-full min-h-screen"}>
      <Card className={"h-full"}>
        <CardContent>
          <section>
            <h3 className={'text-neutral-400'}>Type</h3>
            <RankedButton label={'Solo'} />
            <RankedButton label={'Trio'} />
            <RankedButton label={'Full Squad'} />
          </section>
          <section>
            <h3 className={'text-neutral-400'}>Hero Type</h3>
            <Button className={'w-full'} variant={'ghost'} onClick={() => onChange({lane: "Jungle"})}>Jungle</Button>
            <Button className={'w-full'} variant={'ghost'} onClick={() => onChange({lane: "Mid Lane"})}>Mid Lane</Button>
            <Button className={'w-full'} variant={'ghost'} onClick={() => onChange({lane: "Gold Lane"})}>Gold Lane</Button>
            <Button className={'w-full'} variant={'ghost'} onClick={() => onChange({lane: "Exp Lane"})}>Exp Lane</Button>
            <Button className={'w-full'} variant={'ghost'} onClick={() => onChange({lane: "Roam"})}>Roam</Button>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}

function RankedButton({ label }: { label: string }) {
  return (
    <Button className={'w-full'} variant={'ghost'}>{label}</Button>
  )
}