import './RelatedEdgesDetails.css'
import { createRef, FC } from 'react';

import { Vertex } from '../../models/Vertex';
import { SessionSettingsState } from '../../interfaces';

interface RelatedEdgesDetailsDisplayProps {
  sessionSettingsState: SessionSettingsState;
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