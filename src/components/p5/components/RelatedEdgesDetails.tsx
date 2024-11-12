import './RelatedEdgesDetails.css'
import { VertexSel, Vertex as VertIcon } from '../../../assets/icons';
import { createRef, FC, useEffect, useState } from 'react';

import { Edge, EDGE_DIR, SketchManager, Vertex } from '../../../models';
import { edgeDirectionIcon } from '../..';
import { MainAppLayoutState } from '../../../app/MainAppLayoutState';


interface RelatedEdgesDetailsDisplayProps {
  mainAppLayoutState: MainAppLayoutState;
}

const prfx = (sufx: string) => {
  return 'related-edges-details-' + sufx;
}

export const RelatedEdgesDetails: FC<RelatedEdgesDetailsDisplayProps> = ({ mainAppLayoutState }) => {
  const { selectedVertex, p5SketchRef } = mainAppLayoutState
  const [relatedEdges, setRelatedEdges] = useState<Edge[]>([]);
  const displayRef = createRef<HTMLDivElement>();
  const headerRef = createRef<HTMLHeadingElement>();

  useEffect(() => {
    displayRef.current!.style.transform = 'translateY(400%)';
    if (!p5SketchRef) return;

    if (!selectedVertex) {
      setRelatedEdges([]);
      return;
    }

    const relatedEdges = p5SketchRef.GRAPH().getRelatedEdges(selectedVertex);
    setRelatedEdges(relatedEdges)
    if (relatedEdges.length > 0) {
      displayRef.current!.style.transform = 'translateY(0)';
    }

  }, [selectedVertex, p5SketchRef?.GRAPH()])

  return (
    <div id={prfx('display')} ref={displayRef} onWheel={(e) => { e.stopPropagation() }}>
      <h3 id={prfx('header')} ref={headerRef}>
        related statements
      </h3>
      <div id={prfx('cont')} onWheel={(e) => { e.stopPropagation() }}>
        <ul id={prfx('list')} onWheel={(e) => { e.stopPropagation() }}>
          {relatedEdges.map((edge, index) =>
          (<EdgeDetail
            key={index}
            {...{ edge, sketchRef: mainAppLayoutState.p5SketchRef, selectedVertex: mainAppLayoutState.selectedVertex, relatedEdges }}
          />))}
        </ul>
      </div>
    </div>
  );
};

interface EdgeDetailProps {
  edge: Edge;
  sketchRef: SketchManager | null;
  selectedVertex: Vertex | null;
  relatedEdges: Edge[];
}

const EdgeDetail: FC<EdgeDetailProps> = ({ edge, sketchRef, selectedVertex, relatedEdges }) => {
  if (sketchRef == null) return <></>;
  if (selectedVertex == null) return <></>;

  const altVertexId = edge.srcId == selectedVertex.id ? edge.tgtId : edge.srcId;
  const property = sketchRef.GRAPH().getProperty(edge.propertyId);
  const altVertex = sketchRef.GRAPH().getVertex(altVertexId)
  
  //! assertions as any missing values are caught in the getRelated filtering process previous to this
  const isParalellEdge = selectedVertex.parallelEdges(altVertex!, edge, relatedEdges);
  const edgeDirection = isParalellEdge!.length > 0 ? EDGE_DIR.PARALLEL : edge.getEdgeDirection(selectedVertex!);
  const icon = edgeDirectionIcon(edgeDirection);

  const propertyTextColor = () => {
    switch (edgeDirection) {
      case EDGE_DIR.INCOMING:
        return 'incoming'
      case EDGE_DIR.OUTGOING:
        return 'outgoing'
      default:
        return 'parallel'
    }
  }
  return (
    <li id={prfx('edge')} onWheel={(e) => { e.stopPropagation() }}>
      <a id={prfx('cur-sel-vert')} onClick={() => sketchRef.CAM().setLookAtTgt(selectedVertex.coords)}>
        <img id={prfx('cur-sel-vert-icon')} src={VertexSel} />
      </a>
      <a id={prfx('prop-cont')} href={property!.url()} target='_blank'>
        <img id={prfx('dir-icon')} src={icon} />
        <p id={prfx('property')} className={propertyTextColor()}>{property!.label}</p>
        <img id={prfx('dir-icon')} src={icon} />
      </a>
      <a id={prfx('alt-vert-cont')} onClick={() => sketchRef.CAM().setLookAtTgt(altVertex!.coords)}>
        <img id={prfx('alt-vert-icon')} src={VertIcon} />
        <p id={prfx('alt-vert-lbl')}>{altVertex!.label}</p>
      </a>
    </li>
  )
}