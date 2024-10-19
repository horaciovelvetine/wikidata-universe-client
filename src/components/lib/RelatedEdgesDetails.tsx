import './RelatedEdgesDetails.css'
import { createRef, FC } from 'react';

import { Vertex } from '../../models';
import { MainAppLayoutSessionState } from '../../app/MainAppLayout';


interface RelatedEdgesDetailsDisplayProps {
  sessionSettingsState: MainAppLayoutSessionState;
  selectedVertex: Vertex | null;
}

const prfx = (sufx: string) => {
  return 'related-edges-details-' + sufx;
}

export const RelatedEdgesDetails: FC<RelatedEdgesDetailsDisplayProps> = ({ }) => {
  const displayRef = createRef<HTMLDivElement>();


  return (
    <div id={prfx('display')}>
    </div>
  );
};