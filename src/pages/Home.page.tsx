import { StopEdit, Stops } from '@/components';
import { MainContext, ScheduleContext } from '@/contexts';
import { useContext } from 'react';

interface HomePageType {
  open: boolean
}
export function HomePage({ open }: HomePageType) {
  if (!open) return <></>
  const { state } = useContext(ScheduleContext)
  if (!state) return <>Loading...</>
  return (
    <>
      <Stops open={!state.joined} />
      <StopEdit open={!!state.joined} />
    </>
  );
}
